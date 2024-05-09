import {Schema, model} from "mongoose";

const ReserveSchema = new Schema({
  date: Date,
  user:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  place:{
    type: Schema.Types.ObjectId,
    ref:'Place'
  }
});

export default model('Reserve', ReserveSchema);