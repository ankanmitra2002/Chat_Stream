import express from "express";
import dotenv from "dotenv";
import chats from "./data/data.js";
import connectDB from "./config/db.js";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { Server } from "socket.io";
import path from "path";
const webapp = express();
dotenv.config();
connectDB();

webapp.use(express.json());
webapp.use("/api/user", userRoutes);
webapp.use("/api/chat", chatRoutes);
webapp.use("/api/message", messageRoutes);
// --------- Deployment ----------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  webapp.use(express.static(path.join(__dirname1, "frontend/build")));
  webapp.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  webapp.get("/", (req, res) => {
    res.send("Our API is running fine");
  });
}
// --------- Deployment ----------
webapp.use(notFound);
webapp.use(errorHandler);
const port = process.env.PORT || 1000;
const server = webapp.listen(
  port,
  console.log(`The server started at port ${port}`.blue.bold)
);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("User is disconnected");
    socket.leave(userData._id);
  });
  socket.on("disconnect", () => {
    console.log("Socket disconnected");
    // Clean up resources when socket disconnects
    socket.leaveAll(); // Leave all rooms
  });
});
