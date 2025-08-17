const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/database");
const router = require("./routes/route");
const cors = require("cors");
const { encryptAuthToken } = require("./utils/jwt");

const messageController = require("./controllers/message.controller");

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
  const userData = encryptAuthToken(socket.handshake.query.token);
  console.log("UserData:", userData);

  socket.data.userId = userData.id;
  socket.join(userData.id);

  socket.on("sendPrivateMessage", ({ to, message }) => {
    console.log("Sending private message to:", to, message);
    socket.to(to).emit("privateMessage", {
      from: userData.username,
      text: message,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

server.listen(PORT, () => {
  console.log("Server is running on", PORT);
  connectDB();
});
