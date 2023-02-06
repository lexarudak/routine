import PlanService from '../services/PlanService';
import { Request, Response } from 'express';
import Controller from './Controller';

class PlanController extends Controller {
  async get(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const items = await PlanService.get(userId);
      res.json(items);
    } catch (error) {
      this.error(res, error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const item = await PlanService.getById(userId, req.params.id);
      res.json(item);
    } catch (error) {
      this.error(res, error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const item = await PlanService.create(userId, req.body);
      res.json(item);
    } catch (error) {
      this.error(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const updatedItem = await PlanService.update(userId, req.body);
      res.json(updatedItem);
    } catch (error) {
      this.error(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const item = await PlanService.delete(userId, req.params.id);
      res.json(item);
    } catch (error) {
      this.error(res, error);
    }
  }
}

export default new PlanController();
