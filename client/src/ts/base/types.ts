import RoutsList from './enums/routsList';
import { ConfirmationDays } from './enums/enums';
import { Plan } from './interface';

export type GoToFn = (pageName: RoutsList | string) => void;

export type WeekInfo = [Plan[], Plan[][]];

export type PlanDis = {
  [_id: string]: number;
};

export type UserSettings = {
  confirmationDay: ConfirmationDay;
  confirmationTime: number;
};

export type ConfirmationDay = ConfirmationDays.today | ConfirmationDays.yesterday;