import Thought from '../schemas/Thought';
import { ClientError } from '../errors';
import * as Type from '../types';
import { Types } from 'mongoose';

class ThoughtService {
  async get(userId: Types.ObjectId) {
    return await Thought.find({ userId: userId });
  }

  async getById(userId: Types.ObjectId, id: string) {
    if (!id) {
      throw new ClientError('ID not specified');
    }
    return await Thought.findById(id).where({ userId: userId });
  }

  async create(userId: Types.ObjectId, item: Type.TThought) {
    const clone = Object.assign({}, item);
    clone.userId = userId;
    return await Thought.create(clone);
  }

  async update(userId: Types.ObjectId, item: Type.TDBThought) {
    if (!item._id) {
      throw new ClientError('ID not specified');
    }
    const itemForUpdate = {
      title: item.title,
    };
    return await Thought.findByIdAndUpdate(item._id, itemForUpdate, { new: true }).where({ userId: userId });
  }

  async delete(userId: Types.ObjectId, id: string) {
    if (!id) {
      throw new ClientError('ID not specified');
    }
    return await Thought.findByIdAndDelete(id).where({ userId: userId });
  }
}

export default new ThoughtService();
