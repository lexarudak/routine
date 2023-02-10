import WeekDistribution from '../schemas/WeekDistribution';
import PlanService from './PlanService';
import { ClientError } from '../common/errors';
import * as Type from '../common/types';
import { Types } from 'mongoose';

class WeekDistributionService {
  async get(userId: Types.ObjectId) {
    const result: Type.TDBPlan[][] = [[], [], [], [], [], [], []];

    const distributions = (await WeekDistribution.find({ userId: userId })) as Type.TDBWeekDistribution[];
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

  async getByDay(userId: Types.ObjectId, dayOfWeek: number) {
    return await WeekDistribution.find({ userId: userId, dayOfWeek: dayOfWeek });
  }

  async create(userId: Types.ObjectId, item: Type.TWeekDistribution) {
    if (item.dayOfWeek < 0 || item.dayOfWeek > 6) {
      throw new ClientError(`Incorrect value of parameter "day of week"`, 400);
    }
    if (item.duration < 0) {
      throw new ClientError(`Incorrect value of parameter "duration"`, 400);
    }
    const clone = Object.assign({}, item);
    clone.userId = userId;
    return await WeekDistribution.create(clone);
  }

  async deleteByPlan(userId: Types.ObjectId, planId: Types.ObjectId) {
    return await WeekDistribution.deleteMany({ userId: userId, planId: planId });
  }

  async adjustPlan(userId: Types.ObjectId, item: Type.TDBWeekDistribution) {
    const plan = (await PlanService.getById(userId, item.planId)) as Type.TDBPlan;
    if (!plan) {
      throw new ClientError(`The user has no plan with ID ${item.planId}`, 400);
    }

    const distributions = (await WeekDistribution.find({ userId: userId, planId: item.planId })) as Type.TDBWeekDistribution[];
    const OldDistributedDuration = distributions.reduce((sum, distribution) => sum + distribution.duration, 0);
    const NewDistributedDuration = OldDistributedDuration + item.duration;

    if (plan.duration < NewDistributedDuration) {
      throw new ClientError(`The plan duration is less than distributed`, 400);
    }

    const distribution = distributions.find((distribution) => distribution.dayOfWeek === item.dayOfWeek);
    if (!distribution) {
      return await this.create(userId, item);
    }

    const duration = distribution.duration + item.duration;
    if (duration) {
      if (item.duration < 0) {
        throw new ClientError(`Incorrect value of parameter "duration"`, 400);
      }
      const itemForUpdate = {
        duration: duration,
      };
      return await WeekDistribution.findByIdAndUpdate(distribution._id, itemForUpdate, { new: true }).where({ userId: userId });
    } else {
      return await WeekDistribution.findByIdAndDelete(distribution._id).where({ userId: userId });
    }
  }
}

export default new WeekDistributionService();
