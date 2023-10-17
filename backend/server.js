import express from "express";
import dotenv from "dotenv";
import chats from "./data/data.js";
import connectDB from "./config/db.js";
import colors from "colors";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

const webapp = express();
dotenv.config();
connectDB();
// console.log(process.env);
webapp.use(express.json()); // Accepts the json data from frontend
webapp.get("/", (req, res) => {
  res.send("Our API is running fine");
});
webapp.use("/api/user", userRoutes);
webapp.use("/api/chat", chatRoutes);
webapp.use(notFound);
webapp.use(errorHandler);
// webapp.get("/api/chat", (req, res) => {
//   res.send(chats);
// });
// webapp.get("/api/chat/:id", (req, res) => {
//   // console.log(req.params.id);
//   const singleChat = chats.find((serach) => {
//     return serach._id === req.params.id;
//   });
//   console.log(singleChat);
//   res.send(singleChat);
// });
const port = process.env.PORT || 1000;
webapp.listen(
  port,
  console.log(`The server started at port ${port}`.blue.bold)
);
