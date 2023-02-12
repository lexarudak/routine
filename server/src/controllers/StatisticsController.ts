import { Request, Response } from 'express';
import { Types } from 'mongoose';

import Controller from './Controller';
import StatisticsService from '../services/StatisticsService';

import * as Type from '../common/types';

class StatisticsController extends Controller {
  async get(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await StatisticsService.get(userId);
    this.handleWithAuthorization<Type.TStatisticsData>(req, res, process);
  }

  async confirmDay(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await StatisticsService.confirmDay(userId, req.body);
    this.handleWithAuthorization<Type.TStatistics[]>(req, res, process);
  }
}

export default new StatisticsController();
