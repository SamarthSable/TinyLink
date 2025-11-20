import mongoose from "mongoose";

const linkSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  targetUrl: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  lastClicked: {
    type: Date,
    default: null,
  },
});

export default mongoose.model("Link", linkSchema);
