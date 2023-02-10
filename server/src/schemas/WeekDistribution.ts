import { Schema, model } from 'mongoose';
import { TWeekDistribution } from '../common/types';

const schema = new Schema<TWeekDistribution>({
  userId: { type: Schema.Types.ObjectId },
  dayOfWeek: { type: Number, required: true },
  planId: { type: Schema.Types.ObjectId, required: true },
  duration: { type: Number, required: true },
});

export default model('WeekDistribution', schema);
