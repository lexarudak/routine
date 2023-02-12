import { Request, Response } from 'express';
import { Types } from 'mongoose';

import Controller from './Controller';
import DayDistributionService from '../services/DayDistributionService';

import * as Type from '../common/types';

class DayDistributionController extends Controller {
  async get(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await DayDistributionService.get(userId, +req.params.dayOfWeek);
    this.handleWithAuthorization<Type.TDayDistributionData>(req, res, process);
  }

  async adjustPlan(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await DayDistributionService.adjustPlan(userId, req.body);
    this.handleWithAuthorization<Type.TDayDistribution[]>(req, res, process);
  }
}

export default new DayDistributionController();
