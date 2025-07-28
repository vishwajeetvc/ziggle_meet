import { Router } from "express";
import { User } from "../models/user.js";
import bcrypt from 'bcrypt'

const userRoute = Router();

userRoute.post('/login', async (req, res)=>{
  try {
    const user = await User.findOne({email : req.body.email});
    const isMatch = bcrypt.compare(req.body.password, user.password);
    if(isMatch){
      res.cookie('sid', String(user._id), {
        httpOnly : true,
        signed : true
      })
    }
    res.status(200).json({message : 'Login is successfull'});
  } catch (error) {
    const user = await User.findOne({email : req.body.email});
    if(!user){
      return res.json({error : 'Credentilas Error'});
    }
    res.status(500).json({error : 'something went wrong'});
  }
})

userRoute.post('/signup', async (req, res)=>{
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
