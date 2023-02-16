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

    let dayDistributions: Type.TDBDayDistribution[];
    let weekDistributions: Type.TDBWeekDistribution[];
    let plans;

    [dayDistributions, weekDistributions, plans] = await Promise.all([
      this.getByParameters({ userId, dayOfWeek }),
      WeekDistributionService.getByParameters({ userId, dayOfWeek }),
      PlanService.get(userId),
    ]);

    plans = plans.map((item) => item.toObject());

    for (let i = 0; i < dayDistributions.length; i++) {
      const dayDistribution = dayDistributions[i];
      this.addDistributedPlan(dayDistribution, plans, result);
      this.subtractDistributedTimeFromWeekDistribution(weekDistributions, dayDistribution);
    }
    for (let i = 0; i < weekDistributions.length; i++) {
      this.addNotDistributedPlan(weekDistributions[i], plans, result);
    }

    result.distributedPlans.sort((a, b) => a.from - b.from);
    return result;
  }

  private subtractDistributedTimeFromWeekDistribution(weekDistributions: Type.TDBWeekDistribution[], dayDistribution: Type.TDBDayDistribution) {
    const weekDistribution = weekDistributions.find((weekDistribution) => String(weekDistribution.planId) === String(dayDistribution.planId));
    if (weekDistribution) {
      weekDistribution.duration -= dayDistribution.to - dayDistribution.from;
    }
  }

  private addDistributedPlan(dayDistribution: Type.TDBDayDistribution, plans: Type.TDBPlan[], result: Type.TDayDistributionData) {
    const plan = plans.find((item) => item._id.toString() === dayDistribution.planId.toString());
    if (plan) {
      const period: Type.TPeriod = { from: dayDistribution.from, to: dayDistribution.to };

      const distributedPlan: Type.TDistributedPlan & Partial<Type.TDuration> = Object.assign({}, plan, period);
      delete distributedPlan.duration;

      result.distributedPlans.push(distributedPlan);
    }
  }

  private addNotDistributedPlan(weekDistribution: Type.TDBWeekDistribution, plans: Type.TDBPlan[], result: Type.TDayDistributionData) {
    if (weekDistribution.duration) {
      const plan = plans.find((item) => item._id.toString() === weekDistribution.planId.toString());
      if (plan) {
        const notDistributedPlan: Type.TNotDistributedPlan = Object.assign({}, plan, { duration: weekDistribution.duration });
        result.notDistributedPlans.push(notDistributedPlan);
      }
    }
  }

  async create(userId: Types.ObjectId, item: Type.TDayDistribution) {
    this.checkDayOfWeek(item.dayOfWeek);
    this.checkPeriod(item.from, item.to);

    const itemForCreate = Object.assign({}, item, { userId });
    return await this.model.create(itemForCreate);
  }

  async adjustPlan(userId: Types.ObjectId, item: Type.TDayDistributionAdjastPlan) {
    const distributions = item.dayDistribution;
    await this.deleteByParameters({ userId, dayOfWeek: item.dayOfWeek });

    return await Promise.all(
      distributions.map((distribution) => {
        distribution.dayOfWeek = item.dayOfWeek;
        return this.create(userId, distribution);
      })
    );
  }
}

export default new DayDistributionService();
