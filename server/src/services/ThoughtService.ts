import Thought from "../schemas/Thought";
import { ClientError } from "../errors";
import * as Type from "../types";

class ThoughtService {
  async get() {
    return await Thought.find();
  }

  async getById(id: string) {
    if (!id) {
      throw new ClientError('ID not specified');
    }
    return await Thought.findById(id);
  }

  async create(thought: Type.TThought) {
    return await Thought.create(thought);
  }

  async update(thought: Type.TThought) {
    if (!thought._id) {
      throw new ClientError('ID not specified');
    }
    return await Thought.findByIdAndUpdate(thought._id, thought, { new: true });
  }

  async delete(id: string) {
    if (!id) {
      throw new ClientError('ID not specified');
    }
    return await Thought.findByIdAndDelete(id);
  }
}

export default new ThoughtService();