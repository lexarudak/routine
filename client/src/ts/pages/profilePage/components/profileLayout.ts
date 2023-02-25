import Layout from '../../layout';

import { User, Statistics, UserSettings, ConfirmationDay } from '../../../base/interface';
import { BaseClassList, ProfilePageClassList } from '../../../base/enums/classList';

import {
  cutStringLine,
  getColors,
  getExistentElement,
  getExistentElementByClass,
  getHours,
  getMinutes,
  timeToMin,
} from '../../../base/helpers';
import ConfirmationDays from '../../../base/enums/confirmationDays';
import StatisticsTankNames from '../../../base/enums/statisticsTankNames';

class ProfileLayout extends Layout {
  public makeUserData(profile: User) {
    const container = document.createElement('div');
    container.classList.add(ProfilePageClassList.userData);

    container.append(this.makeUserGreeting(profile));
    container.append(this.makeUserSettings(profile));

    return container;
  }

  public makeStatistics(statistics: Statistics[]) {
    const container = document.createElement('div');
    container.classList.add(ProfilePageClassList.statistics);

    const tanks = this.getStatisticsTanks(statistics);

    container.append(this.makeStatisticsTank(tanks[1], StatisticsTankNames.underfulfilled));
    container.append(this.makeStatisticsTank(tanks[0], StatisticsTankNames.fulfilled));
    container.append(this.makeStatisticsTank(tanks[2], StatisticsTankNames.overfulfilled));

    return container;
  }

  public getUserSettings() {
    let classCSS: string = ProfilePageClassList.greetingUserName;
    const uiUserName = getExistentElementByClass<HTMLInputElement>(classCSS);

    classCSS = `.${ProfilePageClassList.settingsConfirmDay}>.${ProfilePageClassList.button}`;
    const uiConfirmationDay = getExistentElement(classCSS);

    classCSS = `.${ProfilePageClassList.settingsConfirmTime}>.${ProfilePageClassList.button}`;
    const uiConfirmationTime = getExistentElement<HTMLInputElement>(classCSS);

    const settings: UserSettings = {
      name: uiUserName.value,
      confirmationDay: (uiConfirmationDay.textContent || ConfirmationDays.today) as ConfirmationDay,
      confirmationTime: timeToMin(uiConfirmationTime.value),
    };

    return settings;
  }

  private makeUserGreeting(profile: User) {
    const day = this.getDayOfAppUsing(new Date(profile.createdAt));

    const container = document.createElement('div');
    container.classList.add(ProfilePageClassList.greeting);
    container.innerHTML = `
      <h1 class="${ProfilePageClassList.greetingHello} ${BaseClassList.title}">
        Hello, <input class="${ProfilePageClassList.greetingUserName}" type="text" maxlength="30"
          value="${profile.name}" placeholder="Anonymous"></input>
      </h1>
      <p class="${ProfilePageClassList.greetingInfo}">This is your ${day} day in this app</p>`;

    return container;
  }

  private makeUserSettings(profile: User) {
    const confirmationTime = this.getFormattedTime(profile.confirmationTime);

    const container = document.createElement('div');
    container.classList.add('settings');
    container.innerHTML = `
    <div class="${ProfilePageClassList.settingsConfirmDay}">
      <span class="${ProfilePageClassList.settingsLabel}">Confirm day</span>
      <button class="
        ${ProfilePageClassList.button}
        ${ProfilePageClassList.settingsButton}
        ${ProfilePageClassList.settingsButtonCapitalized}">${profile.confirmationDay}</button>
    </div>
    <div class="${ProfilePageClassList.settingsConfirmTime}">
      <span class="${ProfilePageClassList.settingsLabel}">Confirm time</span>
      <input class="
        ${ProfilePageClassList.button}
        ${ProfilePageClassList.settingsInput}" type="time" value="${confirmationTime}"></input>
    </div>
    <div class="${ProfilePageClassList.settingsLogOut}">
      <button class="
        ${ProfilePageClassList.button}
        ${ProfilePageClassList.settingsButton}">Log out</button>
    </div>`;

    return container;
  }

  private makeStatisticsTank(data: Statistics[], name: string) {
    const container = document.createElement('div');
    container.classList.add(ProfilePageClassList.statisticsTank);

    let element: HTMLElement;

    element = document.createElement('div');
    element.classList.add(ProfilePageClassList.statisticsTankName);
    switch (name) {
      case StatisticsTankNames.fulfilled:
        element.classList.add('fulfilled');
        break;
      case StatisticsTankNames.underfulfilled:
        element.classList.add('underfulfilled');
        break;
      case StatisticsTankNames.overfulfilled:
        element.classList.add('overfulfilled');
        break;

      default:
        break;
    }
    element.textContent = name;
    container.append(element);

    element = document.createElement('div');
    element.classList.add(ProfilePageClassList.statisticsTankContent, name.toLowerCase());
    data.forEach((item) => element.append(this.makeStatisticsPlan(item)));
    container.append(element);

    return container;
  }

  private makeStatisticsPlan(statistics: Statistics) {
    const title = cutStringLine(statistics.title, 20);

    const container = document.createElement('div');
    const [bgColor, color] = getColors(statistics.color);
    container.classList.add(ProfilePageClassList.planSquare);
    container.style.backgroundColor = bgColor;
    container.style.color = color;

    container.innerHTML = `
      <div class="${ProfilePageClassList.planSquareName}">${title}</div>
      <div class="${ProfilePageClassList.planSquareDeviation}">${statistics.deviation} min/d</div>`;

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
