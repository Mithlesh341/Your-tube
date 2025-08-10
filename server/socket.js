import { Server } from "socket.io";
import Message from "./models/Message.js"; // adjust path if needed

export const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      //origin : "http://localhost:3000",
     origin: "https://your-tube-blue.vercel.app",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    socket.on("join-group", (groupId) => {
      socket.join(groupId);
      console.log(`User ${socket.id} joined group ${groupId}`);
    });

    socket.on("send-message", async ({ groupId, sender, text }) => {
      try {
        const newMessage = new Message({ groupId, sender, text });
        await newMessage.save();

        io.to(groupId).emit("receive-message", {
          _id: newMessage._id,
          sender: newMessage.sender,
          text: newMessage.text,
          createdAt: newMessage.createdAt,
        });
      } catch (err) {
        console.error("Error saving message:", err);
      }
    });

    socket.on("disconnect", () => {
      console.log("🔴 Client disconnected:", socket.id);
    });
  });

  return io;
};
