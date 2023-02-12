import { Types } from 'mongoose';

import DayDistribution from '../schemas/DayDistribution';
import Service from './Service';
import PlanService from './PlanService';
import WeekDistributionService from './WeekDistributionService';

import * as Type from '../common/types';

class DayDistributionService extends Service<Type.TDayDistribution> {
  protected model = DayDistribution;

  async get(userId: Types.ObjectId, dayOfWeek: number) {
    const result: Type.TDayDistributionData = { distributedPlans: [], notDistributedPlans: [] };

    const dayDistributions = await this.getByParameters({ userId, dayOfWeek });
    const weekDistributions = await WeekDistributionService.getByParameters({ userId, dayOfWeek });

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
      const period: Type.TPeriod = { from: dayDistribution.from, to: dayDistribution.to };

      const distributedPlan: Type.TDistributedPlan & Partial<Type.TDuration> = Object.assign(plan, period);
      delete distributedPlan.duration;

      result.distributedPlans.push(distributedPlan);
    }
  }

  private async addNotDistributedPlan(weekDistribution: Type.TDBWeekDistribution, result: Type.TDayDistributionData) {
    if (weekDistribution.duration) {
      const plan = await PlanService.getById(weekDistribution.userId, weekDistribution.planId);
      if (plan) {
        const notDistributedPlan: Type.TNotDistributedPlan = Object.assign(plan, { duration: weekDistribution.duration });
        result.notDistributedPlans.push(notDistributedPlan);
      }
    }
  }

  async create(userId: Types.ObjectId, item: Type.TDayDistribution) {
    this.checkDayOfWeek(item.dayOfWeek);
    this.checkPeriod(item.from, item.to);

    const itemForCreate = Object.assign({}, item, { userId: userId });
    return await this.model.create(itemForCreate);
  }

  async adjustPlan(userId: Types.ObjectId, item: Type.TDayDistributionAdjastPlan) {
    const distributions = item.dayDistribution;
    const result: Type.TDayDistribution[] = [];

    await this.deleteByParameters({ userId, dayOfWeek: item.dayOfWeek });

    for (let i = 0; i < distributions.length; i++) {
      const distribution = distributions[i];
      distribution.dayOfWeek = item.dayOfWeek;
      result.push(await this.create(userId, distribution));
    }

    return result;
  }
}

export default new DayDistributionService();
