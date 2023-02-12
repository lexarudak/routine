import RoutsList from './enums/routsList';
import { Plan, User, Statistics } from './interface';

export type GoToFn = (pageName: RoutsList | string) => void;

export type WeekInfo = [Plan[], Plan[][]];

export type PlanDis = {
  [_id: string]: number;
};

export type ProfileInfo = [User, Statistics[]];