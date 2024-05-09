import Reserve from '../models/Reserve';
import User from '../models/User';
import Place from '../models/Place';
import moment from 'moment/moment';


class ReserveController{

  async index(req, res){
    const {user_id} = req.headers;

    const reserves = await Reserve.find({ user: user_id}).populate('place');

    return res.json(reserves);

  }

  async store( req, res){
    const {user_id} = req.headers;
    const {place_id} = req.params;
    const { date  } = req.body;
    const formattedDate = moment(date, 'DD-MM-YYYY' ).toDate();//formato da data da reserva

    const place = await Place.findById(place_id);
    if(!place){
      return res.status(400).json({ error:'Essa local não existe!' });
    }

    const existingReservation = await Reserve.findOne({ place: place_id, date: formattedDate });
    if (existingReservation) {
      return res.status(400).json({ error: 'Solicitação indisponível, o local já está reservado para esta data! Selecione outra data.' });
    }

    const user = await User.findById(user_id);
    if(String(user._id) === String(place.user)){
      return res.status(401).json({ error: 'Reserva não permitida, usuário é dono do local!' });
    }

    const reserve = await Reserve.create({//criação da reserva 
      user: user_id,
      place: place_id,
      date: formattedDate,
    });

    await reserve.populate(['place', 'user']);

     // Atualizar o status do local apenas para a data da reserva
     const existingPlaceReservation = await Reserve.findOne({ place: place_id, date: { $gt: new Date() } });
     if (!existingPlaceReservation) {
       place.status = false;
       await place.save();
     }

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