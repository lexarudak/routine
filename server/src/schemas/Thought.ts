import { Schema, model } from 'mongoose';

const Thought = new Schema({
  userId: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
});

export default model('Thought', Thought);
