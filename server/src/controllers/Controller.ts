import { Request, Response } from 'express';
import { ClientError, ServerError } from '../common/errors';
import jwt from 'jsonwebtoken';
import config from '../common/config';
import * as Enum from '../common/enums';
import { Types } from 'mongoose';
import User from '../schemas/User';

export default class Controller {
  protected async getUserId(req: Request) {
    try {
      const token = req.cookies[Enum.Constants.tokenDescription];
      if (!token) {
        throw new ClientError('No authorization data', 401);
      }
      const decoded = jwt.verify(token, config.get('jwtSecretKey'));
      if (!decoded) {
        throw new ClientError('Invalid JWT token', 401);
      }
      const payload = decoded as { id: Types.ObjectId };
      if (!payload.id) {
        throw new ClientError('No user ID in JWT token', 401);
      }
      const user = await User.findById(payload.id);
      if (!user) {
        throw new ClientError('No user with received authorization data', 401);
      }
      return user._id;
    } catch (error) {
      if (error instanceof Error) {
        throw new ClientError(`The user is unauthorized (${error.message})`, 401);
      } else {
        throw error;
      }
    }
  }

  protected error(res: Response, error: Error | unknown): void {
    if (error instanceof ClientError || error instanceof ServerError) {
      res.status(error.statusCode).json(error.message);
    } else if (error instanceof Error) {
      res.status(500).json(error.message);
    } else {
      throw error;
    }
  }
}
