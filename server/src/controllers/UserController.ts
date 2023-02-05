import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import UserService from '../services/UserService';
import Controller from './Controller';
import config from '../config';
import * as Type from '../types';

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

      const user: Type.TUser = req.body;
      user.createdAt = new Date();

      await UserService.create(user);
      const login: Type.TLogin = req.body;

      const userData = await UserService.login(login);
      this.setJwtToken(res, userData.token, req.body?.remember);
      res.json(userData);
    } catch (error) {
      this.error(res, error);
    }
  }

  async login(req: Request, res: Response) {
    try {
      const userData = await UserService.login(req.body);
      this.setJwtToken(res, userData.token, req.body?.remember);
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

  private setJwtToken(res: Response, token: string, remember = false) {
    const maxAge = remember ? config.get('tokenExpiresInLong') : config.get('tokenExpiresInShort');
    res.cookie('rs-clone-user-token', token, { maxAge: maxAge, httpOnly: true });
  }
}

export default new UserController();
