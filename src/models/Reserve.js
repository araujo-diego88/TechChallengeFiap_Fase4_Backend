import {Schema, model} from "mongoose";
import { number } from "yup";

const ReserveSchema = new Schema({
  date: Date,
  user:{
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  place:{
    type: Schema.Types.ObjectId,
    ref:'Place'
  },
  num_pessoas:Number,
  data_id:Number
});

export default model('Reserve', ReserveSchema);