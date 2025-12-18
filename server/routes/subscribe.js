import express from "express"
import User from "../models/Auth.js"

const router = express.Router();

router.post("/subscribe/:channelId", async (req, res) => {
  try {
    const userId = req.user.id; 
    const { channelId } = req.params;

    if (userId === channelId)
      return res.status(400).json({ message: "You cannot subscribe to yourself" });

    const user = await User.findById(userId);

    if (user.subscriptions.includes(channelId)) {
      return res.status(400).json({ message: "Already subscribed" });
    }

    user.subscriptions.push(channelId);
    await user.save();

    res.status(200).json({ message: "Subscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


router.delete("/unsubscribe/:channelId", async (req, res) => {
  try {
    const userId = req.user.id;
    const { channelId } = req.params;

    const user = await User.findById(userId);
    user.subscriptions = user.subscriptions.filter(
      (id) => id.toString() !== channelId
    );

    await user.save();
    res.status(200).json({ message: "Unsubscribed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



router.get("/subscriptions", async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "subscriptions",
      select: "channelname image description",
    });

    res.status(200).json(user.subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default router;