export type TThought = {
  _id: string;
  title: string;
};

export type TUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

export type TLogin = {
  email: string;
  password: string;
};

export type TUserData = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
