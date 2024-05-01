import Reserve from '../models/Reserve';
import User from '../models/User';
import Place from '../models/Place';


class ReserveController{

  async index(req, res){
    const {user_id} = req.headers;

    const reserves = await Reserve.find({ user: user_id}).populate('place');

    return res.json(reserves);

  }

  async store( req, res){
    const {user_id} = req.headers;
    const {place_id} = req.params;
    const { date  } =req.body;

    const place = await Place.findById(place_id);
    if(!place){
      return res.status(400).json({ error:'Essa local não existe!' });
    }

    if(place.status !== true){
      return res.status(400).json({ error: 'Solicitação indisponível, o local já está reservado!' });
    }

    const user = await User.findById(user_id);
    if(String(user._id) === String(place.user)){
      return res.status(401).json({ error: 'Reserva não permitida, usuário é dono do local!' });
    }

    const reserve = await Reserve.create({
      user: user_id,
      place: place_id,
      date,
    });

    await reserve.populate(['place', 'user']);

    return res.json({ reserve});
  }

  async destroy(req, res){

    const{ reserve_id } = req.body;
    const { user_id } = req.headers;

    const user = await User.findById(user_id);
    const reserve = await Reserve.findById(reserve_id);

    if(String(user_id) !== String(reserve.user)){
      return res.status(401).json({ error: 'Usuário sem permissão para excluir o local!'});
    }

    await Reserve.findByIdAndDelete({_id: reserve_id});

    return res.send();
  }
}

export default new ReserveController();