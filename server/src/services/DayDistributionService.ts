import { Types } from 'mongoose';

import DayDistribution from '../schemas/DayDistribution';
import PlanService from './PlanService';
import WeekDistributionService from './WeekDistributionService';

import { ClientError } from '../common/errors';
import * as Type from '../common/types';

class DayDistributionService {
  async get(userId: Types.ObjectId, dayOfWeek: number) {
    const result: Type.TDayDistributionData = { distributedPlans: [], notDistributedPlans: [] };

    const dayDistributions = await this.getByDay(userId, dayOfWeek);
    const weekDistributions = await WeekDistributionService.getByDay(userId, dayOfWeek);

    for (let i = 0; i < dayDistributions.length; i++) {
      const dayDistribution = dayDistributions[i];
      await this.addDistributedPlan(dayDistribution, result);
      this.subtractDistributedTimeFromWeekDistribution(weekDistributions, dayDistribution);
    }

    for (let i = 0; i < weekDistributions.length; i++) {
      await this.addNotDistributedPlan(weekDistributions[i], result);
    }

    return result;
  }

  private subtractDistributedTimeFromWeekDistribution(weekDistributions: Type.TDBWeekDistribution[], dayDistribution: Type.TDBDayDistribution) {
    const weekDistribution = weekDistributions.find((weekDistribution) => String(weekDistribution.planId) === String(dayDistribution.planId));
    if (weekDistribution) {
      weekDistribution.duration -= dayDistribution.to - dayDistribution.from;
    }
  }

  private async addDistributedPlan(dayDistribution: Type.TDBDayDistribution, result: Type.TDayDistributionData) {
    const plan = await PlanService.getById(dayDistribution.userId, dayDistribution.planId);
    if (plan) {
      const distributedPlan: Type.TDistributedPlan = {
        _id: plan._id,
        userId: plan.userId,
        title: plan.title,
        text: plan.text,
        color: plan.color,
        from: dayDistribution.from,
        to: dayDistribution.to,
      };
      result.distributedPlans.push(distributedPlan);
    }
  }

  private async addNotDistributedPlan(weekDistribution: Type.TDBWeekDistribution, result: Type.TDayDistributionData) {
    if (weekDistribution.duration) {
      const plan = await PlanService.getById(weekDistribution.userId, weekDistribution.planId);
      if (plan) {
        const notDistributedPlan: Type.TNotDistributedPlan = {
          _id: plan._id,
          userId: plan.userId,
          title: plan.title,
          text: plan.text,
          color: plan.color,
          duration: weekDistribution.duration,
        };
        result.notDistributedPlans.push(notDistributedPlan);
      }
    }
  }

  async getByDay(userId: Types.ObjectId, dayOfWeek: number) {
    return await DayDistribution.find({ userId: userId, dayOfWeek: dayOfWeek });
  }

  async create(userId: Types.ObjectId, item: Type.TDayDistribution) {
    if (item.dayOfWeek < 0 || item.dayOfWeek > 6) {
      throw new ClientError(`Incorrect value of parameter "day of week"`, 400);
    }
    if (item.from < 0 || item.from > 1440) {
      throw new ClientError(`Incorrect value of parameter "from"`, 400);
    }
    if (item.to < 0 || item.to > 1440) {
      throw new ClientError(`Incorrect value of parameter "to"`, 400);
    }
    const clone = Object.assign({}, item);
    clone.userId = userId;
    return await DayDistribution.create(clone);
  }

  async deleteByPlan(userId: Types.ObjectId, planId: Types.ObjectId) {
    return await DayDistribution.deleteMany({ userId: userId, planId: planId });
  }

  async deleteByDay(userId: Types.ObjectId, dayOfWeek: number) {
    return await DayDistribution.deleteMany({ userId: userId, dayOfWeek: dayOfWeek });
  }

  async adjustPlan(userId: Types.ObjectId, item: Type.TDayDistributionAdjastPlan) {
    const distributions = item.dayDistribution;
    const result: Type.TDayDistribution[] = [];

    await this.deleteByDay(userId, item.dayOfWeek);

    for (let i = 0; i < distributions.length; i++) {
      const distribution = distributions[i];
      distribution.dayOfWeek = item.dayOfWeek;
      result.push(await this.create(userId, distribution));
    }

    return result;
  }
}

export default new DayDistributionService();
