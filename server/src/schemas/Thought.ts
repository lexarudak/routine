import mongoose from "mongoose";

const Thought = new mongoose.Schema({
  title: { type: String, required: true }
});

export default mongoose.model('Thought', Thought);