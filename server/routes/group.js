import express from "express";
import Group from "../models/Group.js";
import Message from "../models/Message.js";
import Users from "../models/Auth.js"

const router = express.Router();

// Create a group
router.post("/group/create", verifyFirebaseToken, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: "Name and description are required." });
    }


    const userEmail = req.user.email;
    const existingUser = await Users.findOne({ email: userEmail });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }


    const group = new Group({ name, description,admin : existingUser._id, });
    await group.save();
     await group.populate("admin", "name email");

    res.status(201).json(group);
  } catch (error) {
    console.error("Group creation failed:", error);
    res.status(500).json({ error: "Failed to create group" });
  }
});

// Get all groups
router.get("/group/get", async (req, res) => {
  try {
    const groups = await Group.find().populate("admin", "name email");
    res.json(groups);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});



import verifyFirebaseToken from "../middlewares/firebaseAuth.cjs";



router.post("/group/join/:groupId", verifyFirebaseToken, async (req, res) => {
  try {
    const groupId = req.params.groupId;
    const firebaseEmail = req.user.email;

    const userDoc = await Users.findOne({ email: firebaseEmail });
    if (!userDoc) return res.status(404).json({ error: "User does not exist" });

    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    // Prevent admin from joining their own group
    if (group.admin.toString() === userDoc._id.toString()) {
      return res.status(400).json({ error: "You are the admin, You cannot join" });
    }

    // Add user to members array
    await Group.updateOne(
      { _id: groupId },
      { $addToSet: { members: userDoc._id } }
    );

    res.json({ message: "Joined group successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to join group" });
  }
});



router.get("/:groupId/messages", async (req, res) => {
  try {
    const messages = await Message.find({ groupId: req.params.groupId }).sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});












// GET /groups/:id
router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("admin", "name email")
      .populate("members", "name email");
    
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json(group);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
