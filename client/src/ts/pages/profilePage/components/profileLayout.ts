import Layout from '../../layout';

import { User, Statistics } from '../../../base/interface';
import { getHours, getMinutes, timeToMin } from '../../../base/helpers';
import { UserSettings } from '../../../base/types';
import * as helpers from '../../../base/helpers';

class ProfileLayout extends Layout {
  public makeUserData(profile: User) {
    const container = document.createElement('div');
    container.classList.add('user-data');

    container.append(this.makeUserGreeting(profile));
    container.append(this.makeUserSettings(profile));

    return container;
  }

  public makeStatistics(statistics: Statistics[]) {
    const container = document.createElement('div');
    container.classList.add('statistics');

    const tanks = this.getStatisticsTanks(statistics);

    container.append(this.makeStatisticsTank('Fulfilled', tanks[0]));
    container.append(this.makeStatisticsTank('Underfulfilled', tanks[1]));
    container.append(this.makeStatisticsTank('Overfulfilled', tanks[2]));

    return container;
  }

  public getUserSettings() {
    const uiConfirmationDay = helpers.getExistentElementByClass('settings__confirm-day>.button');
    const uiConfirmationTime = helpers.getExistentElementByClass<HTMLInputElement>('settings__confirm-time>.button');

    const settings: UserSettings = {
      confirmationDay: uiConfirmationDay.textContent || 'today',
      confirmationTime: timeToMin(uiConfirmationTime.value),
    };

    return settings;
  }

  private makeUserGreeting(profile: User) {
    const container = document.createElement('div');
    container.classList.add('greeting');

    const day = this.getDayOfAppUsing(new Date(profile.createdAt));

    container.innerHTML = `
      <div class="greeting__hello">Hello, ${profile.name}!</div>
      <div class="greeting__info">This is your ${day} day in this app</div>`;

    return container;
  }

  private makeUserSettings(profile: User) {
    const container = document.createElement('div');
    container.classList.add('settings');

    const confirmationTime = this.getFormattedTime(profile.confirmationTime);

    container.innerHTML = `
    <div class="settings__confirm-day">
      <span class="settings__label">Confirm day</span>
      <button class="button settings__button settings__button_capitalized">${profile.confirmationDay}</button>
    </div>
    <div class="settings__confirm-time">
      <span class="settings__label">Confirm time</span>
      <input class="button settings__input" type="time" value="${confirmationTime}"></input>
    </div>
    <div class="settings__log-out">
      <button class="button settings__button">Log out</button>
    </div>`;

    return container;
  }

  private makeStatisticsTank(name: string, data: Statistics[]) {
    const container = document.createElement('div');
    container.classList.add('statistics-tank');

    let element: HTMLElement;

    element = document.createElement('div');
    element.classList.add('statistics-tank__name');
    element.textContent = name;
    container.append(element);

    element = document.createElement('div');
    element.classList.add('statistics-tank__content', name.toLowerCase());
    data.forEach((item) => element.append(this.makeStatisticsPlan(item)));
    container.append(element);

    return container;
  }

  private makeStatisticsPlan(statistics: Statistics) {
    const container = document.createElement('div');
    container.classList.add('plan-square');
    container.style.backgroundColor = statistics.color;

    container.innerHTML = `
      <div class="plan-square__name">${statistics.title}</div>
      <div class="plan-square__deviation">${statistics.deviation} min/d</div>`;

    return container;
  }

  private getDayOfAppUsing(startDate: Date) {
    return Math.ceil((Date.now() - startDate.getTime()) / 1000 / 3600 / 24);
  }

  private getStatisticsTanks(statistics: Statistics[]) {
    const tanks: [Statistics[], Statistics[], Statistics[]] = [[], [], []];

    return statistics.reduce((agr, item) => {
      switch (true) {
        case item.deviation > 15:
          agr[2].push(item);
          return agr;
        case item.deviation < -15:
          agr[1].push(item);
          return agr;
        default:
          agr[0].push(item);
          return agr;
      }
    }, tanks);
  }

  private getFormattedTime(time: number) {
    return `${getHours(time).toString().padStart(2, '0')}:${getMinutes(time)}`;
  }
}

export default ProfileLayout;
