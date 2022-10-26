const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

const http = require('http');

const socket = require("socket.io");
const app = express();
require('dotenv').config();

app.use(cors({
  origin: '*',
}));
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

const httpServer = http.createServer(app);
httpServer.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));
const io = new socket.Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

global.onlineUsers = new Map();

io.on('connection', (socket) => {
  global.chatSocket = socket;
  console.log("connecting...")
  socket.on('add-user', (userId) => {
    console.log("add user")
    onlineUsers.set(userId, socket.id);
    console.log("connect socket successfully");
  });
  socket.on('send-msg', (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit('msg-recieve', data.message);
    };
  });
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});


module.exports = app;