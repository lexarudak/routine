import Path from './base/enums/path';
import { LoginData, NewPlanData, PlanData, PlanToDay, RegistrationData, User, Statistics } from './base/interface';

class Api {
  public static async registration(registrationData: RegistrationData) {
    console.log(this.name);
    return this.post(registrationData, Path.users, Path.registration);
  }

  public static async login(loginData: LoginData) {
    return this.post(loginData, Path.users, Path.login);
  }

  public static async logout() {
    return this.post(null, Path.logout);
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

  public static async createNewPlan(userData: NewPlanData) {
    return this.post(userData, Path.plans);
  }

  public static async editPlan(userData: PlanData) {
    return this.post(userData, Path.plans, Path.update);
  }

  public static async pushPlanToDay(userData: PlanToDay) {
    console.log(userData);
    return this.post(userData, Path.weekDistribution, Path.adjustPlan);
  }

  public static async getUserProfile(): Promise<User> {
    return this.get(false, Path.users, Path.profile);
  }

  public static async getStatistics(): Promise<Statistics[]> {
    return this.get(false, Path.statistics, Path.get);
  }

  public static async getDayDistribution(id: string) {
    return this.get(id, Path.dayDistribution, Path.get);
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

  private static async post(
    userData: RegistrationData | LoginData | NewPlanData | PlanData | PlanToDay | null,
    ...path: Path[]
  ) {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
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
