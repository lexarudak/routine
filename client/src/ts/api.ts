import Path from './base/enums/path';
import { LoginData, RegistrationData } from './base/interface';

class Api {
  public static async registration(registrationData: RegistrationData) {
    return this.userEnter(registrationData, Path.registration);
  }

  public static async login(loginData: LoginData) {
    return this.userEnter(loginData, Path.login);
  }

  public static async getAllPlans() {
    return this.getValue(Path.allPlans);
  }

  private static async getValue(path: Path) {
    const response = await fetch(`${Path.origin}${path}`, {
      method: 'GET',
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(response.status.toString());
    }

    return data;
  }

  private static async userEnter(userData: RegistrationData | LoginData, path: Path) {
    const options: RequestInit = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    };

    const response = await fetch(`${Path.origin}${path}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(response.status.toString());
    }

    return data;
  }
}

export default Api;
