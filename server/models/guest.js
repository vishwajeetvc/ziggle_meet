import mongoose, { Schema } from "mongoose";

const guestSchema = new Schema({
  history: [{}]
}, {timestamps : true});

export const Guest = mongoose.model('guest', guestSchema);
