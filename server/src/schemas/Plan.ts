import { Schema, model } from 'mongoose';
import { TPlan } from '../types';

const schema = new Schema<TPlan>({
  userId: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
  text: { type: String },
  color: { type: String, required: true },
  duration: { type: Number },
});

export default model('Plan', schema);
