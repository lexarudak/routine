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

export interface DistDayPlan {
  _id: string;
  title: string;
  text: string;
  color: string;
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
