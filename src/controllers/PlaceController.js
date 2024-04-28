import Place from '../models/Place';

class PlaceController{

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
}

export default new PlaceController();