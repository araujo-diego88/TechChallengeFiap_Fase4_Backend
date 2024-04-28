import {Schema, model} from "mongoose";

const PlaceSchema = new Schema({
  thumbnail: String,
  description: String,
  price:Number,
  location: String,
  status: Boolean,
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