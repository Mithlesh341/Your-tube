import express from "express";
import users from "../models/Auth.js"; 

const router = express.Router();

router.post("/update-watch-time", async (req, res) => {
  try {
    const { email, watchTime } = req.body;

    if (!email || typeof watchTime !== "number") {
      return res.status(400).json({ message: "Invalid input" });
    }

    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.watchTime = watchTime;
    await user.save();

    res.status(200).json({ message: "Watch time updated" });
  } catch (err) {
    console.error("Watch time update failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/reset-watch-time", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    user.watchTime = 0; //Reset
    await user.save();

    res.status(200).json({ message: "Watch time reset successfully" });
  } catch (err) {
    console.error("Failed to reset watch time:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});




router.post("/get-watch-time", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Missing email" });

    const user = await users.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ watchTime: user.watchTime || 0 });
  } catch (err) {
    console.error("Get watch time failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});














export default router;
