import Place from '../models/Place';

class DashboardController{

  async show(req, res){
    const { user_id } = req.headers;

    const places = await Place.find({user: user_id})

    return res.json(places);
  }
}

export default new DashboardController();