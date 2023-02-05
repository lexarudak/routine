import PageList from '../../base/enums/pageList';
import RoutsList from '../../base/enums/routsList';
import { GoToFn } from '../../base/types';
import Page from '../page';

class HomePage extends Page {
  constructor(goTo: GoToFn) {
    super(PageList.homePage, goTo);
  }

  protected getFilledPage(): HTMLElement {
    const emptyPage = document.createElement('h1');
    emptyPage.innerText = this.name;
    emptyPage.addEventListener('click', () => this.goTo(RoutsList.loginPage));
    return emptyPage;
  }
}

export default HomePage;
