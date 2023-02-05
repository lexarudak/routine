import { Schema, model } from 'mongoose';
import { TUser } from '../types';

const User = new Schema<TUser>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdAt: { type: Date },
});

export default model('User', User);
