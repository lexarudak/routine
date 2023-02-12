import ThoughtService from '../services/ThoughtService';
import { Request, Response } from 'express';
import Controller from './Controller';

class ThoughtController extends Controller {
  async get(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const items = await ThoughtService.get(userId);
      res.json(items);
    } catch (error) {
      this.error(res, error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const item = await ThoughtService.getById(userId, req.params.id);
      res.json(item);
    } catch (error) {
      this.error(res, error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const item = await ThoughtService.create(userId, req.body);
      res.json(item);
    } catch (error) {
      this.error(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const updatedItem = await ThoughtService.update(userId, req.body);
      res.json(updatedItem);
    } catch (error) {
      this.error(res, error);
    }
  }

  async transferToPlan(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const item = await ThoughtService.transferToPlan(userId, req.params.id);
      res.json(item);
    } catch (error) {
      this.error(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const userId = await this.getUserId(req);
      const item = await ThoughtService.delete(userId, req.params.id);
      res.json(item);
    } catch (error) {
      this.error(res, error);
    }
  }
}

export default new ThoughtController();
