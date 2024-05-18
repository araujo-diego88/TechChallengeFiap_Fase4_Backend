import Place from '../models/Place';
import User from '../models/User';
import * as yup from 'yup';

class PlaceController{

  async index(req, res){
    const places = await Place.find({ status: true });

    return places;
  }
  async index_all(req, res){
    const places = await Place.find();

    return places;
  }
  async id_find(req, res){
    const place_id = req.params.id;
    const places = await Place.findById(place_id);
    

    return places;
  }

  async find_user_places(req, res) {
    if(!req.session.loggedIn) {
      return res.status(400).json({ error: 'Falha na autenticação! Tente fazer o login novamente' });
    }

    const user_id = req.session.conta._id
    const places = await Place.find({ user: user_id });
    

    // return json( places );
    return places;
  }
  async gerency_single(req, res) {

    if(!req.session.loggedIn) {
      return res.status(400).json({ error: 'Falha na autenticação! Tente fazer o login novamente' });
    }

    const id_place = req.params.id
    const places = await Place.findById(id_place); 

    if(places.user != req.session.conta._id && !req.session.conta.isAdmin)
      return false

    return places;
  }

  async store(req, res) {
    if(!req.session.loggedIn) {
      return res.status(400).json({ error: 'Falha na autenticação! Tente fazer o login novamente' });
    }

    req.body.status = true;

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
    var user_id = req.session.conta._id

    if(!(await schema.isValid(req.body))){
      console.log(req.body)
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

  async update(req, res) {

    if(!req.session.loggedIn) {
      return res.status(400).json({ error: 'Falha na autenticação! Tente fazer o login novamente' });
    }

    if(req.body.status == 'on') {
      req.body.status = true
    }
    else {
      req.body.status = false
    }

    const schema = yup.object().shape({
      nome: yup.string().required(),
      description: yup.string().required(),
      descricao_longa: yup.string().required(),
      price: yup.number().required(),
      location: yup.string().required(),
      status: yup.boolean().required(),
      datas_disponiveis: yup.array().required()
    });
    
    // console.log(req.file)
    var filename = 0;
    if(req.file) {
      filename = req.file.filename
    }


    const { nome, descricao_longa, description, price, location, status, datas_disponiveis } = req.body;
    
    
    if(!(await schema.isValid(req.body))){
      return res.status(400).json({ error: 'Falha na validação!' });
    }

    const id_place = req.params.place_id
    const user_id = req.session.conta._id
    const isAdmin = req.session.conta.isAdmin
    
    const places = await Place.findById(id_place); 
    console.log(id_place)
    console.log(places)

    if(places.user != user_id && !isAdmin) {
      return res.status(401).json({ error: 'Usuário não autorizado!'});
    }

    if(filename) {
      await Place.updateOne({_id: id_place}, {
        thumbnail: filename,
        description,
        descricao_longa,
        price,
        location,
        status,
        nome,
        datas_disponiveis,
      });
    }
    else {
      await Place.updateOne({_id: id_place}, {
        description,
        descricao_longa,
        price,
        location,
        status,
        nome,
        datas_disponiveis,
      });
    }

    return res.json({sucess : "Atualizado com sucesso!"});
  }

  async destroy(req, res){
    
    const id_place = req.params.place_id
    const user_id = req.session.conta._id
    const isAdmin = req.session.conta.isAdmin
    const places = await Place.findById(id_place); 
    if(places.user != user_id && !isAdmin) {
      return res.status(401).json({error: 'Usuário não autorizado!'});
    }

    await Place.findByIdAndDelete({_id: id_place});
    
    return res.json({sucess: "Excluído com sucesso!"});
  }
}

export default new PlaceController();