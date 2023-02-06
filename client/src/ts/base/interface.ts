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
