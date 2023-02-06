import RoutsList from './enums/routsList';
import { Plan } from './interface';

export type GoToFn = (pageName: RoutsList) => void;

export type WeekInfo = [Plan[], Plan[][]];
