const express = require('express');
const dotenv = require('dotenv');
const chats = require('./data');
const cors = require('cors')
const connectDB = require('./config/mongoose');
const app = express();
const userRoutes = require('./routes/userroutes');
const chatRoutes = require('./routes/chatroutes');
const path = require('path');
const messageRoutes = require('./routes/messageroutes')
dotenv.config();
connectDB();
const port = process.env.PORT;
const env = process.env.NODE_ENV;
app.use(express.json());
app.use(cors());
app.use('/api/user',userRoutes);
app.use('/api/chat',chatRoutes);
app.use('/api/message',messageRoutes);

const __dirname1 = path.resolve();

if (env === "production") {
  app.use(express.static(path.join(__dirname1, "../frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running..")
  });
}

const server = app.listen(port, console.log(`server running ${port}`));
const io = require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin:"http://localhost:3000"
    }
})
io.on("connection",(socket)=>{
    console.log('connected to socket.io');
    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit('connected');
    })

    socket.on('join chat',(room)=>{
        socket.join(room);
        console.log("room->",room);;
    })
    socket.on('new message',(newMessageReceived)=>{
        var chat = newMessageReceived.chat
        if(!chat.users){
            return console.log("chat users not defined"); 
        }
        chat.users.forEach(user=>{
            if(user._id == newMessageReceived.sender._id){
                return
            }else{
                socket.in(user._id).emit("message received",newMessageReceived);
            }
        })
    })
    socket.on('typing',(room)=>{
        socket.in(room).emit("typing")
    })
    socket.on('stop typing',(room)=>{
        socket.in(room).emit("stop typing")
    })
    socket.off("setup", () => {
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
      });
})
