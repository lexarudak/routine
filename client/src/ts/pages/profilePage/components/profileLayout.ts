import ButtonClasses from '../../../base/enums/buttonClasses';
import ButtonNames from '../../../base/enums/buttonNames';
import RoutsList from '../../../base/enums/routsList';
import { GoToFn } from '../../../base/types';

class PlanLayout {
  public makeHomeButton(callback: GoToFn) {
    const btn = document.createElement('button');
    btn.innerText = ButtonNames.home;
    btn.classList.add(ButtonClasses.navButton);
    btn.addEventListener('click', () => callback(RoutsList.homePage));
    return btn;
  }

  public makeUserData() {
    const container = document.createElement('div');
    container.classList.add('user-data');

    container.append(this.makeUserGreeting());
    container.append(this.makeUserSettings());

    return container;
  }

  private makeUserGreeting() {
    const container = document.createElement('div');
    container.classList.add('greeting');

    container.innerHTML = `
      <div class="greeting__hello">Hello, Darya!</div>
      <div class="greeting__info">This is your 5 day in this app</div>`;

    return container;
  }

  private makeUserSettings() {
    const container = document.createElement('div');
    container.classList.add('settings');

    container.innerHTML = `
    <div class="settings__confirm-day">
      <span class="settings__label">Confirm day</span>
      <button class="button settings__button">Yesterday</button>
    </div>
    <div class="settings__confirm-time">
      <span class="settings__label">Confirm time</span>
      <input class="button settings__input" type="time"></input>
    </div>
    <button class="button settings__button">Log out</button>`;

    return container;
  }

  public makeStatistics() {
    const container = document.createElement('div');
    container.classList.add('statistics');

    container.append(this.makeStatisticsTank('Fulfilled'));
    container.append(this.makeStatisticsTank('Underfulfilled'));
    container.append(this.makeStatisticsTank('Overfulfilled'));

    return container;
  }

  private makeStatisticsTank(name: string) {
    const container = document.createElement('div');
    container.classList.add('statistics-tank');

    let element: HTMLElement;

    element = document.createElement('div');
    element.classList.add('statistics-tank__name');
    element.textContent = name;
    container.append(element);

    element = document.createElement('div');
    element.classList.add('statistics-tank__content', name.toLowerCase());
    for (let i = 0; i < 8; i += 1) {
      element.append(this.makeStatisticsPlan());
    }
    container.append(element);

    return container;
  }

  private makeStatisticsPlan() {
    const container = document.createElement('div');
    container.classList.add('plan-square');

    container.innerHTML = `
      <div class="plan-square__name">English</div>
      <div class="plan-square__deviation">-5 min/d</div>`;

    return container;
  }
}

export default PlanLayout;
