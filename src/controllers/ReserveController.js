import Reserve from '../models/Reserve';
import User from '../models/User';
import Place from '../models/Place';


class ReserveController{
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
    if(String(user._id) === String(place  .user)){
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
}

export default new ReserveController();