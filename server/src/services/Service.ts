import { Model } from 'mongoose';

import { ClientError } from '../common/errors';
import * as Enum from '../common/enums';

export default abstract class Service<T> {
  protected abstract model: Model<T>;

  public async getByParameters(parameters: Partial<T>) {
    return await this.model.find(parameters);
  }

  public async deleteByParameters(parameters: Partial<T>) {
    await this.model.deleteMany(parameters);
  }

  protected checkDayOfWeek(dayOfWeek: number) {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new ClientError(`${Enum.ErrorMessages.e2002} "day of week"`);
    }
  }

  protected checkDuration(duration: number) {
    if (duration < 0) {
      throw new ClientError(`${Enum.ErrorMessages.e2002} "duration"`);
    }
  }

  protected checkPeriod(from: number, to: number) {
    switch (true) {
      case from < 0 || from > 1440:
        throw new ClientError(`${Enum.ErrorMessages.e2002} "from"`);
      case to < 0 || to > 1440:
        throw new ClientError(`${Enum.ErrorMessages.e2002} "to"`);
      case from > to:
        throw new ClientError(Enum.ErrorMessages.e2003);
      default:
        break;
    }
  }
}
