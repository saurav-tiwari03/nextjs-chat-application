const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/database");
const router = require("./routes/route");
const cors = require("cors");
const { encryptAuthToken } = require("./utils/jwt");

const {
  createMessage,
  getAllMessages,
} = require("./controllers/message.controller");

require("dotenv").config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = 5004;
const connectedUsers = [];

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", router);

io.on("connection", (socket) => {
  // prefer auth, but this keeps your query style:
  const userData = encryptAuthToken(socket.handshake.query.token);
  socket.data.userId = userData.id;
  socket.join(userData.id);

  socket.on("private_message", async ({ text, to }) => {
    if (!text || !to) return;

    const saved = await createMessage(socket, {
      text,
      from: socket.data.userId,
      to,
    });


    socket.emit("message:new", saved);

    // (optional) keep your toast:
    io.to(to).emit("reply", {
      text,
      fromUserId: socket.data.userId,
      socketId: socket.id,
      ts: Date.now(),
    });
  });

  socket.on("get_all_messages", async ({ from, to, limit }) => {
    await getAllMessages(socket, { from, to, limit });
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

server.listen(PORT, () => {
  console.log("Server is running on", PORT);
  connectDB();
});
