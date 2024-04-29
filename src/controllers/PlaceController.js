import Place from '../models/Place';
import User from '../models/User';

class PlaceController{

  async index(req, res){
    const { status } = req.query;

    const places = await Place.find({ status });

    return res.json( places );
  }

  async store(req, res){
    const { filename } = req.file;
    const { description, price, location, status } = req.body;
    const { user_id } = req.headers;

    const place = await Place.create({
      user: user_id,
      thumbnail: filename,
      description,
      price,
      location,
      status,
    });


    return res.json(place);
  }

  async update(req, res){
    const { filename } = req.file;
    const { place_id } = req.params;
    const { description, price, location, status} = req.body;
    const { user_id } = req.headers;

    const user = await User.findById(user_id);
    const places = await Place.findById(place_id);

    if(String(user_id) !== String(places.user)){
      return res.status(401).json({ error: 'Usuário não autorizado!'});
    }


    places = await Place.updateOne({_id: place_id}, {
      user: user_id,
      thumbnail: filename,
      description,
      price,
      location,
      status,
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