import { Types } from 'mongoose';

export type TDBUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  confirmationDay: 'today' | 'yesterday';
  confirmationTime: number;
  createdAt: Date;
};

export type TUserSafeData = Omit<TDBUser, 'password'>;

export type TUserData = {
  token: string;
  user: TUserSafeData;
};

export type TLogin = {
  email: string;
  password: string;
  remember: boolean;
};

export type TDBThought = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
};

export type TDBPlan = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  text?: string;
  color?: string;
  duration: number;
};

export type TDBWeekDistribution = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  dayOfWeek: number;
  planId: Types.ObjectId;
  duration: number;
};

export type TDBDayDistribution = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  dayOfWeek: number;
  planId: Types.ObjectId;
  from: number;
  to: number;
};

export type TDayDistributionAdjastPlan = {
  dayOfWeek: number;
  dayDistribution: TDayDistribution[];
};

export type TDistributedPlan = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  text: string;
  color: string;
  from: number;
  to: number;
};

export type TNotDistributedPlan = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  text: string;
  color: string;
  duration: number;
};

export type TDayDistributionData = {
  distributedPlans: TDistributedPlan[];
  notDistributedPlans: TNotDistributedPlan[];
};

export type TDBStatistics = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  deviation: number;
};

export type TStatisticConfirmDay = {
  dayOfWeek: number;
  dayDistribution: TWeekDistribution[];
};

export type TUser = Omit<TDBUser, '_id'>;
export type TThought = Omit<TDBThought, '_id'>;
export type TPlan = Omit<TDBPlan, '_id'>;
export type TWeekDistribution = Omit<TDBWeekDistribution, '_id'>;
export type TDayDistribution = Omit<TDBDayDistribution, '_id'>;
export type TStatistics = Omit<TDBStatistics, '_id'>;
