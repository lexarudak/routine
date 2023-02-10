import WeekDistributionService from '../services/WeekDistributionService';
import { Request, Response } from 'express';
import Controller from './Controller';

class WeekDistributionController extends Controller {
  async get(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const items = await WeekDistributionService.get(userId);
      res.json(items);
    } catch (error) {
      this.error(res, error);
    }
  }

  async adjustPlan(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const updatedItem = await WeekDistributionService.adjustPlan(userId, req.body);
      res.json(updatedItem);
    } catch (error) {
      this.error(res, error);
    }
  }
}

export default new WeekDistributionController();
