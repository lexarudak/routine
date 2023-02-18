import Page from '../page';
import Api from '../../api';

import ConfirmLayout from './components/confirmLayout';
import PlanEditor from '../planPage/components/planEditor';

import { User, Plan } from '../../base/interface';
import { GoToFn, ConfirmationDay } from '../../base/types';
import { ClassList, ConfirmPageClassList } from '../../base/enums/classList';

import PagesList from '../../base/enums/pageList';
import ButtonNames from '../../base/enums/buttonNames';
import RoutsList from '../../base/enums/routsList';

import * as helpers from '../../base/helpers';
import * as enums from '../../base/enums/enums';

class ConfirmPage extends Page {
  layout: ConfirmLayout;
  profile: User = {} as User;
  weekDistribution: Plan[][] = [];
  dayPlans: Plan[] = [];

  constructor(goTo: GoToFn, editor: PlanEditor) {
    super(PagesList.confirmPage, goTo, editor);
    this.layout = new ConfirmLayout();
  }

  private async setConfirmInfo() {
    [this.profile, this.weekDistribution] = await Promise.all([Api.getUserProfile(), Api.getWeekDistribution()]);
  }

  private setEventLiseners() {
    // let classCSS = `.${ProfilePageClassList.settingsConfirmDay}>.${ProfilePageClassList.button}`;
    // const uiConfirmDay = helpers.getExistentElement<HTMLButtonElement>(classCSS);
    // uiConfirmDay.addEventListener('click', () => this.changeConfirmationDay(uiConfirmDay));
    // classCSS = `.${ProfilePageClassList.settingsConfirmTime}>.${ProfilePageClassList.button}`;
    // const uiConfirmTime = helpers.getExistentElement<HTMLButtonElement>(classCSS);
    // uiConfirmTime.addEventListener('change', () => this.activateSaveButton());
    // classCSS = `.${ProfilePageClassList.settingsLogOut}>.${ProfilePageClassList.button}`;
    // const uiLogOut = helpers.getExistentElement<HTMLButtonElement>(classCSS);
    // uiLogOut.addEventListener('click', () => this.logOut());
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    await this.setConfirmInfo();

    const container = document.createElement('section');
    container.classList.add(ConfirmPageClassList.confirm);

    const wrapper = document.createElement('div');
    wrapper.classList.add(ConfirmPageClassList.confirmWrapper);

    const dayOfWeek = this.getDayOfWeekByConfirmationDay(this.profile.confirmationDay);
    this.dayPlans = this.weekDistribution[dayOfWeek];

    wrapper.append(this.layout.makeHeader(dayOfWeek), this.layout.makeConfirmContent(this.dayPlans));
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

  private getDayOfWeekByConfirmationDay(confirmationDay: ConfirmationDay) {
    const dayOfWeek = this.getPreviousDayOfWeek(new Date().getDay());
    return confirmationDay === enums.ConfirmationDays.today ? dayOfWeek : this.getPreviousDayOfWeek(dayOfWeek);
  }

  private getPreviousDayOfWeek(dayOfWeek: number) {
    return dayOfWeek - 1 < 0 ? 6 : dayOfWeek - 1;
  }
}

export default ConfirmPage;
