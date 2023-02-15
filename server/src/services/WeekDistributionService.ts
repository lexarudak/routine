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

    let distributions: Type.TWeekDistribution[];
    let plans;

    [distributions, plans] = await Promise.all([this.model.find({ userId }), PlanService.get(userId)]);

    for (let i = 0; i < distributions.length; i++) {
      const distribution = distributions[i];
      const plan = plans.find((item) => item._id.toString() === distribution.planId.toString());
      if (plan) {
        const clone = Object.assign({}, plan.toObject(), { duration: distribution.duration });
        result[distribution.dayOfWeek].push(clone);
      }
    }
    return result;
  }

  async create(userId: Types.ObjectId, item: Type.TWeekDistribution) {
    this.checkDayOfWeek(item.dayOfWeek);
    this.checkDuration(item.duration);

    const itemForCreate = Object.assign({}, item, { userId });
    return (await this.model.create(itemForCreate)) as Type.TWeekDistribution;
  }

  async adjustPlan(userId: Types.ObjectId, item: Type.TDBWeekDistribution) {
    let distributions: Type.TDBWeekDistribution[];
    let plan: Type.TDBPlan | null;

    [distributions, plan] = await Promise.all([this.model.find({ userId, planId: item.planId }), PlanService.getById(userId, item.planId)]);

    if (!plan) {
      throw new ClientError(`The user has no plan with ID ${item.planId}`);
    }

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
    const id = distribution._id;

    if (duration) {
      this.checkDuration(duration);
      const itemForUpdate: Partial<Type.TDBWeekDistribution> = { duration };
      return (await this.model.findByIdAndUpdate(id, itemForUpdate, { new: true }).where({ userId })) as Type.TWeekDistribution;
    } else {
      return (await this.model.findByIdAndDelete(id).where({ userId })) as Type.TWeekDistribution;
    }
  }
}

export default new WeekDistributionService();
