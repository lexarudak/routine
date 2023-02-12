import { Schema, model } from 'mongoose';
import { TStatistics } from '../types';

const schema = new Schema<TStatistics>({
  userId: { type: Schema.Types.ObjectId },
  planId: { type: Schema.Types.ObjectId, required: true },
  deviation: { type: Number, default: 0 },
});

export default model('Statistics', schema);
