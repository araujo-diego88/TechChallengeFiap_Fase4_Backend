import Reserve from '../models/Reserve';
import User from '../models/User';
import Place from '../models/Place';
import moment from 'moment/moment';


class ReserveController{

  async index(req, res){
    if(!req.session.loggedIn) {
      return res.status(400).json({ error: 'Precisa estar logado para fazer a reserva' });
    }
    // const {user_id} = req.headers;
    const user_id = req.session.conta._id

    const reserves = await Reserve.find({user: user_id}).populate('place');

    return reserves;

  }

  async store( req, res){
    
    if(!req.session.loggedIn) {
      return res.status(400).json({ error: 'Precisa estar logado para fazer a reserva' });
    }
    const { reserva, num_pessoas  } = req.body;

    const reserva_data = reserva.split(',');
    const user_id = req.session.conta._id

    const {place_id} = req.params;
    const vagas = reserva_data[3];
    const vagas_restantes = vagas-num_pessoas;
    const id_data = reserva_data[4];
    const date = reserva_data[0]+"-"+reserva_data[1]+":"+reserva_data[2]
    const formattedDate = moment.utc(date, 'YYYY-MM-DD-h:m' ).toDate();//formato da data da reserva

    const place = await Place.findById(place_id);
    if(!place){
      return res.status(400).json({ error:'Essa local não existe!' });
    }

    if (vagas_restantes < 0) {
      return res.status(400).json({ error: 'Solicitação indisponível, não há vagas suficientes para esse local.' });
    }

    const user = await User.findById(user_id);
    if(String(user._id) === String(place.user)){
      return res.status(400).json({ error: 'Reserva não permitida, usuário é dono do local!' });
    }

    const reserve = await Reserve.create({//criação da reserva 
      user: user_id,
      place: place_id,
      date: formattedDate,
      num_pessoas: num_pessoas,
      data_id:id_data
    });

    await reserve.populate(['place', 'user']);

     // Atualizar o status do local apenas para a data da reserva
     const existingPlaceReservation = await Reserve.findOne({ place: place_id, date: formattedDate });
     if (existingPlaceReservation) {
      // console.log(place.datas_disponiveis[id_data][3])
      place.datas_disponiveis[id_data][3] = vagas_restantes

      await Place.updateOne({_id: place_id}, {
        datas_disponiveis: place.datas_disponiveis
      });

     }

    // return res.json({ reserve});
    res.status(200).json({ sucess: 'Reserva feita com sucesso!' });
    // return true
  }

  async destroy(req, res){
    if(!req.session.loggedIn) {
      return res.status(400).json({ error: 'Precisa estar logado para fazer a reserva' });
    }
    // const{ reserve_id } = req.body;
    const { reserve_id } = req.params;
    const user_id = req.session.conta._id

    const isAdmin = req.session.conta.isAdmin

    // const user = await User.findById(user_id);
    const reserve = await Reserve.findById(reserve_id);

    if(String(user_id) !== String(reserve.user) && !isAdmin){
      return res.status(401).json({ error: 'Voce nao tem permissão para cancelar essa reserva!'});
    }

    const place_id = reserve.place;
    const id_data = reserve.data_id;
    const place = await Place.findById(place_id); 
    
    place.datas_disponiveis[id_data][3] += reserve.num_pessoas
    
    await Place.updateOne({_id: place_id}, {
      datas_disponiveis: place.datas_disponiveis
    });

    await Reserve.findByIdAndDelete({_id: reserve_id});

    // return res.send();
    res.status(200).json({ sucess: 'Reserva cancelada com sucesso!' });
  }
}

export default new ReserveController();