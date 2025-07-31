import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  email: {
    type: String,
    require: true,
  },
  name: {
    type: String,
  },
  channelname: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  joinedon: {
    type: Date,
    default: Date.now,
  },
  plan: {
    type: String,
    enum: ["Free", "Bronze", "Silver", "Gold"],
    default: "Free",
  },
  watchTime: {
    type: Number,
    default: 0, 
  },
  planActivatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("user", userSchema);