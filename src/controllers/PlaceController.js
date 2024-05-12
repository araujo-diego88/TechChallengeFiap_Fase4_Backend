import Place from '../models/Place';
import User from '../models/User';
import * as yup from 'yup';

class PlaceController{

  async index(req, res){
    const { status, id } = req.query;
    const places = await Place.find({ status, id });

    return res.json( places );
  }
  async id_find(req, res){
    const { place_id } = req.query;
    const places = await Place.findById(place_id);

    return res.json( places );
  }

  

  async store(req, res){
    const schema = yup.object().shape({
      nome: yup.string().required(),
      description: yup.string().required(),
      descricao_longa: yup.string().required(),
      price: yup.number().required(),
      location: yup.string().required(),
      status: yup.boolean().required(),
      datas_disponiveis: yup.array().required()
    });


    const { filename } = req.file;
    const { nome, description, descricao_longa, price, location, status, datas_disponiveis } = req.body;
    const { user_id } = req.headers;

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Falha na validação!' });
    }


    const place = await Place.create({
      user: user_id,
      thumbnail: filename,
      description,
      descricao_longa,
      price,
      location,
      status,
      nome,
      datas_disponiveis,
    });


    return res.json(place);
  }

  async update(req, res){

    const schema = yup.object().shape({
      nome: yup.string().required(),
      description: yup.string().required(),
      descricao_longa: yup.string().required(),
      price: yup.number().required(),
      location: yup.string().required(),
      status: yup.boolean().required(),
      datas_disponiveis: yup.array().required()
    });

    const { filename } = req.file;
    const { place_id } = req.params;
    const { nome, descricao_longa, description, price, location, status, datas_disponiveis } = req.body;
    const { user_id } = req.headers;

    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Falha na validação!' });
    }

    const user = await User.findById(user_id);
    const places = await Place.findById(place_id);

    if(String(user_id) !== String(places.user)){
      return res.status(401).json({ error: 'Usuário não autorizado!'});
    }


    await Place.updateOne({_id: place_id}, {
      user: user_id,
      thumbnail: filename,
      description,
      descricao_longa,
      price,
      location,
      status,
      nome,
      datas_disponiveis,
    });

    return res.send();
  }

  async destroy(req, res){

    const { place_id } = req.body;
    const { user_id } = req.headers;
    
    const user = await User.findById(user_id);
    const places = await Place.findById(place_id);

    if(String(user_id) !== String(places.user)){
      return res.status(401).json({ error: 'Usuário sem permissão para excluir o local!'});
    }

    await Place.findByIdAndDelete({_id: place_id});
    
    return res.json({message : "Excluído com sucesso!"});
  }
}

export default new PlaceController();