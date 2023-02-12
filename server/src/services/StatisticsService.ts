import { Types } from 'mongoose';

import Service from './Service';
import Statistics from '../schemas/Statistics';
import WeekDistributionService from './WeekDistributionService';
import PlanService from './PlanService';

import * as Type from '../common/types';

class StatisticsService extends Service {
  async get(userId: Types.ObjectId) {
    const result: Type.TStatisticsData = [];
    const processedPlanIDs: string[] = [];

    const statistics = await Statistics.find({ userId: userId });

    for (let i = 0; i < statistics.length; i++) {
      const planId = statistics[i].planId.toString();

      if (!processedPlanIDs.includes(planId)) {
        const statisticsByPlan = statistics.filter((statistic) => statistic.planId.toString() === planId);
        await this.addAverageStatistics(statistics[i], statisticsByPlan, result);
        processedPlanIDs.push(planId);
      }
    }

    return result;
  }

  private async addAverageStatistics(statistic: Type.TStatistics, statisticsByPlan: Type.TStatistics[], result: Type.TStatisticsData) {
    const numberOfConfirmedDays = statisticsByPlan.length;
    const entireDeviation = statisticsByPlan.reduce((deviation, statistic) => deviation + statistic.deviation, 0);

    const plan = await PlanService.getById(statistic.userId, statistic.planId);
    if (plan) {
      const averageStatistic: Type.TStatisticsDataItem = {
        _id: plan._id,
        userId: plan.userId,
        title: plan.title,
        text: plan.text,
        color: plan.color,
        deviation: Math.round(entireDeviation / numberOfConfirmedDays),
      };
      result.push(averageStatistic);
    }
  }

  async create(userId: Types.ObjectId, item: Type.TStatistics) {
    const clone = Object.assign({}, item);
    clone.userId = userId;
    return await Statistics.create(clone);
  }

  async deleteByPlan(userId: Types.ObjectId, planId: Types.ObjectId) {
    return await Statistics.deleteMany({ userId: userId, planId: planId });
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
          return distributionPlan.duration - distributionFact.duration;
        }
        break;
    }
    return 0;
  }

  async confirmDay(userId: Types.ObjectId, item: Type.TStatisticsConfirmDay) {
    const result: Type.TStatistics[] = [];

    const distributionsPlan = (await WeekDistributionService.getByDay(userId, item.dayOfWeek)) as Type.TWeekDistribution[];
    const distributionsFact = item.dayDistribution;

    const plans = new Set<string>();
    distributionsPlan.forEach((distribution) => plans.add(distribution.planId.toString()));
    distributionsFact.forEach((distribution) => plans.add(distribution.planId.toString()));
    const PlanIDs = Array.from(plans.values());

    for (let i = 0; i < PlanIDs.length; i++) {
      const planId = PlanIDs[i];

      const distributionPlan = distributionsPlan.find((distribution) => String(distribution.planId) === planId);
      const distributionFact = distributionsFact.find((distribution) => String(distribution.planId) === planId);

      const statistics: Type.TStatistics = {
        userId: userId,
        planId: new Types.ObjectId(planId),
        deviation: this.getCalculatedDeviation(distributionPlan, distributionFact),
      };

      const createdItem = await this.create(userId, statistics);
      result.push(createdItem);
    }

    return result;
  }
}

export default new StatisticsService();
