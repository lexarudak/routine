import { Types } from 'mongoose';

import WeekDistribution from '../schemas/WeekDistribution';
import Service from './Service';
import PlanService from './PlanService';

import { ClientError } from '../common/errors';
import * as Type from '../common/types';

class WeekDistributionService extends Service<Type.TWeekDistribution> {
  protected model = WeekDistribution;

  async get(userId: Types.ObjectId) {
    const result: Type.TDBPlan[][] = [[], [], [], [], [], [], []];

    const distributions = (await this.model.find({ userId: userId })) as Type.TDBWeekDistribution[];
    for (let i = 0; i < distributions.length; i++) {
      const distribution = distributions[i];

      const plan = (await PlanService.getById(userId, distribution.planId)) as Type.TDBPlan;
      if (plan) {
        plan.duration = distribution.duration;
        result[distribution.dayOfWeek].push(plan);
      }
    }
    return result;
  }

  async create(userId: Types.ObjectId, item: Type.TWeekDistribution) {
    this.checkDayOfWeek(item.dayOfWeek);
    this.checkDuration(item.duration);

    const itemForCreate = Object.assign({}, item, { userId: userId });
    return await this.model.create(itemForCreate);
  }

  async adjustPlan(userId: Types.ObjectId, item: Type.TDBWeekDistribution) {
    const plan = (await PlanService.getById(userId, item.planId)) as Type.TDBPlan;
    if (!plan) {
      throw new ClientError(`The user has no plan with ID ${item.planId}`);
    }

    const distributions = (await this.model.find({ userId: userId, planId: item.planId })) as Type.TDBWeekDistribution[];
    const OldDistributedDuration = distributions.reduce((sum, distribution) => sum + distribution.duration, 0);
    const NewDistributedDuration = OldDistributedDuration + item.duration;

    if (plan.duration < NewDistributedDuration) {
      throw new ClientError(`The plan duration is less than distributed`);
    }

    const distribution = distributions.find((distribution) => distribution.dayOfWeek === item.dayOfWeek);
    if (!distribution) {
      return await this.create(userId, item);
    }

    const duration = distribution.duration + item.duration;
    if (duration) {
      this.checkDuration(item.duration);
      const itemForUpdate: Partial<Type.TDBWeekDistribution> = { duration: duration };
      return await this.model.findByIdAndUpdate(distribution._id, itemForUpdate, { new: true }).where({ userId: userId });
    } else {
      return await this.model.findByIdAndDelete(distribution._id).where({ userId: userId });
    }
  }
}

export default new WeekDistributionService();
