import { Request, Response } from 'express';
import { Types } from 'mongoose';

import Controller from './Controller';
import ThoughtService from '../services/ThoughtService';

import * as Type from '../common/types';

class ThoughtController extends Controller {
  async get(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await ThoughtService.get(userId);
    this.handleWithAuthorization<Type.TDBThought[]>(req, res, process);
  }

  async getById(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await ThoughtService.getById(userId, new Types.ObjectId(req.params.id));
    this.handleWithAuthorization<Type.TDBThought>(req, res, process);
  }

  async create(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await ThoughtService.create(userId, req.body);
    this.handleWithAuthorization<Type.TDBThought>(req, res, process);
  }

  async update(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await ThoughtService.update(userId, req.body);
    this.handleWithAuthorization<Type.TDBThought>(req, res, process);
  }

  async convertToPlan(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await ThoughtService.convertToPlan(userId, new Types.ObjectId(req.params.id), req.body);
    this.handleWithAuthorization<Type.TDBThought | null>(req, res, process);
  }

  async delete(req: Request, res: Response) {
    const process = async (userId: Types.ObjectId) => await ThoughtService.delete(userId, new Types.ObjectId(req.params.id));
    this.handleWithAuthorization<Type.TDBThought>(req, res, process);
  }
}

export default new ThoughtController();
