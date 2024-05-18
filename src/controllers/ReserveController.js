import Reserve from '../models/Reserve';
import User from '../models/User';
import Place from '../models/Place';
import moment from 'moment/moment';


class ReserveController{

  async index(req, res){
    // const {user_id} = req.headers;
    const user_id = req.session.conta._id

    const reserves = await Reserve.find({user: user_id}).populate('place');

    return reserves;

  }

  async store( req, res){
    if(!req.session.loggedIn) {
      return res.status(400).json({ error: 'Precisa estar logado para fazer a reserva' });
    }

    // console.log(req.body)
    // console.log(req.params)

    const user_id = req.session.conta._id

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
    //  const existingPlaceReservation = await Reserve.findOne({ place: place_id, date: { $gt: new Date() } });
    //  if (!existingPlaceReservation) {
    //    place.status = false;
    //    await place.save();
    //  }

    // return res.json({ reserve});
    res.status(200).json({ sucess: 'Reserva feita com sucesso!' });
    // return true
  }

  async destroy(req, res){

    // const{ reserve_id } = req.body;
    const{ reserve_id } = req.params;
    const user_id = req.session.conta._id

    // const user = await User.findById(user_id);
    const reserve = await Reserve.findById(reserve_id);

    if(String(user_id) !== String(reserve.user)){
      return res.status(401).json({ error: 'Voce nao tem permissão para cancelar essa reserva!'});
    }

    await Reserve.findByIdAndDelete({_id: reserve_id});

    // return res.send();
    res.status(200).json({ sucess: 'Reserva cancelada com sucesso!' });
  }
}

export default new ReserveController();