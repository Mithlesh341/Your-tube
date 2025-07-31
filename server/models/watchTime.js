import mongoose from "mongoose";
const timeSchema = mongoose.Schema({

  watchedTime: {
    type: Number,
    default: 0, 
  }
});

export default mongoose.model("time", timeSchema);