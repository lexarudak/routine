import { Types } from 'mongoose';

// -------------------------------------------------------
// Common
// -------------------------------------------------------

export type TDBId = {
  _id: Types.ObjectId;
};

export type TDuration = {
  duration: number;
};
export type TDeviation = {
  deviation: number;
};

export type TPeriod = {
  from: number;
  to: number;
};

// -------------------------------------------------------
// User
// -------------------------------------------------------

export type TUser = {
  name: string;
  email: string;
  password: string;
  confirmationDay: 'today' | 'yesterday';
  confirmationTime: number;
  createdAt: Date;
};

export type TDBUser = TDBId & TUser;
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

// -------------------------------------------------------
// Thought
// -------------------------------------------------------

export type TThought = {
  userId: Types.ObjectId;
  title: string;
};

export type TDBThought = TDBId & TThought;

// -------------------------------------------------------
// Plan
// -------------------------------------------------------

export type TPlan = {
  userId: Types.ObjectId;
  title: string;
  text: string;
  color: string;
  duration: number;
};

export type TDBPlan = TDBId & TPlan;

// -------------------------------------------------------
// Week distribution
// -------------------------------------------------------

export type TWeekDistribution = {
  userId: Types.ObjectId;
  dayOfWeek: number;
  planId: Types.ObjectId;
  duration: number;
};

export type TDBWeekDistribution = TDBId & TWeekDistribution;

// -------------------------------------------------------
// Day distribution
// -------------------------------------------------------

export type TDayDistribution = {
  userId: Types.ObjectId;
  dayOfWeek: number;
  planId: Types.ObjectId;
  from: number;
  to: number;
};

export type TDBDayDistribution = TDBId & TDayDistribution;

export type TDayDistributionAdjastPlan = {
  dayOfWeek: number;
  dayDistribution: TDayDistribution[];
};

export type TDistributedPlan = Omit<TDBPlan, 'duration'> & TPeriod;
export type TNotDistributedPlan = TDBPlan;

export type TDayDistributionData = {
  distributedPlans: TDistributedPlan[];
  notDistributedPlans: TNotDistributedPlan[];
};

// -------------------------------------------------------
// Statistics
// -------------------------------------------------------

export type TStatistics = {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  deviation: number;
};

export type TDBStatistics = TDBId & TStatistics;

export type TStatisticsConfirmDay = {
  dayOfWeek: number;
  dayDistribution: TWeekDistribution[];
};

export type TStatisticsDataItem = Omit<TDBPlan, 'duration'> & TDeviation;
export type TStatisticsData = TStatisticsDataItem[];
