const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const pollRoutes = require("./routes/pollRoutes");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

app.use("/api/polls", pollRoutes);

io.on("connection", (socket) => {
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log("PulseRoom API running 🚀");
});
