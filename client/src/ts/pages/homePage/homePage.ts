import PageList from '../../base/enums/pageList';
import RoutsList from '../../base/enums/routsList';
import { GoToFn } from '../../base/types';
import Page from '../page';
import PlanEditor from '../planPage/components/planEditor';

class HomePage extends Page {
  constructor(goTo: GoToFn, editor: PlanEditor) {
    super(PageList.homePage, goTo, editor);
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    const emptyPage = document.createElement('h1');
    emptyPage.innerText = this.name;
    emptyPage.addEventListener('click', () => this.goTo(RoutsList.loginPage));
    return emptyPage;
  }
}

export default HomePage;
