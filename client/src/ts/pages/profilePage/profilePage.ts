import Page from '../page';
import Api from '../../api';

import ProfileLayout from './components/profileLayout';

import { User, Statistics } from '../../base/interface';
import { GoToFn } from '../../base/types';
import { MainClassList, ProfilePageClassList } from '../../base/enums/classList';

import PagesList from '../../base/enums/pageList';
import ErrorsList from '../../base/enums/errorsList';

import NavButtons from '../../base/enums/navButtons';
import Header from '../../components/header';
import { getExistentElement, getExistentElementByClass, loginRedirect } from '../../base/helpers';
import ConfirmationDays from '../../base/enums/confirmationDays';
import PlanEditor from '../../components/planEditor';

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

  private setEventListeners() {
    const uiUserName = getExistentElementByClass<HTMLInputElement>(ProfilePageClassList.greetingUserName);
    uiUserName.addEventListener('input', () => this.activateSaveButton());

    let classCSS = `.${ProfilePageClassList.settingsConfirmDay}>.${ProfilePageClassList.button}`;
    const uiConfirmDay = getExistentElement<HTMLButtonElement>(classCSS);
    uiConfirmDay.addEventListener('click', () => this.changeConfirmationDay(uiConfirmDay));

    classCSS = `.${ProfilePageClassList.settingsConfirmTime}>.${ProfilePageClassList.button}`;
    const uiConfirmTime = getExistentElement<HTMLButtonElement>(classCSS);
    uiConfirmTime.addEventListener('change', () => this.activateSaveButton());

    classCSS = `.${ProfilePageClassList.settingsLogOut}>.${ProfilePageClassList.button}`;
    const uiLogOut = getExistentElement<HTMLButtonElement>(classCSS);
    uiLogOut.addEventListener('click', () => this.logOut());
  }

  private changeConfirmationDay(uiElement: HTMLButtonElement) {
    uiElement.textContent = this.toggleConfirmationDay(uiElement.textContent || ConfirmationDays.today);
    this.activateSaveButton();
  }

  private toggleConfirmationDay(day: string) {
    return day === ConfirmationDays.today ? ConfirmationDays.yesterday : ConfirmationDays.today;
  }

  private async logOut() {
    await Api.logout();
    loginRedirect(new Error(ErrorsList.needLogin), this.goTo);
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
      const container = getExistentElementByClass(MainClassList.mainContainer);
      await this.animatedFilledPageAppend(container);
      this.setEventListeners();
    } catch (error) {
      loginRedirect(error, this.goTo);
    }
  }
}

export default ProfilePage;
