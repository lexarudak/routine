import { Types } from 'mongoose';

import Thought from '../schemas/Thought';
import Service from './Service';
import PlanService from './PlanService';

import * as Type from '../common/types';

class ThoughtService extends Service<Type.TThought> {
  protected model = Thought;

  async get(userId: Types.ObjectId) {
    return await this.model.find({ userId: userId });
  }

  async getById(userId: Types.ObjectId, id: Types.ObjectId) {
    return (await this.model.findById(id).where({ userId: userId })) as Type.TDBThought;
  }

  async create(userId: Types.ObjectId, item: Type.TThought) {
    const itemForCreate = Object.assign({}, item, { userId: userId });
    return await this.model.create(itemForCreate);
  }

  async update(userId: Types.ObjectId, item: Type.TDBThought) {
    const itemForUpdate: Partial<Type.TDBThought> = { title: item.title };
    return (await this.model.findByIdAndUpdate(item._id, itemForUpdate, { new: true }).where({ userId: userId })) as Type.TDBThought;
  }

  async convertToPlan(userId: Types.ObjectId, id: Types.ObjectId, item: Type.TPlan) {
    const thought = await this.delete(userId, id);

    if (thought) {
      const plan: Type.TPlan = {
        userId: thought.userId,
        title: item.title,
        text: item.text,
        color: item.color,
        duration: item.duration,
      };
      return await PlanService.create(userId, plan);
    }
    return null;
  }

  async delete(userId: Types.ObjectId, id: Types.ObjectId) {
    return (await this.model.findByIdAndDelete(id).where({ userId: userId })) as Type.TDBThought;
  }
}

export default new ThoughtService();
