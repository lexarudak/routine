import Page from '../page';
import Api from '../../api';

import Popup from '../../components/popup';
import ConfirmLayout from './components/confirmLayout';
import PlanEditor from '../planPage/components/planEditor';

import { User, Plan, ConfirmationDay, ConfirmDay, ConfirmDayDistribution } from '../../base/interface';
import { GoToFn } from '../../base/types';
import { ClassList, ConfirmPageClassList } from '../../base/enums/classList';

import Values from '../../base/enums/values';
import PagesList from '../../base/enums/pageList';

import * as helpers from '../../base/helpers';
import * as enums from '../../base/enums/enums';
import Header from '../../components/header';
import NavButtons from '../../base/enums/navButtons';

class ConfirmPage extends Page {
  layout: ConfirmLayout;
  dayPlans: Plan[] = [];
  dayOfWeek = 0;
  isDayConfirmed = false;
  header: Header;

  constructor(goTo: GoToFn, editor: PlanEditor) {
    super(PagesList.confirmPage, goTo, editor);
    this.layout = new ConfirmLayout();
    this.header = new Header(goTo);
  }

  private async setConfirmInfo() {
    let profile: User = {} as User;
    let weekDistribution: Plan[][] = [];

    [profile, weekDistribution, this.isDayConfirmed] = await Promise.all([
      Api.getUserProfile(),
      Api.getWeekDistribution(),
      Api.getConfirmDayInfo(),
    ]);

    this.dayOfWeek = this.getDayOfWeekByConfirmationDay(profile.confirmationDay);
    this.dayPlans = weekDistribution[this.dayOfWeek];
  }

  private setEventLiseners() {
    const uiConfirmButton = helpers.getExistentElement<HTMLButtonElement>('.confirm__main-button');
    uiConfirmButton.addEventListener('click', () => this.confirm());

    const uiPlans = helpers.getExistentElementByClass('confirm-plans');
    uiPlans.addEventListener('mousedown', (event) => this.startMove(event));
    uiPlans.addEventListener('click', (event) => this.changeTime(event));
  }

