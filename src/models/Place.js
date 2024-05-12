import {Schema, model} from "mongoose";

const PlaceSchema = new Schema({
  nome: String,
  thumbnail: String,
  description: String,
  descricao_longa: String,
  price:Number,
  location: String,
  status: Boolean,
  datas_disponiveis: Array,
  user:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},  {
  toJSON:{
    virtuals: true
  }
});

PlaceSchema.virtual('thumbnail_url').get(function(){
  return `http://localhost:3333/files/${this.thumbnail}`;
})

export default model('Place', PlaceSchema);