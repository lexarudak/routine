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
  duration: number;
}