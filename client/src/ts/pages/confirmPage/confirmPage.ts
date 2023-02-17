import Page from '../page';
import Api from '../../api';

import ConfirmLayout from './components/confirmLayout';
import PlanEditor from '../planPage/components/planEditor';

import { User } from '../../base/interface';
import { GoToFn } from '../../base/types';
import { ClassList, ConfirmPageClassList } from '../../base/enums/classList';

import PagesList from '../../base/enums/pageList';
import ButtonNames from '../../base/enums/buttonNames';
import RoutsList from '../../base/enums/routsList';

import * as helpers from '../../base/helpers';

class ConfirmPage extends Page {
  layout: ConfirmLayout;
  profile: User = {} as User;

  constructor(goTo: GoToFn, editor: PlanEditor) {
    super(PagesList.confirmPage, goTo, editor);
    this.layout = new ConfirmLayout();
  }

  private async setConfirmInfo() {
    this.profile = await Api.getUserProfile();
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
    wrapper.append(this.layout.makeHeader(this.profile));

    container.append(this.layout.makeNavButton(ButtonNames.home, RoutsList.homePage, this.goTo), wrapper);
    return container;
  }

  public async draw() {
    try {
      const container = helpers.getExistentElementByClass(ClassList.mainContainer);
      await this.animatedFilledPageAppend(container);
      this.setEventLiseners();
    } catch (error) {
      helpers.loginRedirect(error, this.goTo);
    }
  }
}

export default ConfirmPage;
