import Path from './base/enums/path';
import {
  LoginData,
  NewPlanData,
  PlanData,
  PlanToDay,
  RegistrationData,
  User,
  Statistics,
  DayDist,
  ThoughtsData,
} from './base/interface';
import { UserSettings } from './base/types';

class Api {
  public static async registration(body: RegistrationData) {
    console.log(this.name);
    return this.post(body, Path.users, Path.registration);
  }

  public static async login(body: LoginData) {
    return this.post(body, Path.users, Path.login);
  }

  public static async logout() {
    const body: Record<string, never> = {};
    return this.post(body, Path.users, Path.logout);
  }

  public static async getWeekDistribution() {
    return this.get(false, Path.weekDistribution, Path.get);
  }

  public static async deletePlan(id: string) {
    return this.delete(id, Path.plans);
  }

  public static async getAllPlans() {
    return this.get(false, Path.plans);
  }

  public static async createNewPlan(body: NewPlanData) {
    return this.post(body, Path.plans);
  }

  public static async editPlan(body: PlanData) {
    return this.post(body, Path.plans, Path.update);
  }

  public static async pushPlanToDay(body: PlanToDay) {
    console.log(body);
    return this.post(body, Path.weekDistribution, Path.adjustPlan);
  }

  public static async getUserProfile(): Promise<User> {
    return this.get(false, Path.users, Path.profile);
  }

  public static async saveUserSettings(body: UserSettings): Promise<User> {
    return this.post(body, Path.users, Path.update);
  }

  public static async getStatistics(): Promise<Statistics[]> {
    return this.get(false, Path.statistics, Path.get);
  }

  public static async getDayDistribution(id: string) {
    return this.get(id, Path.dayDistribution, Path.get);
  }

  public static async pushDayDistribution(body: DayDist) {
    return this.post(body, Path.dayDistribution, Path.adjustPlan);
  }

  public static async getThoughts() {
    return this.get(false, Path.thoughts);
  }

  public static async createThoughts(thoughtData: ThoughtsData) {
    return this.post(thoughtData, Path.thoughts);
  }

  public static async updateThought(thoughtData: ThoughtsData) {
    return this.post(thoughtData, Path.thoughts, Path.update);
  }

  public static async deleteThought(id: string) {
    return this.delete(id, Path.thoughts);
  }

  private static async get(id: string | false, ...path: Path[]) {
    let url = `${Path.origin}${path.join('')}`;
    if (id) url = `${url}/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(response.status.toString());
    }

    return data;
  }

  private static async post<T>(body: T, ...path: Path[]) {
    console.log(body, path);
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    };

    const response = await fetch(`${Path.origin}${path.join('')}`, options);
    const data = await response.json();

    console.log(response.ok);
    if (!response.ok) {
      throw new Error(response.status.toString());
    }

    return data;
  }

  private static async delete(id: string, ...path: Path[]) {
    const response = await fetch(`${Path.origin}${path.join('')}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const data = await response.json();
    console.log(data);
    if (!response.ok) throw new Error(response.status.toString());
    return data;
  }
}

export default Api;
