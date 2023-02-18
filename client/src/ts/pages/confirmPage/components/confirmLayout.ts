import Layout from '../../layout';

import { User, Plan } from '../../../base/interface';
import { ConfirmationDay } from '../../../base/types';
import Values from '../../../base/enums/values';

import * as helpers from '../../../base/helpers';
import * as enums from '../../../base/enums/enums';

class ConfirmLayout extends Layout {
  public makeHeader(profile: User) {
    const dayOfWeek = this.getDayOfWeekByConfirmationDay(profile.confirmationDay);
    const dayOfWeekName = this.getDayOfWeekName(dayOfWeek);

    const container = document.createElement('div');
    container.classList.add('confirm-header');
    container.innerHTML = `
      <div class="confirm-header__greeting">Confirm day! ${dayOfWeekName}</div>
      <div class="confirm-header__info">Drag the edge to change the time</div>`;

    return container;
  }

  private getDayOfWeekByConfirmationDay(confirmationDay: ConfirmationDay) {
    const date = new Date();
    return confirmationDay === enums.ConfirmationDays.today ? date.getDay() : this.getPreviousDayOfWeek(date.getDay());
  }

  private getPreviousDayOfWeek(dayOfWeek: number) {
    return dayOfWeek - 1 < 0 ? 6 : dayOfWeek - 1;
  }

  private getDayOfWeekName(dayOfWeek: number) {
    const daysOfWeek = [
      enums.DaysOfWeek.sunday,
      enums.DaysOfWeek.monday,
      enums.DaysOfWeek.tuesday,
      enums.DaysOfWeek.wednesday,
      enums.DaysOfWeek.thursday,
      enums.DaysOfWeek.friday,
      enums.DaysOfWeek.saturday,
    ];
    return daysOfWeek[dayOfWeek];
  }

  public makeConfirmContent(profile: User, weekDistribution: Plan[][]) {
    const container = document.createElement('div');
    container.classList.add('confirm-content');

    const dayOfWeek = this.getDayOfWeekByConfirmationDay(profile.confirmationDay);
    const dayPlans = weekDistribution[dayOfWeek];

    container.append(this.makeConfirmPlans(dayPlans));
    container.append(this.makeConfirmButton());

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

    container.innerHTML = `
      <span class="confirm-plan__label">${title}</span>
      <div class="plan-square confirm-plan__line" style="background-color: ${plan.color};">&nbsp</div>
      <span class="confirm-plan__time">${helpers.minToHour(plan.duration)}</span>`;

    return container;
  }

  private makeConfirmButton() {
    const container = document.createElement('div');
    container.classList.add('confirm-buttons');

    container.innerHTML = `<button class="button confirm__main-button">Confirm!</button>`;

    return container;
  }

  public setPageElementsParameters(profile: User, weekDistribution: Plan[][]) {
    const dayOfWeek = this.getDayOfWeekByConfirmationDay(profile.confirmationDay);
    const dayPlans = weekDistribution[dayOfWeek];

    dayPlans.forEach((plan) => {
      const classCSS = `.confirm-plan[data-id="${plan[enums.DBAttributes.id]}"]`;
      const uiConfirmPlan = helpers.getExistentElement<HTMLElement>(classCSS);

      const uiPlanLabel = helpers.getExistentElementByClass('confirm-plan__label', uiConfirmPlan);
      const fullWidth = uiConfirmPlan.offsetWidth - uiPlanLabel.offsetWidth;

      const uiPlanTime = helpers.getExistentElementByClass('confirm-plan__line', uiConfirmPlan);
      uiPlanTime.style.width = `${Math.round((fullWidth * plan.duration) / Values.allDayMinutes)}px`;
    });
  }
}

export default ConfirmLayout;
