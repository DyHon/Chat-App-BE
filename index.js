const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

const socket = require("socket.io");
const app = express();
require('dotenv').config();

app.use(cors({origin: '*'}));
app.use(express.json());
app.use("/api/auth", userRoutes)
app.use("/api/message", messageRoutes)

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("DB connect success");
    })
  } catch (error) {
    console.log(error.message);
  }
};

connect();

const server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on PORT ${process.env.PORT}`);
});


const io = socket(server, {
  cors: {
    origin: "https://zyhon.vercel.app",
    credentials: true,
    methods: ["GET", "POST"]
  }
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;
  socket.on('add-user', (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(onlineUsers);
  });
  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    console.log(data.to);
    console.log(onlineUsers);
    console.log(sendUserSocket);
    if (sendUserSocket) {
      console.log("check");
      socket.to(sendUserSocket).emit('msg-recieve', data.message);
    };
  });
});


module.exports = app;