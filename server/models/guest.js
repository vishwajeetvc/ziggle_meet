import mongoose, { Schema } from "mongoose";

const guestSchema = new Schema({
  history: [String]
}, {timestamps : true});

export const Guest = mongoose.model('guest', guestSchema);
