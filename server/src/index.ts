import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import router from './common/router';
import config from './common/config';
import cors from './common/cors';

const srv = express();
srv.use(cors);
srv.use(express.json());
srv.use(cookieParser());
srv.use('/api', router);

const port = process.env.PORT || config.get('port');
mongoose.set('strictQuery', false);

async function start() {
  try {
    await mongoose.connect(config.get('dbUrl'));
    srv.listen(port, () => console.log('Ok! Server is working...'));
  } catch (error) {
    console.log(error);
  }
}

start();
