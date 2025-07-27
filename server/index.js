import express from 'express'
import http from 'node:http'
import { Server } from 'socket.io'
import { socket } from './controllers/socket.js';
import cookieParser from 'cookie-parser';
import { handleCookie } from './middleWares/handleCookie.js';
import { connectToDB } from './configs/dbConnection.js';
import cors  from 'cors'
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const server = http.createServer(app);

await connectToDB(`mongodb://${process.env.DBUSER}:${process.env.DBPASS}@localhost:27017/ziggleMeet`);

export const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

//app.use(express.static('./public'))
io.on('connection', socket);
app.use(cors({ origin : "*" }))
app.use(cookieParser('secret'));
app.use(handleCookie);

app.get('/',(req, res)=>{
  res.json({hi : "hi"})
})

server.listen(3000, ()=>{
  console.log("Running on 3000");
})

