import Razorpay from "razorpay";
import crypto from "crypto";
import users from "../models/Auth.js";
import { sendInvoiceEmail } from "../utils/email.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLAN_COSTS = {
  Bronze: 10,
  Silver: 50,
  Gold: 100,
};

export const createOrder = async (req, res) => {
  const { plan } = req.body;

  if (!PLAN_COSTS[plan]) {
    return res.status(400).json({ error: "Invalid plan" });
  }

  try {
    const order = await razorpay.orders.create({
      amount: PLAN_COSTS[plan] * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json(order);
  } catch (err) {
    console.error("Order creation error:", err);
    res.status(500).json({ error: "Could not create order" });
  }
};

export const verifyPayment = async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
    userId,
    
  } = req.body;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  try {
    const user = await users.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.plan = plan;
    user.watchTime = 0;
    user.planActivatedAt = new Date();
    await user.save();

    await sendInvoiceEmail(user.email, user.name, plan, PLAN_COSTS[plan]);

    res.status(200).json({ success: true, message: "Payment verified & plan updated" });
  } catch (err) {
    console.error("Verification error:", err);
    res.status(500).json({ success: false, message: "Could not verify payment" });
  }
};
