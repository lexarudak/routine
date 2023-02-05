import Router from 'express';
import { check } from 'express-validator';

import ThoughtController from './controllers/ThoughtController';
import UserController from './controllers/UserController';

const router = Router();

router.get('/thoughts', ThoughtController.get.bind(ThoughtController));
router.get('/thoughts/:id', ThoughtController.getById.bind(ThoughtController));
router.post('/thoughts', ThoughtController.create.bind(ThoughtController));
router.put('/thoughts', ThoughtController.update.bind(ThoughtController));
router.delete('/thoughts/:id', ThoughtController.delete.bind(ThoughtController));

const validationParameters = [
  check('email', 'Incorrect email').isEmail(),
  check('password', 'Password must be longer than 3 and shorter than 12 symbols').isLength({ min: 3, max: 12 }),
];

router.get('/users', UserController.get.bind(UserController));
router.get('/users/:id', UserController.getById.bind(UserController));
router.post('/registration', validationParameters, UserController.create.bind(UserController));
router.post('/login', UserController.login.bind(UserController));
router.put('/users', UserController.update.bind(UserController));
router.delete('/users/:id', UserController.delete.bind(UserController));

export default router;
