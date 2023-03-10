import { Schema, model } from 'mongoose';
import { TUser } from '../common/types';

const schema = new Schema<TUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  confirmationDay: { type: String, required: true },
  confirmationTime: { type: Number, required: true },
  createdAt: { type: Date, required: true },
});

export default model('User', schema);
