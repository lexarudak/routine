import { Request, Response } from 'express';
import { Types } from 'mongoose';
import jwt from 'jsonwebtoken';

import config from '../common/config';
import { ClientError, ServerError } from '../common/errors';
import * as Enum from '../common/enums';

import User from '../schemas/User';

export default class Controller {
  protected async getUserId(req: Request): Promise<Types.ObjectId> {
    try {
      const token = req.cookies[Enum.Constants.tokenDescription];
      if (!token) {
        throw new ClientError(Enum.ErrorMessages.e1002, Enum.StatusCodes.Unauthorized);
      }
      const decoded = jwt.verify(token, config.get('jwtSecretKey'));
      if (!decoded) {
        throw new ClientError(Enum.ErrorMessages.e1003, Enum.StatusCodes.Unauthorized);
      }
      const payload = decoded as { id: Types.ObjectId };
      if (!payload.id) {
        throw new ClientError(Enum.ErrorMessages.e1004, Enum.StatusCodes.Unauthorized);
      }
      const user = await User.findById(payload.id);
      if (!user) {
        throw new ClientError(Enum.ErrorMessages.e1005, Enum.StatusCodes.Unauthorized);
      }
      return user._id;
    } catch (error) {
      if (error instanceof Error) {
        throw new ClientError(`${Enum.ErrorMessages.e1006} (${error.message})`, Enum.StatusCodes.Unauthorized);
      } else {
        throw error;
      }
    }
  }

  protected error(res: Response, error: Error | unknown): void {
    if (error instanceof ClientError || error instanceof ServerError) {
      res.status(error.statusCode).json(error.message);
    } else if (error instanceof Error) {
      res.status(Enum.StatusCodes.InternalServerError).json(error.message);
    } else {
      throw error;
    }
  }
}
