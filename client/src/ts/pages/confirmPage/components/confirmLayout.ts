import Layout from '../../layout';

import { ClassList } from '../../../base/enums/classList';

import { Plan } from '../../../base/interface';
import * as helpers from '../../../base/helpers';
import * as enums from '../../../base/enums/enums';
import ButtonClasses from '../../../base/enums/buttonClasses';

class ConfirmLayout extends Layout {
  public makeHeader() {
    const container = document.createElement('div');
    container.classList.add('confirm-header');
    container.innerHTML = `
      <h1 class="${ClassList.title} confirm-header__greeting">Confirm day</h1>
      <p class="confirm-header__info">Drag the edge to change the time</p>`;

    return container;
  }

  private getDayOfWeekName(dayOfWeek: number) {
    const daysOfWeek = [
      enums.DaysOfWeek.monday,
      enums.DaysOfWeek.tuesday,
      enums.DaysOfWeek.wednesday,
      enums.DaysOfWeek.thursday,
      enums.DaysOfWeek.friday,
      enums.DaysOfWeek.saturday,
      enums.DaysOfWeek.sunday,
    ];
    return daysOfWeek[dayOfWeek];
  }

  public makeConfirmContent(dayPlans: Plan[], dayOfWeek: number) {
    const container = document.createElement('div');
    container.classList.add('confirm-content');

    const title = helpers.createNewElement('h2', ClassList.subtitle);
    title.innerHTML = this.getDayOfWeekName(dayOfWeek);

    container.append(title, this.makeConfirmPlans(dayPlans), this.makeConfirmButton());

    return container;
  }

  private makeConfirmPlans(dayPlans: Plan[]) {
    const container = document.createElement('div');
    container.classList.add('confirm-plans');

    dayPlans.forEach((plan) => container.append(this.makeConfirmPlan(plan)));

    return container;
  }

  private makeConfirmPlan(plan: Plan) {
    const container = document.createElement('div');
    container.classList.add('confirm-plan');
    container.dataset.id = plan[enums.DBAttributes.id];

    const title = helpers.cutStringLine(plan.title, 20);
    const [bgColor] = helpers.getColors(plan.color);

    container.innerHTML = `
      <span class="confirm-plan__label">${title}</span>
      <div class="plan-square confirm-plan__line" style="background-color: ${bgColor};">
        <div class="confirm-plan__arrows">
          <img class="confirm-plan__arrow confirm-plan__arrow_left" src="./assets/svg/arrow-left.svg" alt="Left">
          <img class="confirm-plan__arrow confirm-plan__arrow_right" src="./assets/svg/arrow-right.svg" alt="Right">
        </div>
      </div>
      <span class="confirm-plan__time">${helpers.minToHour(plan.duration)}</span>`;

    return container;
  }

  private makeConfirmButton() {
    const container = helpers.createNewElement('button', ButtonClasses.button);
    container.classList.add('confirm__main-button');
    container.innerHTML = 'Confirm!';

    return container;
  }

  public makeConfirmationBanner(yes: () => void, cancel: () => void) {
    const uiBanner = document.createElement('div');
    uiBanner.classList.add(ClassList.banner, 'banner_warning');

    const uiQuestion = document.createElement('h2');
    uiQuestion.classList.add('banner__title');
    uiQuestion.innerText = 'This day is confirmed\nConfirm it again?';
    uiBanner.append(uiQuestion);

    const uiButtons = document.createElement('div');
    uiButtons.classList.add('banner__buttons');

    const uiYes = document.createElement('button');
    uiYes.classList.add('button', 'banner__button');
    uiYes.innerHTML = 'Yes';
    uiYes.addEventListener('click', () => yes());
    uiButtons.append(uiYes);

    const uiCancel = document.createElement('button');
    uiCancel.classList.add('button', 'banner__button');
    uiCancel.innerHTML = 'Cancel';
    uiCancel.addEventListener('click', () => cancel());
    uiButtons.append(uiCancel);

    uiBanner.append(uiButtons);
    return uiBanner;
  }
}

export default ConfirmLayout;
