import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../schemas/User';
import Service from './Service';

import ThoughtService from './DayDistributionService';
import PlanService from './DayDistributionService';
import DayDistributionService from './DayDistributionService';
import WeekDistributionService from './WeekDistributionService';
import StatisticsService from './StatisticsService';

import config from '../common/config';
import { ClientError } from '../common/errors';
import * as Type from '../common/types';
import * as Enum from '../common/enums';

class UserService extends Service<Type.TUser> {
  protected model = User;

  async get() {
    return await this.model.find();
  }

  async getById(id: Types.ObjectId) {
    return await this.model.findById(id) as Type.TDBUser;
  }

  async create(item: Type.TUser) {
    const candidate = await this.model.findOne({ email: item.email });
    if (candidate) {
      throw new ClientError(`User with email ${item.email} already exist`);
    }

    const hashPassword = await bcrypt.hash(item.password, 10);

    const itemForCreate = Object.assign({}, item);
    itemForCreate.password = hashPassword;
    itemForCreate.confirmationDay = Enum.Constants.defaultConfirmationDay;
    itemForCreate.confirmationTime = Enum.Constants.defaultConfirmationTime;
    itemForCreate.createdAt = new Date();

    return await this.model.create(itemForCreate);
  }

  async login(login: Type.TLogin) {
    const userDB = await this.model.findOne({ email: login.email });
    if (!userDB) {
      throw new ClientError(`User with email ${login.email} not found`, Enum.StatusCodes.NotFound);
    }

    const isPasswordValid = bcrypt.compareSync(login.password, userDB.password);
    if (!isPasswordValid) {
      throw new ClientError(Enum.ErrorMessages.e1001);
    }

    const expiresIn = login.remember ? config.get('tokenExpiresInLong') : config.get('tokenExpiresInShort');
    const token = jwt.sign({ id: userDB._id }, config.get('jwtSecretKey'), { expiresIn: expiresIn });
    const userData: Type.TUserData = { token, user: userDB };

    return userData;
  }

  async update(userId: Types.ObjectId, item: Type.TDBUser) {
    const itemForUpdate: Partial<Type.TDBUser> = {
      name: item.name,
      confirmationDay: item.confirmationDay,
      confirmationTime: item.confirmationTime,
    };
    return await this.model.findByIdAndUpdate(userId, itemForUpdate, { new: true }) as Type.TDBUser;
  }

  async delete(id: Types.ObjectId) {
    const services = [ThoughtService, PlanService, StatisticsService, DayDistributionService, WeekDistributionService];
    await Promise.all(services.map((service) => service.deleteByParameters({ userId: id })));
    return await this.model.findByIdAndDelete(id);
  }
}

export default new UserService();
