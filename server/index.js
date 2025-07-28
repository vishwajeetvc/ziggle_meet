import express from 'express'
import http from 'node:http'
import { Server } from 'socket.io'
import { socket } from './controllers/socket.js';
import cookieParser from 'cookie-parser';
import { handleCookie } from './middleWares/handleCookie.js';
import { connectToDB } from './configs/dbConnection.js';
import cors  from 'cors'
import dotenv from 'dotenv'
import userRoute from './controllers/userRoute.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

await connectToDB(`mongodb://${process.env.DBUSER}:${process.env.DBPASS}@localhost:27017/ziggleMeet`);

export const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST'],
  },
});

io.on('connection', socket);
app.use(cors({ origin : "http://localhost:5173", credentials : true }))
app.use(cookieParser('secret'));
app.use(express.json());
app.use(handleCookie);


//app.use(express.static('./public'))

app.use('/user', userRoute);

server.listen(3000, ()=>{
  console.log("Running on 3000");
})

