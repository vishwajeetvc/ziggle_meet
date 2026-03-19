import express from 'express'
import http from 'node:http'
import { Server } from 'socket.io'
import { socket } from './controllers/socket.js';
import cookieParser from 'cookie-parser';
import cors  from 'cors'

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

io.on('connection', socket);
app.use(cors({ origin : "*", credentials : true }))
app.use(cookieParser('secret'));
app.use(express.json());

server.listen(3001, ()=>{
  console.log("Running on 3000");
})

