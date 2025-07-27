import mongoose from "mongoose";

export async function connectToDB(str){
  try {
    await mongoose.connect(str)
    console.log("Connected to dataBase")
  } catch (error) {
    console.log(error)
  }
}

process.on('SIGINT', async ()=>{
  await mongoose.disconnect();
  console.log('database disconnected')
  process.exit(0);
})

