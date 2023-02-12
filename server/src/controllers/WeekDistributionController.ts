import { Request, Response } from 'express';
import { Types } from 'mongoose';

import Controller from './Controller';
import WeekDistributionService from '../services/WeekDistributionService';

import * as Type from '../common/types';

class WeekDistributionController extends Controller {
  async get(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await WeekDistributionService.get(userId);
    this.handleWithAuthorization<Type.TDBPlan[][]>(req, res, process);
  }

  async adjustPlan(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await WeekDistributionService.adjustPlan(userId, req.body);
    this.handleWithAuthorization<Type.TWeekDistribution>(req, res, process);
  }
}

export default new WeekDistributionController();
