import { Types } from 'mongoose';

import Plan from '../schemas/Plan';
import Service from './Service';

import DayDistributionService from './DayDistributionService';
import WeekDistributionService from './WeekDistributionService';
import StatisticsService from './StatisticsService';

import * as Type from '../common/types';

class PlanService extends Service<Type.TPlan> {
  protected model = Plan;

  async get(userId: Types.ObjectId) {
    return await this.model.find({ userId: userId });
  }

  async getById(userId: Types.ObjectId, id: Types.ObjectId) {
    const doc = await this.model.findById(id).where({ userId: userId });
    if (doc) {
      return doc.toObject();
    }
    return null;
  }

  async create(userId: Types.ObjectId, item: Type.TPlan) {
    const itemForCreate = Object.assign({}, item, { userId: userId });
    return await this.model.create(itemForCreate);
  }

  async update(userId: Types.ObjectId, item: Type.TDBPlan) {
    const itemForUpdate: Partial<Type.TDBPlan> = {
      title: item.title,
      text: item.text,
      color: item.color,
      duration: item.duration,
    };
    return (await this.model.findByIdAndUpdate(item._id, itemForUpdate, { new: true }).where({ userId: userId })) as Type.TDBPlan;
  }

  async delete(userId: Types.ObjectId, id: Types.ObjectId) {
    const services = [StatisticsService, DayDistributionService, WeekDistributionService];
    await Promise.all(services.map((service) => service.deleteByParameters({ userId, planId: new Types.ObjectId(id) })));
    return (await this.model.findByIdAndDelete(id).where({ userId: userId })) as Type.TDBPlan;
  }
}

export default new PlanService();
