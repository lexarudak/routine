import { Schema, model } from 'mongoose';
import { TThought } from '../common/types';

const schema = new Schema<TThought>({
  userId: { type: Schema.Types.ObjectId },
  title: { type: String, required: true },
});

export default model('Thought', schema);
