import Path from './base/enums/path';
import { LoginData, NewPlanData, PlanData, RegistrationData } from './base/interface';

class Api {
  public static async registration(registrationData: RegistrationData) {
    return this.post(registrationData, Path.registration);
  }

  public static async login(loginData: LoginData) {
    return this.post(loginData, Path.login);
  }

  public static async getWeekDistribution() {
    return this.get(Path.weekDistribution);
  }

  public static async deletePlan(id: string) {
    return this.delete(id, Path.plans);
  }

  public static async getAllPlans() {
    return this.get(Path.plans);
  }

  public static async createNewPlan(userData: NewPlanData) {
    console.log('create', userData);
    return this.post(userData, Path.plans);
  }

  public static async editPlan(userData: PlanData) {
    console.log('edit', userData);
    return this.post(userData, Path.plans, Path.update);
  }

  private static async get(path: Path) {
    const response = await fetch(`${Path.origin}${path}`, {
      method: 'GET',
      credentials: 'include',
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(response.status.toString());
    }

    return data;
  }

  private static async post(userData: RegistrationData | LoginData | NewPlanData | PlanData, ...path: Path[]) {
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
