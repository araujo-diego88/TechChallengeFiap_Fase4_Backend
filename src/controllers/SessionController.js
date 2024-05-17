import User from "../models/User";
import * as yup from 'yup';
import session from 'express-session';
const crypto = require('crypto');

class SessionController{

  async store(req, res){
    // console.log(req.body)

    req.body.isAdmin = false;

    const schema = yup.object().shape({
      nome: yup.string().required(),
      data_nascimento: yup.string().required(),
      data_cadastro: yup.string().required(),
      username: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required(),
      isAdmin: yup.boolean().required()
    });

    // const { filename } = req.file;
    const { nome, data_nascimento, data_cadastro, username, email, password, isAdmin } = req.body;
    if(!(await schema.isValid(req.body))) {
      return res.status(400).json({error: 'Falha na validação! Digite um e-mail válido.'});
    }

    // Criptografia da senha
    const new_pw = crypto.createHash('md5').update(password).digest('hex');

    let exists_email = await User.findOne({email});
    let user = await User.findOne({username});

    if(user) {
      // console.log(user)
      return res.status(400).json({error: 'Usuario ja existe'});
    }
    else if(exists_email) {
      // console.log(exists_email)
      return res.status(400).json({error: 'Email ja usado'});
    }


    user = await User.create({
      nome,
      data_nascimento,
      data_cadastro,
      username,
      email,
      password: new_pw,
      isAdmin
      // avatar: filename,
    });
    

    return res.json(user);
  }

  async login(req, res,next){
    // console.log(req.body)

    const schema = yup.object().shape({
      username: yup.string().required(),
      password: yup.string().required(),
    });

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Falha na validação!'});
    }

    // Dados de login
    const { username, password } = req.body;
    
    // Criptografia da senha
    const cripto_senha = crypto.createHash('md5').update(password).digest('hex');

    const user = await User.findOne({username});
    if(!user) {
      return res.status(400).json({error: 'Usuario não encontrado'});
    }
    else if(user.password != cripto_senha) {
      // console.log(user)
      return res.status(400).json({error: 'Senha incorreta'});
    }

    req.session.conta = user;
    req.session.loggedIn = true;

    // console.log(req.session.conta._id)

    // console.log(user.username)
    // console.log(req.session.usuario)
    await req.session.save();
    
    return res.send({sucess: 'Usuario logado com sucesso'});
    // res.redirect('/');
    
    // return res.send('Login realizado com sucesso!');
  }



async update(req, res){

  const schema = yup.object().shape({
    nome: yup.string().required(),
    data_nascimento: yup.string().required(),
    // data_cadastro: yup.string().required(),
    // username: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string(),
    // isAdmin: yup.boolean().required()
  });

  const { nome, data_nascimento, email, password } = req.body;
  const { user_id } = req.params;

  console.log(req.body)
  console.log(user_id)

  // Criptografia da senha
  
  // const curr_pw = crypto.createHash('md5').update(current_password).digest('hex');

  if(!(await schema.isValid(req.body))){
    return res.status(400).json({ error: 'Falha na validação!' });
  }

  // const user = await User.findById(user_id);

  if(password) {
    const new_pw = crypto.createHash('md5').update(password).digest('hex');
    await User.updateOne({username: req.session.conta.username}, {
      nome,
      data_nascimento,
      email,
      password: new_pw,
    });
  }
  else {
    await User.updateOne({username: req.session.conta.username}, {
      nome,
      data_nascimento,
      email,
    });
  }

  return res.status(200).json({ sucess: 'Dados alterados com sucesso!' });
}



}
export default new SessionController();