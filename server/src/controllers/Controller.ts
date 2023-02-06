import { Response } from 'express';
import { ClientError, ServerError } from '../errors';

export default class Controller {
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
