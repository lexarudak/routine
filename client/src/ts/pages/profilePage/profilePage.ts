import Page from '../page';
import Api from '../../api';

import ProfileLayout from './components/profileLayout';
import PlanEditor from '../planPage/components/planEditor';

import { User, Statistics } from '../../base/interface';
import { GoToFn } from '../../base/types';
import { ClassList, ProfilePageClassList } from '../../base/enums/classList';

import PagesList from '../../base/enums/pageList';
import ErrorsList from '../../base/enums/errorsList';

import * as helpers from '../../base/helpers';
import * as enums from '../../base/enums/enums';
import NavButtons from '../../base/enums/navButtons';
import Header from '../../components/header';

class ProfilePage extends Page {
  layout: ProfileLayout;

  profile: User = {} as User;

  statistics: Statistics[] = [];

  header: Header;

  constructor(goTo: GoToFn, editor: PlanEditor) {
    super(PagesList.profilePage, goTo, editor);
    this.layout = new ProfileLayout();
    this.header = new Header(goTo);
  }

  private async setProfileInfo() {
    [this.profile, this.statistics] = await Promise.all([Api.getUserProfile(), Api.getStatistics()]);
  }

  private setEventLiseners() {
    let classCSS = `.${ProfilePageClassList.settingsConfirmDay}>.${ProfilePageClassList.button}`;
    const uiConfirmDay = helpers.getExistentElement<HTMLButtonElement>(classCSS);
    uiConfirmDay.addEventListener('click', () => this.changeConfirmationDay(uiConfirmDay));

    classCSS = `.${ProfilePageClassList.settingsConfirmTime}>.${ProfilePageClassList.button}`;
    const uiConfirmTime = helpers.getExistentElement<HTMLButtonElement>(classCSS);
    uiConfirmTime.addEventListener('change', () => this.activateSaveButton());

    classCSS = `.${ProfilePageClassList.settingsLogOut}>.${ProfilePageClassList.button}`;
    const uiLogOut = helpers.getExistentElement<HTMLButtonElement>(classCSS);
    uiLogOut.addEventListener('click', () => this.logOut());
  }

  private changeConfirmationDay(uiElement: HTMLButtonElement) {
    uiElement.textContent = this.toggleConfirmationDay(uiElement.textContent || enums.ConfirmationDays.today);
    this.activateSaveButton();
  }

  private toggleConfirmationDay(day: string) {
    return day === enums.ConfirmationDays.today ? enums.ConfirmationDays.yesterday : enums.ConfirmationDays.today;
  }

  private async logOut() {
    await Api.logout();
    helpers.loginRedirect(new Error(ErrorsList.needLogin), this.goTo);
  }

  private activateSaveButton() {
    this.layout.makeSaveButton(this.save.bind(this));
  }

  private async save() {
    this.layout.disableSaveButton();

    const settings = this.layout.getUserSettings();
    await Api.saveUserSettings(settings);

    this.layout.removeSaveButton();
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    await this.setProfileInfo();

    const container = document.createElement('section');
    container.classList.add(ProfilePageClassList.profile);

    const wrapper = document.createElement('div');
    wrapper.classList.add(ProfilePageClassList.profileWrapper);
    wrapper.append(this.layout.makeUserData(this.profile), this.layout.makeStatistics(this.statistics));

    container.append(this.header.draw(PagesList.profilePage, NavButtons.profile), wrapper);
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

export default ProfilePage;
