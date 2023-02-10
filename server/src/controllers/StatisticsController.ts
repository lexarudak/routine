import StatisticsService from '../services/StatisticsService';
import { Request, Response } from 'express';
import Controller from './Controller';

class StatisticsController extends Controller {
  async get(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const items = await StatisticsService.get(userId);
      res.json(items);
    } catch (error) {
      this.error(res, error);
    }
  }

  async confirmDay(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const updatedItems = await StatisticsService.confirmDay(userId, req.body);
      res.json(updatedItems);
    } catch (error) {
      this.error(res, error);
    }
  }
}

export default new StatisticsController();
