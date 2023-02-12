import Page from '../page';

import ProfileLayout from './components/profileLayout';
import PlanEditor from '../planPage/components/planEditor';

import PagesList from '../../base/enums/pageList';
import { GoToFn } from '../../base/types';
import { ClassList, ProfilePageClassList } from '../../base/enums/classList';
import * as helpers from '../../base/helpers';

class ProfilePage extends Page {
  layout: ProfileLayout;

  constructor(goTo: GoToFn, editor: PlanEditor) {
    super(PagesList.profilePage, goTo, editor);
    this.layout = new ProfileLayout();
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    const container = document.createElement('section');
    container.classList.add(ProfilePageClassList.profile);

    container.append(this.layout.makeHomeButton(this.goTo));
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
