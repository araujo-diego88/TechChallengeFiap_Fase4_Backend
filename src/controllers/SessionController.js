import User from "../models/User";
import * as yup from 'yup';
import session from 'express-session';
const crypto = require('crypto');

class SessionController{

  async store(req, res){
    console.log(req.body)

    const schema = yup.object().shape({
      nome: yup.string().required(),
      data_nascimento: yup.string().required(),
      data_cadastro: yup.string().required(),
      username: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().required(),
    });

    // const { filename } = req.file;
    const { nome, data_nascimento, data_cadastro, username, email, password } = req.body;
    if(!(await schema.isValid(req.body))){
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
      // avatar: filename,
    });
    

    return res.json(user);
  }

  async login(req, res){
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


    req.session.usuario = user.username
    console.log(user.username)
    console.log(req.session.usuario)

    return res.status(200).json({sucess: 'Usuario logado com sucesso'});
  }
}




export default new SessionController();