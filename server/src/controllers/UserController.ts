import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Types } from 'mongoose';

import Controller from './Controller';
import UserService from '../services/UserService';

import config from '../common/config';
import * as Type from '../common/types';
import * as Enum from '../common/enums';

class UserController extends Controller {
  async get(req: Request, res: Response) {
    try {
      const users = await UserService.get();
      res.json(users);
    } catch (error) {
      this.error(res, error);
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const user = await UserService.delete(new Types.ObjectId(req.params.id));
      res.json(user);
    } catch (error) {
      this.error(res, error);
    }
  }

  async create(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(Enum.StatusCodes.BadRequest).json(errors.array().at(0)?.msg);
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

  async profile(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await UserService.getById(userId);
    this.handleWithAuthorization<Type.TDBUser>(req, res, process);
  }

  async update(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await UserService.update(userId, req.body);
    this.handleWithAuthorization<Type.TDBUser>(req, res, process);
  }

  private setJwtToken(res: Response, token: string, remember = false) {
    const maxAge = remember ? config.get('tokenExpiresInLong') : config.get('tokenExpiresInShort');
    res.cookie(Enum.Constants.tokenDescription, token, { maxAge: maxAge, httpOnly: true, secure: true, sameSite: 'none' });
  }
}

export default new UserController();
