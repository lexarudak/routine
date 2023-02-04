import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import UserService from '../services/UserService';
import Controller from './Controller';

class UserController extends Controller {
  async get(req: Request, res: Response) {
    try {
      const users = await UserService.get();
      res.json(users);
    } catch (error) {
      this.error(res, error);
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const user = await UserService.getById(req.params.id);
      res.json(user);
    } catch (error) {
      this.error(res, error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ message: 'Incorrect request', errors });
        return;
      }
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (error) {
      this.error(res, error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const userData = await UserService.login(req.body);
      res.json(userData);
    } catch (error) {
      this.error(res, error);
    }
  }

  async update(req: Request, res: Response) {
    try {
      const updatedUser = await UserService.update(req.body);
      res.json(updatedUser);
    } catch (error) {
      this.error(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = await UserService.delete(req.params.id);
      res.json(user);
    } catch (error) {
      this.error(res, error);
    }
  }
}

export default new UserController();
