const express = require('express');
const { createServer } = require('http'); 
const { Server } = require('socket.io');
const connectDB = require('./config/database');
const router = require('./routes/route')
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 5004;
const connectedUsers = []

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api/v1', router);

io.on('connection', (socket) => {
  console.log('a user connected:', socket.id);
  connectedUsers.push(socket.id);

  socket.on('message', (data) => {
    console.log('Message from client:', data);
    socket.broadcast.emit('reply', { text: `User ${socket.id} says: ${data.text}` });
  });

  socket.on('private_message', (data) => {
    console.log('Private message from client:', data);
    socket.to(data.to).emit('reply', { text: `${data.text} from ${socket.id}` });
  });

  io.emit('allUsers', connectedUsers);

  socket.on('disconnect', () => {
    console.log('user disconnected:', socket.id);
    const index = connectedUsers.indexOf(socket.id);
    if (index !== -1) {
      connectedUsers.splice(index, 1);
    }
  });
});


app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

server.listen(PORT, () => {
  console.log("Server is running on", PORT);
  connectDB();
});
