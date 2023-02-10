import { Types } from 'mongoose';
import { ClientError } from '../common/errors';

export default class Service {
  protected checkId(id: Types.ObjectId) {
    if (!id) {
      throw new ClientError('ID not specified');
    }
  }

  protected checkDayOfWeek(dayOfWeek: number) {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new ClientError(`Incorrect value of parameter "day of week"`);
    }
  }

  protected checkDuration(duration: number) {
    if (duration < 0) {
      throw new ClientError(`Incorrect value of parameter "duration"`);
    }
  }

  protected checkPeriod(from: number, to: number) {
    if (from < 0 || from > 1440) {
      throw new ClientError(`Incorrect value of parameter "from"`);
    }
    if (to < 0 || to > 1440) {
      throw new ClientError(`Incorrect value of parameter "to"`);
    }
    if (from > to) {
      throw new ClientError(`Incorrect value of period`);
    }
  }
}
