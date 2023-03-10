import { Types } from 'mongoose';

import Statistics from '../schemas/Statistics';
import Service from './Service';
import WeekDistributionService from './WeekDistributionService';
import PlanService from './PlanService';
import UserService from './UserService';

import * as Type from '../common/types';
import * as Enum from '../common/enums';

class StatisticsService extends Service<Type.TStatistics> {
  protected model = Statistics;

  async get(userId: Types.ObjectId) {
    const result: Type.TStatisticsData = [];
    const processedPlanIDs: string[] = [];

    let statistics: Type.TStatistics[];
    let plans;

    [statistics, plans] = await Promise.all([this.model.find({ userId }), PlanService.get(userId)]);
    plans = plans.map((item) => item.toObject());

    for (let i = 0; i < statistics.length; i++) {
      const planId = statistics[i].planId.toString();

      if (!processedPlanIDs.includes(planId)) {
        const statisticsByPlan = statistics.filter((statistic) => statistic.planId.toString() === planId);
        this.addAverageStatistics(statistics[i], statisticsByPlan, plans, result);
        processedPlanIDs.push(planId);
      }
    }

    return result;
  }

  private addAverageStatistics(
    statistic: Type.TStatistics,
    statisticsByPlan: Type.TStatistics[],
    plans: Type.TDBPlan[],
    result: Type.TStatisticsData
  ) {
    const plan = plans.find((item) => item._id.toString() === statistic.planId.toString());
    if (plan) {
      const numberOfConfirmedDays = statisticsByPlan.length;
      const entireDeviation = statisticsByPlan.reduce((deviation, statistic) => deviation + statistic.deviation, 0);
      const averageDeviation = Math.round(entireDeviation / numberOfConfirmedDays);

      const averageStatistic: Type.TStatisticsDataItem & Partial<Type.TDuration> = Object.assign({}, plan, { deviation: averageDeviation });
      delete averageStatistic.duration;

      result.push(averageStatistic);
    }
  }

  async create(userId: Types.ObjectId, item: Type.TStatistics) {
    const itemForCreate = Object.assign({}, item, { userId: userId });
    return await this.model.create(itemForCreate);
  }

  private getCalculatedDeviation(distributionPlan: Type.TWeekDistribution | undefined, distributionFact: Type.TWeekDistribution | undefined) {
    switch (false) {
      case Boolean(distributionPlan):
        if (distributionFact) {
          return distributionFact.duration;
        }
        break;
      case Boolean(distributionFact):
        if (distributionPlan) {
          return -distributionPlan.duration;
        }
        break;
      default:
        if (distributionPlan && distributionFact) {
          return distributionFact.duration - distributionPlan.duration;
        }
        break;
    }
    return 0;
  }

  async confirmDay(userId: Types.ObjectId, item: Type.TStatisticsConfirmDay) {
    let distributionsPlan: Type.TWeekDistribution[] = [];
    const distributionsFact = item.dayDistribution;
    let user: Type.TDBUser;

    [user, distributionsPlan] = await Promise.all([
      UserService.getById(userId),
      WeekDistributionService.getByParameters({ userId, dayOfWeek: item.dayOfWeek })
    ]);

    const plans = new Set<string>();
    distributionsPlan.forEach((distribution) => plans.add(distribution.planId.toString()));
    distributionsFact.forEach((distribution) => plans.add(distribution.planId.toString()));
    const PlanIDs = Array.from(plans.values());

    const date = this.getConfirmationDate(user);
    await this.model.deleteMany({ userId, confirmedDate: date });

    return await Promise.all(PlanIDs.map((planId) => {
      const distributionPlan = distributionsPlan.find((distribution) => String(distribution.planId) === planId);
      const distributionFact = distributionsFact.find((distribution) => String(distribution.planId) === planId);

      const statistics: Type.TStatistics = {
        userId: userId,
        planId: new Types.ObjectId(planId),
        deviation: this.getCalculatedDeviation(distributionPlan, distributionFact),
        confirmedDate: date
      };

      return this.create(userId, statistics);
    }));
  }

  private getConfirmationDate(user: Type.TDBUser) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    if (user.confirmationDay === Enum.ConfirmationDays.yesterday) {
      date.setDate(date.getDate() - 1);
    }
    return date;
  }

  async isDayConfirmed(userId: Types.ObjectId) {
    const user = await UserService.getById(userId);
    const date = this.getConfirmationDate(user);
    return await this.isConfirmationExists(userId, date);
  }

  async isConfirmationExists(userId: Types.ObjectId, date: Date) {
    const statistics = await this.model.findOne({ userId, confirmedDate: date });
    return Boolean(statistics);
  }
}

export default new StatisticsService();
