import { Types } from 'mongoose';

import { ClientError } from '../common/errors';
import * as Enum from '../common/enums';

export default class Service {
  protected checkId(id: Types.ObjectId) {
    if (!id) {
      throw new ClientError(Enum.ErrorMessages.e2001);
    }
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
    if (from < 0 || from > 1440) {
      throw new ClientError(`${Enum.ErrorMessages.e2002} "from"`);
    }
    if (to < 0 || to > 1440) {
      throw new ClientError(`${Enum.ErrorMessages.e2002} "to"`);
    }
    if (from > to) {
      throw new ClientError(Enum.ErrorMessages.e2003);
    }
  }
}
