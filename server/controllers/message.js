import Message from '../models/Message.js';
import mongoose from 'mongoose';

export const addMessage = async (req, res) => {
  try {
    const { groupId, sender, content } = req.body;
    console.log(groupId);
    const newMessage = new Message({
      groupId,
      sender,
      content,
      
    });

    await newMessage.save();
    res.status(200).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save message' });
  }
};

export const getMessagesByGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const messages = await Message.find({
      groupId: new mongoose.Types.ObjectId(groupId),  
    })
      .populate("sender", "name email") 
      .sort({ createdAt: 1 });          

    const formattedMessages = messages.map((msg) => ({
      message: msg.content,
      sender: msg.sender.name || msg.sender.email || "Unknown",
      timestamp: msg.createdAt,
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};