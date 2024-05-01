import User from "../models/User";
import * as yup from 'yup';

class SessionController{

  async store(req, res){
    const schema = yup.object().shape({
      email: yup.string().email().required(),
    });

    const { email } = req.body;

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({error: 'Falha na validação! Digite um e-mail válido.'});
    }

    let user = await User.findOne({email});

    if(!user){
       user = await User.create({email});
    }

    return res.json(user);
  }
}

export default new SessionController();