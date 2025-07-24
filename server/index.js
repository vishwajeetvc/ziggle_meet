import express from 'express'
import http from 'node:http'
import { Server } from 'socket.io'

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST'],
  },
});

const store = new Map(); 

app.use(express.static('./public'))

io.on('connection', (socket)=>{
  console.log("user Connected");
  socket.emit('welcome', 'lovely')

  socket.onAny((eventName, ...args) => {
    console.log(eventName, socket.id)
  });

  // offer coming from offerer and saved to store
  socket.on('save-offer', offer => {
    if(!store.has(socket.id.slice(0,8))){
      socket.emit('meet-id', socket.id.slice(0,8))
    }
    store.set(socket.id.slice(0,8), offer);
    socket.join(socket.id.slice(0,8));
  });

  // other peer is requesting the offer
  socket.on('get-sdp', roomId => {
    let sdp = store.get(roomId)
    if(!sdp) sdp = null
    console.count('getting sdp')
    socket.emit('sdp', sdp, roomId);
  });

  // other peer is emmiting the last answer to offerer
  // clear the after successfull
  socket.on('share-answer',( answer, roomId ) => {
    io.to(roomId).emit('answer', answer, socket.id);
    store.delete(roomId);
  });

  socket.on('disconnect', ()=>{
    console.log("User Disconnected", socket.id);
    io.emit('lost', socket.id)
  })
})

server.listen(3000, ()=>{
  console.log("Running on 3000");
})
