import { Types } from 'mongoose';

import Statistics from '../schemas/Statistics';
import WeekDistributionService from './WeekDistributionService';
import * as Type from '../common/types';

class StatisticsService {
  async get(userId: Types.ObjectId) {
    const result: Type.TStatistics[] = [];
    const processedPlanIDs: string[] = [];

    const statistics = await Statistics.find({ userId: userId });

    statistics.forEach((statistic) => {
      const planId = statistic.planId.toString();

      if (!processedPlanIDs.includes(planId)) {
        const statisticsByPlan = statistics.filter((statistic) => statistic.planId.toString() === planId);

        const numberOfConfirmedDays = statisticsByPlan.length;
        const entireDeviation = statisticsByPlan.reduce((deviation, statistic) => deviation + statistic.deviation, 0);

        const averageStatistic: Type.TStatistics = {
          userId: statistic.userId,
          planId: statistic.planId,
          deviation: Math.round(entireDeviation / numberOfConfirmedDays),
        };

        result.push(averageStatistic);
        processedPlanIDs.push(averageStatistic.planId.toString());
      }
    });

    return result;
  }

  async create(userId: Types.ObjectId, item: Type.TStatistics) {
    const clone = Object.assign({}, item);
    clone.userId = userId;
    return await Statistics.create(clone);
  }

  async deleteByPlan(userId: Types.ObjectId, planId: Types.ObjectId) {
    return await Statistics.deleteMany({ userId: userId, planId: planId });
  }

  async confirmDay(userId: Types.ObjectId, item: Type.TStatisticConfirmDay) {
    const result: Type.TStatistics[] = [];

    const distributionsPlan = await WeekDistributionService.getByDay(userId, item.dayOfWeek);
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
        deviation: 0,
      };

      switch (false) {
        case Boolean(distributionPlan):
          if (distributionFact) {
            statistics.deviation = distributionFact.duration;
          }
          break;
        case Boolean(distributionFact):
          if (distributionPlan) {
            statistics.deviation = -distributionPlan.duration;
          }
          break;
        default:
          if (distributionPlan && distributionFact) {
            statistics.deviation = distributionPlan.duration - distributionFact.duration;
          }
          break;
      }
      const createdItem = await this.create(userId, statistics);
      result.push(createdItem);
    }

    return result;
  }
}

export default new StatisticsService();
