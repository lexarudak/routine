import { Schema, model } from 'mongoose';
import { TPlan } from '../types';

const schema = new Schema<TPlan>({
  userId: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  color: { type: String, default: '#549F7B' },
  duration: { type: Number, default: 0 },
});

export default model('Plan', schema);
