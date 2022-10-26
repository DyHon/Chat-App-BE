const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

const http = require('http');

const socket = require("socket.io");
const app = express();
require('dotenv').config();

app.use(cors({origin: "*"}));
app.use(express.json());
app.use("/api/auth", userRoutes)
app.use("/api/message", messageRoutes)

app.all('/', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next()
});

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

const httpServer = http.createServer();
const io = new socket.Server(httpServer, {
  cors: {
    origin: "https://zyhonserver.vercel.app",
    credentials: true,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
  }
})

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
});


module.exports = app;