import { Guest } from "../models/guest.js";

export const handleCookie = async (req, res, next) =>{
  if(!req.signedCookies.sid){
    const user = await Guest.insertOne({
      history : [{}]
    })
    res.cookie('sid', String(user._id), {
      httpOnly : true,
      signed : true
    })
    return res.json({_id : user._id, history :[{initial : 'initial'}]});
  }
  next();
}
