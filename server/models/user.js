import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  username : String,
  email : {
    type : String,
    unique : true
  },
  password : String,
  history : [{}]
}, {timestamps : true})


export const User = mongoose.model('user', userSchema);
