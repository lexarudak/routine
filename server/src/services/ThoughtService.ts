import { Types } from 'mongoose';

import Service from './Service';
import Thought from '../schemas/Thought';
import PlanService from './PlanService';

import * as Type from '../common/types';

class ThoughtService extends Service {
  async get(userId: Types.ObjectId) {
    return await Thought.find({ userId: userId });
  }

  async getById(userId: Types.ObjectId, id: Types.ObjectId) {
    this.checkId(id);
    return await Thought.findById(id).where({ userId: userId });
  }

  async create(userId: Types.ObjectId, item: Type.TThought) {
    const clone = Object.assign({}, item);
    clone.userId = userId;
    return await Thought.create(clone);
  }

  async update(userId: Types.ObjectId, item: Type.TDBThought) {
    this.checkId(item._id);
    const itemForUpdate = { title: item.title };
    return await Thought.findByIdAndUpdate(item._id, itemForUpdate, { new: true }).where({ userId: userId });
  }

  async convertToPlan(userId: Types.ObjectId, id: Types.ObjectId, item: Type.TPlan) {
    this.checkId(id);
    const thought = await this.delete(userId, id);

    if (thought) {
      const plan: Type.TPlan = {
        userId: thought.userId,
        title: thought.title,
        text: item.text,
        color: item.color,
        duration: item.duration,
      };

      return await PlanService.create(userId, plan);
    }
    return null;
  }

  async delete(userId: Types.ObjectId, id: Types.ObjectId) {
    this.checkId(id);
    return await Thought.findByIdAndDelete(id).where({ userId: userId });
  }
}

export default new ThoughtService();
