import Router from 'express';
import { check } from 'express-validator';

import UserController from './controllers/UserController';
import ThoughtController from './controllers/ThoughtController';
import PlanController from './controllers/PlanController';

const router = Router();

const validationParameters = [
  check('email', 'Incorrect email').isEmail(),
  check('password', 'Password must be longer than 3 and shorter than 12 symbols').isLength({ min: 3, max: 12 }),
];

router.get('/users', UserController.get.bind(UserController));
router.get('/users/:id', UserController.getById.bind(UserController));
router.post('/users/registration', validationParameters, UserController.create.bind(UserController));
router.post('/users/login', UserController.login.bind(UserController));
router.post('/users/update', UserController.update.bind(UserController));
router.delete('/users/:id', UserController.delete.bind(UserController));

router.get('/thoughts', ThoughtController.get.bind(ThoughtController));
router.get('/thoughts/:id', ThoughtController.getById.bind(ThoughtController));
router.post('/thoughts', ThoughtController.create.bind(ThoughtController));
router.put('/thoughts', ThoughtController.update.bind(ThoughtController));
router.delete('/thoughts/:id', ThoughtController.delete.bind(ThoughtController));

router.get('/plans', PlanController.get.bind(PlanController));
router.get('/plans/:id', PlanController.getById.bind(PlanController));
router.post('/plans', PlanController.create.bind(PlanController));
router.post('/plans/update', PlanController.update.bind(PlanController));
router.delete('/plans/:id', PlanController.delete.bind(PlanController));

export default router;
