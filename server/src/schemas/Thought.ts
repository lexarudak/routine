import { Schema, model } from 'mongoose';

const schema = new Schema({
  userId: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
});

export default model('Thought', schema);
