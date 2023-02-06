import { Types } from 'mongoose';

export type TDBUser = {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
};

export type TUser = Omit<TDBUser, '_id'>;

export type TUserData = {
  token: string;
  user: Omit<TDBUser, 'password'>;
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

export type TThought = Omit<TDBThought, '_id'>;

export type TDBPlan = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  title: string;
  text: string;
  color: string;
  duration: number;
};

export type TPlan = Omit<TDBPlan, '_id'>;
