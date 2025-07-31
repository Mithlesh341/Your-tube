import express from "express";
import users from "../models/Auth.js";
import { sendInvoiceEmail } from "../utils/email.js";
import {
  createOrder,
  verifyPayment,
} from "../controllers/subscription.js";

const router = express.Router();

const PLAN_COSTS = {
  Bronze: 10,
  Silver: 50,
  Gold: 100,
};

router.post("/subscribe", async (req, res) => {
  const { _id, plan } = req.body;

  try {
    if (!PLAN_COSTS[plan]) {
      return res.status(400).json({ error: "Invalid plan" });
    }

    const user = await users.findById(_id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.plan = plan;
    await user.save();

    await sendInvoiceEmail(user.email, user.name, plan, PLAN_COSTS[plan]);

    res.status(200).json({ success: true, message: `Plan upgraded to ${plan}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upgrade failed" });
  }
});


router.post("/create-order", createOrder);
router.post("/verify-payment", verifyPayment);

export default router;
