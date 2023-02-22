import { ConfirmationDays } from './enums/enums';

export interface Plan {
  _id: string;
  color: string;
  title: string;
  text: string;
  duration: number;
}

export interface RegistrationData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
  remember: boolean;
}

export type NewPlanData = Pick<PlanData, 'title' | 'text' | 'color' | 'duration'>;

export interface PlanData {
  _id: string;
  title: string;
  text: string;
  color: string;
  duration?: number;
}

export interface PlanToDay {
  dayOfWeek: number;
  planId: string;
  duration: number;
}
export interface DistDayPlan {
  _id: string;
  title: string;
  text: string;
  color: string;
  from: number;
  to: number;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  confirmationDay: ConfirmationDay;
  confirmationTime: number;
  createdAt: Date;
}

export interface Statistics {
  title: string;
  text: string;
  color: string;
  deviation: number;
}

export interface ConfirmDay {
  dayOfWeek: number;
  dayDistribution: ConfirmDayDistribution[];
}

export interface ThoughtsData {
  _id?: string;
  title: string;
}

export interface DistPlan {
  planId: string;
  from: number;
  to: number;
}

export type UserSettings = {
  confirmationDay: ConfirmationDay;
  confirmationTime: number;
};

export type ConfirmationDay = ConfirmationDays.today | ConfirmationDays.yesterday;

export type ConfirmDayDistribution = {
  planId: string;
  duration: number;
};

export interface DayDist {
  dayOfWeek: number;
  dayDistribution: DistPlan[];
}

export interface ChartData {
  id: number;
  _id: string;
  hours: number;
  from: number;
  to: number;
  color: string;
  title: string;
  text: string;
}

export interface ThoughtData {
  title: string;
}

export interface ChartConfig {
  strokeWidth: number;
  radius: number;
}

export interface ChartSector {
  id: number;
  hours: number;
  color: string;
  width: number;
  offset: number;
}

export interface SvgAttrs {
  id?: number;
  viewBox?: string;
  fill?: string;
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  r?: number;
  'stroke-dasharray'?: string;
  'stroke-dashoffset'?: string;
  stroke?: string;
  'stroke-width'?: number;
}

export interface ObjNum {
  [id: string]: number;
}
