import { Request, Response } from 'express';
import { Types } from 'mongoose';

import Controller from './Controller';
import PlanService from '../services/PlanService';

import * as Type from '../common/types';

class PlanController extends Controller {
  async get(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await PlanService.get(userId);
    this.handleWithAuthorization<Type.TDBPlan[]>(req, res, process);
  }

  async getById(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await PlanService.getById(userId, new Types.ObjectId(req.params.id));
    this.handleWithAuthorization<Type.TDBPlan | null>(req, res, process);
  }

  async create(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await PlanService.create(userId, req.body);
    this.handleWithAuthorization<Type.TDBPlan>(req, res, process);
  }

  async update(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await PlanService.update(userId, req.body);
    this.handleWithAuthorization<Type.TDBPlan>(req, res, process);
  }

  async delete(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await PlanService.delete(userId, new Types.ObjectId(req.params.id));
    this.handleWithAuthorization<Type.TDBPlan>(req, res, process);
  }
}

export default new PlanController();
