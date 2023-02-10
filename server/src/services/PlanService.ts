import { Types } from 'mongoose';

import Service from './Service';
import Plan from '../schemas/Plan';
import DayDistributionService from './DayDistributionService';
import WeekDistributionService from './WeekDistributionService';
import StatisticsService from './StatisticsService';

import * as Type from '../common/types';

class PlanService extends Service {
  async get(userId: Types.ObjectId) {
    return await Plan.find({ userId: userId });
  }

  async getById(userId: Types.ObjectId, id: Types.ObjectId) {
    this.checkId(id);
    return await Plan.findById(id).where({ userId: userId });
  }

  async create(userId: Types.ObjectId, item: Type.TPlan) {
    const clone = Object.assign({}, item);
    clone.userId = userId;
    return await Plan.create(clone);
  }

  async update(userId: Types.ObjectId, item: Type.TDBPlan) {
    this.checkId(item._id);

    const itemForUpdate = {
      title: item.title,
      text: item.text,
      color: item.color,
      duration: item.duration,
    };

    return await Plan.findByIdAndUpdate(item._id, itemForUpdate, { new: true }).where({ userId: userId });
  }

  async delete(userId: Types.ObjectId, id: Types.ObjectId) {
    this.checkId(id);

    const services = [StatisticsService, DayDistributionService, WeekDistributionService];
    await Promise.all(services.map((service) => service.deleteByPlan(userId, new Types.ObjectId(id))));

    return await Plan.findByIdAndDelete(id).where({ userId: userId });
  }
}

export default new PlanService();
