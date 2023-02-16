import { Schema, model } from 'mongoose';
import { TPlan } from '../common/types';

const schema = new Schema<TPlan>({
  userId: { type: Schema.Types.ObjectId, index: true },
  title: { type: String, required: true },
  text: { type: String, default: '' },
  color: { type: String, required: true },
  duration: { type: Number, required: true },
});

export default model('Plan', schema);
