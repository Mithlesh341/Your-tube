import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { setupSocket } from "./socket.js";






import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";
import likeroutes from "./routes/like.js";
import watchlaterroutes from "./routes/watchlater.js";
import historyrroutes from "./routes/history.js";
import commentroutes from "./routes/comment.js";
import subscriptionRoutes from "./routes/subscription.js";
import updateWatchTimeRouter from "./routes/updateWatchTime.js";
import { createServer } from "http"; 
import { Server } from "socket.io";  
import path from "path";
import groupRoutes from "./routes/group.js";
import messageroutes from "./routes/message.js"
//import resetWatchTime from "./routes/resetWatchTime.js";

dotenv.config();
const app = express();



const httpServer = createServer(app); 
// const allowedOrigins = [
//   "http://localhost:3000",                  // Local dev
//   "https://vercel.com/mithlesh-mouryas-projects/frontend"   ,
//   "https://frontend-hvwk.onrender.com"    
// ];

// const io = new Server(httpServer, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//     credentials: true
//   },
// });


// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true
// }));

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/uploads", express.static(path.join("uploads")));
app.get("/", (req, res) => {
  res.send("You tube backend is working");
});
app.use(bodyParser.json());
app.use("/user", userroutes);
app.use("/video", videoroutes);
app.use("/like", likeroutes);
app.use("/watch", watchlaterroutes);
app.use("/history", historyrroutes);
app.use("/comment", commentroutes);
app.use("/subscription", subscriptionRoutes);
app.use("/watchtime", updateWatchTimeRouter);
app.use("/api", groupRoutes);
app.use("/msg",messageroutes);
//app.use("/watchtime", resetWatchTime);

// WebSocket Logic
// io.on("connection", (socket) => {
//   console.log(" New client connected:", socket.id);

//   socket.on("join-group", (groupId) => {
//     socket.join(groupId);
//     console.log(`👥 User ${socket.id} joined group ${groupId}`);
//   });



//   socket.on("send-message", async ({ groupId, sender, text }) => {
//     try {
//       const newMessage = new Message({
//         groupId,
//         sender,
//         text,
//       });
//       await newMessage.save();

//       io.to(groupId).emit("receive-message", {
//         _id: newMessage._id,
//         sender: newMessage.sender,
//         text: newMessage.text,
//         createdAt: newMessage.createdAt,
//       });
//     } catch (error) {
//       console.error("Error saving message:", error);
//     }
//   });




//   socket.on("disconnect", () => {
//     console.log(" User disconnected:", socket.id);
//   });
// });


setupSocket(httpServer);

const PORT = 5000;

httpServer.listen(PORT, () => {
  console.log(`server running on port http://localhost:${PORT}`);
});

const DBURL = process.env.DB_URL;
mongoose
  .connect(DBURL)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.log(error);
  });