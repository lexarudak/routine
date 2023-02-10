import { Request, Response } from 'express';
import Controller from './Controller';
import DayDistributionService from '../services/DayDistributionService';

class DayDistributionController extends Controller {
  async get(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const items = await DayDistributionService.get(userId, +req.params.dayOfWeek);
      res.json(items);
    } catch (error) {
      this.error(res, error);
    }
  }

  async adjustPlan(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const updatedItem = await DayDistributionService.adjustPlan(userId, req.body);
      res.json(updatedItem);
    } catch (error) {
      this.error(res, error);
    }
  }
}

export default new DayDistributionController();
