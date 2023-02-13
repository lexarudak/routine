import Page from '../page';
import Api from '../../api';

import ProfileLayout from './components/profileLayout';
import PlanEditor from '../planPage/components/planEditor';

import { User, Statistics } from '../../base/interface';
import PagesList from '../../base/enums/pageList';
import { GoToFn } from '../../base/types';
import { ClassList, ProfilePageClassList } from '../../base/enums/classList';
import * as helpers from '../../base/helpers';

class ProfilePage extends Page {
  layout: ProfileLayout;

  profile: User = {} as User;

  statistics: Statistics[] = [];

  constructor(goTo: GoToFn, editor: PlanEditor) {
    super(PagesList.profilePage, goTo, editor);
    this.layout = new ProfileLayout();
  }

  private async setProfileInfo() {
    [this.profile, this.statistics] = await Promise.all([Api.getUserProfile(), Api.getStatistics()]);
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    await this.setProfileInfo();
    console.log(this.profile, this.statistics);

    const container = document.createElement('section');
    container.classList.add(ProfilePageClassList.profile);

    const wrapper = document.createElement('div');
    wrapper.classList.add('profile-wrapper');
    wrapper.append(this.layout.makeUserData(), this.layout.makeStatistics());

    container.append(this.layout.makeHomeButton(this.goTo), wrapper);
    return container;
  }

  public async draw() {
    try {
      const container = helpers.getExistentElementByClass(ClassList.mainContainer);
      await this.animatedFilledPageAppend(container);
    } catch (error) {
      helpers.loginRedirect(error, this.goTo);
    }
  }
}

export default ProfilePage;
