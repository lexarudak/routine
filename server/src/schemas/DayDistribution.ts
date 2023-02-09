import { Schema, model } from 'mongoose';
import { TDayDistribution } from '../types';

const schema = new Schema<TDayDistribution>({
  userId: { type: Schema.Types.ObjectId },
  dayOfWeek: { type: Number, required: true },
  planId: { type: Schema.Types.ObjectId, required: true },
  from: { type: Number, required: true },
  to: { type: Number, required: true },
});

export default model('DayDistribution', schema);
