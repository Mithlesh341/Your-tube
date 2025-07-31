import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: {type:String, required:true},
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
});

const Group = mongoose.model("Group", groupSchema);
export default Group;
