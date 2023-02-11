import { Request, Response, NextFunction } from 'express';
import config from './config';

function cors(req: Request, res: Response, next: NextFunction) {
  const origin = req.headers.origin || '';

  if (config.get('allowedOrigins').includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
  }

  next();
}

export default cors;
