import ThoughtService from '../services/ThoughtService';
import { Request, Response } from 'express';
import Controller from './Controller';

class ThoughtController extends Controller {
  async get(req: Request, res: Response) {
    try {
      const thoughts = await ThoughtService.get();
      res.json(thoughts);
    } catch (error) {
      this.error(res, error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const thought = await ThoughtService.getById(req.params.id);
      res.json(thought);
    } catch (error) {
      this.error(res, error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const thought = await ThoughtService.create(req.body);
      res.json(thought);
    } catch (error) {
      this.error(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedThought = await ThoughtService.update(req.body);
      res.json(updatedThought);
    } catch (error) {
      this.error(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const thought = await ThoughtService.delete(req.params.id);
      res.json(thought);
    } catch (error) {
      this.error(res, error);
    }
  }
}

export default new ThoughtController();
