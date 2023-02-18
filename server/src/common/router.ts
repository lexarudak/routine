import Router from 'express';
import { check } from 'express-validator';

import UserController from '../controllers/UserController';
import ThoughtController from '../controllers/ThoughtController';
import PlanController from '../controllers/PlanController';
import WeekDistributionController from '../controllers/WeekDistributionController';
import DayDistributionController from '../controllers/DayDistributionController';
import StatisticsController from '../controllers/StatisticsController';

const router = Router();

const validationParameters = [
  check('email', 'Incorrect email').isEmail(),
  check('password', 'Password must be at least 3 characters long').isLength({ min: 3 }),
];

router.get('/users', UserController.get.bind(UserController));
router.delete('/users/:id', UserController.delete.bind(UserController));

router.get('/users/profile', UserController.profile.bind(UserController));
router.post('/users/registration', validationParameters, UserController.create.bind(UserController));
router.post('/users/login', UserController.login.bind(UserController));
router.post('/users/logout', UserController.logout.bind(UserController));
router.post('/users/update', UserController.update.bind(UserController));

router.get('/thoughts', ThoughtController.get.bind(ThoughtController));
router.get('/thoughts/:id', ThoughtController.getById.bind(ThoughtController));
router.post('/thoughts', ThoughtController.create.bind(ThoughtController));
router.post('/thoughts/update', ThoughtController.update.bind(ThoughtController));
router.post('/thoughts/convertToPlan/:id', ThoughtController.convertToPlan.bind(ThoughtController));
router.delete('/thoughts/:id', ThoughtController.delete.bind(ThoughtController));

router.get('/plans', PlanController.get.bind(PlanController));
router.get('/plans/:id', PlanController.getById.bind(PlanController));
router.post('/plans', PlanController.create.bind(PlanController));
router.post('/plans/update', PlanController.update.bind(PlanController));
router.delete('/plans/:id', PlanController.delete.bind(PlanController));

router.get('/weekDistribution/get', WeekDistributionController.get.bind(WeekDistributionController));
router.post('/weekDistribution/adjustPlan', WeekDistributionController.adjustPlan.bind(WeekDistributionController));

router.get('/dayDistribution/get/:dayOfWeek', DayDistributionController.get.bind(DayDistributionController));
router.post('/dayDistribution/adjustPlan', DayDistributionController.adjustPlan.bind(DayDistributionController));

router.get('/statistics/get', StatisticsController.get.bind(StatisticsController));
router.get('/statistics/isDayConfirmed', StatisticsController.isDayConfirmed.bind(StatisticsController));
router.post('/statistics/confirmDay', StatisticsController.confirmDay.bind(StatisticsController));

export default router;
