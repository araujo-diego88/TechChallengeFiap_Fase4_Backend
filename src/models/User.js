import {Schema, model} from "mongoose";

const UserSchema = new Schema({
  nome: String,
  data_nascimento: String,
  data_cadastro: String,
  username: String,
  email: String,
  password: String,
  // avatar: String,
  isAdmin: Boolean
},{
  toJSON:{
    virtuals: true
  }
});

// UserSchema.virtual('avatar_url').get(function(){
//   return `http://localhost:3333/files/${this.avatar}`;
// })

export default model('User', UserSchema);