  private startMove(eMouseDown: MouseEvent) {
    const target = eMouseDown.target as HTMLElement;
    if (!target.classList.contains('plan-square')) {
      return;
    }

    const context = this as ConfirmPage;
    const rect = target.getBoundingClientRect();

    function onMouseMove(eMouseMove: MouseEvent) {
      const uiConfirmPlan = target.closest('.confirm-plan') as HTMLElement;
      const plan = context.dayPlans.find((item) => item[enums.DBAttributes.id] === uiConfirmPlan.dataset.id) as Plan;

      const offsetCursor = 5;
      let width = eMouseMove.x - rect.x + offsetCursor;

      width = context.restrictPlanWidth(plan, width);
      target.style.width = `${width}px`;

      plan.duration = context.getDurationByWidth(width);
      plan.duration = context.restrictPlanDuration(plan, plan.duration);

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

  private changeTime(event: MouseEvent) {
    const target = event.target as HTMLElement;

    if (target.classList.contains('confirm-plan__arrow_left')) {
      this.changePlanTime(target, -1);
      return;
    }
    if (target.classList.contains('confirm-plan__arrow_right')) {
      this.changePlanTime(target, +1);
    }
  }

  private getMinMaxWidth() {
    const minWidth = 55;
    const maxWidth = minWidth + Values.allDayMinutes / 2;

    return [minWidth, maxWidth];
  }

  private getPlanMaxDuration(plan: Plan) {
    const allDuration = this.dayPlans.reduce((sum, item) => sum + item.duration, 0);
    return Values.allDayMinutes - allDuration + plan.duration;
  }

  private getWidthByDuration(duration: number) {
    const [minWidth, maxWidth] = this.getMinMaxWidth();
    return Math.round((duration * (maxWidth - minWidth)) / Values.allDayMinutes) + minWidth;
  }

  private restrictPlanWidth(plan: Plan, width: number) {
    let $width = width;

    const [minWidth, maxWidth] = this.getMinMaxWidth();
    const maxDuration = this.getPlanMaxDuration(plan);
    const maxPossibleWidth = minWidth + Math.round((maxDuration * (maxWidth - minWidth)) / Values.allDayMinutes);

    $width = $width > maxPossibleWidth ? maxPossibleWidth : $width;
    $width = $width > maxWidth ? maxWidth : $width;
    $width = $width < minWidth ? minWidth : $width;

    return $width;
  }

  private getDurationByWidth(width: number) {
    const [minWidth, maxWidth] = this.getMinMaxWidth();
    return Math.round(((width - minWidth) * Values.allDayMinutes) / (maxWidth - minWidth));
  }

  private restrictPlanDuration(plan: Plan, duration: number) {
    let $duration = duration;

    const maxDuration = this.getPlanMaxDuration(plan);

    $duration = $duration < 0 ? 0 : $duration;
    $duration = $duration > maxDuration ? maxDuration : $duration;

    return $duration;
  }

  private changePlanTime(arrow: HTMLElement, increment: number) {
    const uiConfirmPlan = arrow.closest('.confirm-plan') as HTMLElement;
    const plan = this.dayPlans.find((item) => item[enums.DBAttributes.id] === uiConfirmPlan.dataset.id) as Plan;

    plan.duration += increment;
    plan.duration = this.restrictPlanDuration(plan, plan.duration);

    let width = this.getWidthByDuration(plan.duration);
    width = this.restrictPlanWidth(plan, width);

    const uiPlanLine = arrow.closest('.confirm-plan__line') as HTMLElement;
    uiPlanLine.style.width = `${width}px`;

    const uiPlanTime = uiPlanLine.nextElementSibling as HTMLElement;
    uiPlanTime.textContent = helpers.minToHour(plan.duration);
  }

  private setPageElementsParameters() {
    this.dayPlans.forEach((plan) => {
      const classCSS = `.confirm-plan[data-id="${plan[enums.DBAttributes.id]}"]`;
      const uiConfirmPlan = helpers.getExistentElement<HTMLElement>(classCSS);

      let width = this.getWidthByDuration(plan.duration);
      width = this.restrictPlanWidth(plan, width);

      const uiPlanLine = helpers.getExistentElementByClass('confirm-plan__line', uiConfirmPlan);
      uiPlanLine.style.width = `${width}px`;
    });
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    await this.setConfirmInfo();

    const container = document.createElement('section');
    container.classList.add(ConfirmPageClassList.confirm);

    const wrapper = document.createElement('div');
    wrapper.classList.add(ConfirmPageClassList.confirmWrapper);

    wrapper.append(this.layout.makeHeader(this.dayOfWeek), this.layout.makeConfirmContent(this.dayPlans));
    container.append(this.header.draw(PagesList.confirmPage, NavButtons.confirm), wrapper);
    return container;
  }

  public async draw() {
    try {
      const container = helpers.getExistentElementByClass(ClassList.mainContainer);
      await this.animatedFilledPageAppend(container);
      this.setPageElementsParameters();
      this.setEventLiseners();
    } catch (error) {
      helpers.loginRedirect(error, this.goTo);
    }
  }

  private confirm() {
    const popup = new Popup();
    popup.editorMode();

    const ok = async () => {
      const uiConfirm = helpers.getExistentElementByClass<HTMLButtonElement>('confirm__main-button');
      helpers.buttonOff(uiConfirm);

      try {
        if (this.isDayConfirmed) {
          popup.easyClose();
        }
        await this.confirmDay();
        this.isDayConfirmed = true;
        this.openPopup(enums.MessageType.success, 'Confirmed!');
      } catch (error) {
        this.openPopup(enums.MessageType.error, 'Ooops! Something went wrong...');
      }

      helpers.buttonOn(uiConfirm);
    };

    if (!this.isDayConfirmed) {
      ok();
    } else {
      const banner = this.layout.makeConfirmationBanner(ok, popup.easyClose.bind(popup));
      popup.open(banner);
    }
  }

  private openPopup(type: enums.MessageType, text: string) {
    const popup = new Popup();
    popup.editorMode();
    popup.open(this.layout.makeBanner(type, text));
  }

  private async confirmDay() {
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
