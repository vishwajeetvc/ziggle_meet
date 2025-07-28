import { Router } from "express";
import { Guest } from "../models/guest.js";
import { User } from "../models/user.js";
import bcrypt from 'bcrypt'

const userRoute = Router();

userRoute.get('/', async(req, res)=>{
  const user = await Guest.findById(req.signedCookies.sid)
  console.log(user)
  res.json({_id : user._id, history : user.history});
})

//const isMatch = await bcrypt.compare(req.body.password,'$2b$10$Ygd2ipqkBPok/i3JOKgcWOYqhrjFKxcD8joz0OVJPvBPtRAcD/GpK');

userRoute.post('/', async (req, res)=>{

  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    await User.insertOne({...req.body,password : hash, history :[]});
    res.status(200).json({message : 'Sign is successfull'});

  } catch (error) {

    const user = await User.findOne({email : req.body.email});
    if(user){
      return res.json({error : 'Email Already Exist'});
    }
    res.status(500).json({error : 'something went wrong'});
  }
})

export default userRoute;
