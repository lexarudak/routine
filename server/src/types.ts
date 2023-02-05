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

export type TThought = {
  _id: Types.ObjectId;
  title: string;
};
