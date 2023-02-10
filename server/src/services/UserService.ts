import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../schemas/User';
import Service from './Service';

import config from '../common/config';
import { ClientError } from '../common/errors';
import * as Type from '../common/types';
import * as Enum from '../common/enums';

class UserService extends Service {
  async get() {
    return await User.find();
  }

  async getById(id: Types.ObjectId) {
    this.checkId(id);
    return await User.findById(id);
  }

  async create(user: Type.TUser) {
    const candidate = await User.findOne({ email: user.email });
    if (candidate) {
      throw new ClientError(`User with email ${user.email} already exist`);
    }

    const hashPassword = await bcrypt.hash(user.password, 10);

    const clone = Object.assign({}, user);
    clone.password = hashPassword;
    clone.confirmationDay = Enum.Constants.defaultConfirmationDay;
    clone.confirmationTime = Enum.Constants.defaultConfirmationTime;
    clone.createdAt = new Date();

    return await User.create(clone);
  }

  async login(login: Type.TLogin) {
    const userDB = await User.findOne({ email: login.email });
    if (!userDB) {
      throw new ClientError(`User with email ${login.email} not found`, Enum.StatusCodes.NotFound);
    }

    const isPasswordValid = bcrypt.compareSync(login.password, userDB.password);
    if (!isPasswordValid) {
      throw new ClientError(`Invalid password`);
    }

    const expiresIn = login.remember ? config.get('tokenExpiresInLong') : config.get('tokenExpiresInShort');
    const token = jwt.sign({ id: userDB._id }, config.get('jwtSecretKey'), { expiresIn: expiresIn });
    const userData: Type.TUserData = { token, user: userDB };

    return userData;
  }

  async update(user: Type.TDBUser) {
    this.checkId(user._id);

    const userForUpdate = {
      name: user.name,
      confirmationDay: user.confirmationDay,
      confirmationTime: user.confirmationTime,
    };

    return await User.findByIdAndUpdate(user._id, userForUpdate, { new: true });
  }

  async delete(id: Types.ObjectId) {
    this.checkId(id);
    return await User.findByIdAndDelete(id);
  }
}

export default new UserService();
