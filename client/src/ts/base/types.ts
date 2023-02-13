import RoutsList from './enums/routsList';
import { Plan } from './interface';

export type GoToFn = (pageName: RoutsList | string) => void;

export type WeekInfo = [Plan[], Plan[][]];

export type PlanDis = {
  [_id: string]: number;
};
