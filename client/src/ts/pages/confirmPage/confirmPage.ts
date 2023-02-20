import Page from '../page';
import Api from '../../api';

import ConfirmLayout from './components/confirmLayout';
import PlanEditor from '../planPage/components/planEditor';

import { User, Plan, ConfirmationDay, ConfirmDay, ConfirmDayDistribution } from '../../base/interface';
import { GoToFn } from '../../base/types';
import { ClassList, ConfirmPageClassList } from '../../base/enums/classList';

import Values from '../../base/enums/values';
import PagesList from '../../base/enums/pageList';
import ButtonNames from '../../base/enums/buttonNames';
import RoutsList from '../../base/enums/routsList';

import * as helpers from '../../base/helpers';
import * as enums from '../../base/enums/enums';

class ConfirmPage extends Page {
  layout: ConfirmLayout;
  dayPlans: Plan[] = [];
  dayOfWeek = 0;

  constructor(goTo: GoToFn, editor: PlanEditor) {
    super(PagesList.confirmPage, goTo, editor);
    this.layout = new ConfirmLayout();
  }

  private async setConfirmInfo() {
    let profile: User = {} as User;
    let weekDistribution: Plan[][] = [];

    [profile, weekDistribution] = await Promise.all([Api.getUserProfile(), Api.getWeekDistribution()]);

    this.dayOfWeek = this.getDayOfWeekByConfirmationDay(profile.confirmationDay);
    this.dayPlans = weekDistribution[this.dayOfWeek];
  }

  private setEventLiseners() {
    const uiConfirmButton = helpers.getExistentElement<HTMLButtonElement>('.confirm__main-button');
    uiConfirmButton.addEventListener('click', () => this.confirm());

    const uiPlans = helpers.getExistentElementByClass('confirm-plans');
    uiPlans.addEventListener('mousedown', (event) => this.startMove(event));
  }

  private startMove(eMouseDown: MouseEvent) {
    const target = eMouseDown.target as HTMLElement;
    if (!target.classList.contains('plan-square')) {
      return;
    }

    const rect = target.getBoundingClientRect();
    const [dayPlans] = [this.dayPlans];

    function onMouseMove(eMouseMove: MouseEvent) {
      const minWidth = 15;
      const maxWidth = minWidth + Values.allDayMinutes / 2;

      const uiConfirmPlan = target.closest('.confirm-plan') as HTMLElement;
      const plan = dayPlans.find((item) => item[enums.DBAttributes.id] === uiConfirmPlan.dataset.id) as Plan;

      const offsetCursor = 5;
      const allDuration = dayPlans.reduce((sum, item) => sum + item.duration, 0);
      const maxDuration = Values.allDayMinutes - allDuration + plan.duration;
      const maxPossibleWidth = minWidth + Math.round((maxDuration * (maxWidth - minWidth)) / Values.allDayMinutes);

      let width = eMouseMove.x - rect.x + offsetCursor;
      width = width > maxPossibleWidth ? maxPossibleWidth : width;
      width = width > maxWidth ? maxWidth : width;
      width = width < minWidth ? minWidth : width;
      target.style.width = `${width}px`;

      const duration = Math.round(((width - minWidth) * Values.allDayMinutes) / (maxWidth - minWidth));
      plan.duration = duration > maxDuration ? maxDuration : duration;

      const uiPlanLabel = target.nextElementSibling as HTMLElement;
      uiPlanLabel.textContent = helpers.minToHour(plan.duration);
    }

    function onMouseUp() {
      document.removeEventListener('mousemove', onMouseMove);
      document.onmouseup = null;
    }

    document.addEventListener('mousemove', onMouseMove);
    document.onmouseup = onMouseUp;
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    await this.setConfirmInfo();

    const container = document.createElement('section');
    container.classList.add(ConfirmPageClassList.confirm);

    const wrapper = document.createElement('div');
    wrapper.classList.add(ConfirmPageClassList.confirmWrapper);

    wrapper.append(this.layout.makeHeader(this.dayOfWeek), this.layout.makeConfirmContent(this.dayPlans));
    container.append(this.layout.makeNavButton(ButtonNames.home, RoutsList.homePage, this.goTo), wrapper);
    return container;
  }

  public async draw() {
    try {
      const container = helpers.getExistentElementByClass(ClassList.mainContainer);
      await this.animatedFilledPageAppend(container);
      this.layout.setPageElementsParameters(this.dayPlans);
      this.setEventLiseners();
    } catch (error) {
      helpers.loginRedirect(error, this.goTo);
    }
  }

  private async confirm() {
    const body: ConfirmDay = {
      dayOfWeek: this.dayOfWeek,
      dayDistribution: [],
    };

    this.dayPlans.forEach((plan) => {
      const item: ConfirmDayDistribution = {
        planId: plan[enums.DBAttributes.id],
        duration: plan.duration,
      };
      body.dayDistribution.push(item);
    });

    await Api.confirmDay(body);
  }

  private getDayOfWeekByConfirmationDay(confirmationDay: ConfirmationDay) {
    const dayOfWeek = this.getPreviousDayOfWeek(new Date().getDay());
    return confirmationDay === enums.ConfirmationDays.today ? dayOfWeek : this.getPreviousDayOfWeek(dayOfWeek);
  }

  private getPreviousDayOfWeek(dayOfWeek: number) {
    return dayOfWeek - 1 < 0 ? 6 : dayOfWeek - 1;
  }
}

export default ConfirmPage;
