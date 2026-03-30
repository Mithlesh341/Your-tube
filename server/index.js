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
import subscriberoutes from "./routes/subscribe.js"
// import sgMail from "@sendgrid/mail";







dotenv.config();
const app = express();



const httpServer = createServer(app); 
//sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// await sgMail.send({
//   to: "your_email@gmail.com",
//   from: "your_verified_email@gmail.com",
//   subject: "Test",
//   text: "Working?",
// });

app.use(cors({
  origin: [
    "http://localhost:3000",            
    "https://your-tube-blue.vercel.app" 
  ],
  credentials: true
}));

//app.use(cors({origin : "http://localhost:3000", credentials:true}))
//app.use(cors({origin: "https://your-tube-blue.vercel.app", credentials: true}));
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
app.use("/api/user", subscriberoutes);

console.log("SENDGRID KEY:", process.env.SENDGRID_API_KEY);
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