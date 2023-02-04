import Router from 'express';
import { check } from 'express-validator';

import ThoughtController from './controllers/ThoughtController';
import UserController from './controllers/UserController';

const router = Router();

router.get('/thoughts', ThoughtController.get);
router.get('/thoughts/:id', ThoughtController.getById);
router.post('/thoughts', ThoughtController.create);
router.put('/thoughts', ThoughtController.update);
router.delete('/thoughts/:id', ThoughtController.delete);

const validationParameters = [
  check('email', 'Incorrect email').isEmail(),
  check('password', 'Password must be longer than 3 and shorter than 12 symbols').isLength({ min: 3, max: 12 }),
];

router.get('/users', UserController.get);
router.get('/users/:id', UserController.getById);
router.post('/registration', validationParameters, UserController.create);
router.post('/login', UserController.login);
router.put('/users', UserController.update);
router.delete('/users/:id', UserController.delete);

export default router;
