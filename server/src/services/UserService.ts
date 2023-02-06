import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config';
import { ClientError } from '../errors';
import User from '../schemas/User';
import * as Type from '../types';

class UserService {
  async get() {
    return await User.find();
  }

  async getById(id: string) {
    if (!id) {
      throw new ClientError('ID not specified');
    }
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

    return await User.create(clone);
  }

  async login(login: Type.TLogin) {
    const userDB = await User.findOne({ email: login.email });
    if (!userDB) {
      throw new ClientError(`User with email ${login.email} not found`, 404);
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
    if (!user._id) {
      throw new ClientError('ID not specified');
    }
    const userForUpdate = {
      name: user.name,
    };
    return await User.findByIdAndUpdate(user._id, userForUpdate, { new: true });
  }

  async delete(id: string) {
    if (!id) {
      throw new ClientError('ID not specified');
    }
    return await User.findByIdAndDelete(id);
  }
}

export default new UserService();
