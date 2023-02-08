import Plan from '../schemas/Plan';
import WeekDistributionService from './WeekDistributionService';
import { ClientError } from '../errors';
import * as Type from '../types';
import { Types } from 'mongoose';

class PlanService {
  async get(userId: Types.ObjectId) {
    return await Plan.find({ userId: userId });
  }

  async getById(userId: Types.ObjectId, id: string) {
    if (!id) {
      throw new ClientError('ID not specified');
    }
    return await Plan.findById(id).where({ userId: userId });
  }

  async create(userId: Types.ObjectId, item: Type.TPlan) {
    const clone = Object.assign({}, item);
    clone.userId = userId;
    return await Plan.create(clone);
  }

  async update(userId: Types.ObjectId, item: Type.TDBPlan) {
    if (!item._id) {
      throw new ClientError('ID not specified');
    }
    const itemForUpdate = {
      title: item.title,
      text: item.text,
      color: item.color,
      duration: item.duration,
    };
    return await Plan.findByIdAndUpdate(item._id, itemForUpdate, { new: true }).where({ userId: userId });
  }

  async delete(userId: Types.ObjectId, id: string) {
    if (!id) {
      throw new ClientError('ID not specified');
    }

    await WeekDistributionService.deleteByPlan(userId, new Types.ObjectId(id));

    return await Plan.findByIdAndDelete(id).where({ userId: userId });
  }
}

export default new PlanService();
