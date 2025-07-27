import { Guest } from "../models/guest.js";

export const handleCookie = async (req, res, next) =>{
  if(!req.signedCookies.sid){
    const user = await Guest.insertOne({
      history : ['initial']
    })
    res.cookie('sid', String(user._id), {
      httpOnly : true,
      signed : true
    })
  }
  next();
}
