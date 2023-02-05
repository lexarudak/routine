import PageList from '../../base/enums/pageList';
import { GoToFn } from '../../base/types';
import SignIn from '../../components/signIn';
import Page from '../page';

class HomePage extends Page {
  constructor(goTo: GoToFn) {
    super(PageList.homePage, goTo);
  }

  protected getFilledPage(): HTMLElement {
    const emptyPage = document.createElement('h1');
    emptyPage.innerText = this.name;
    emptyPage.addEventListener('click', () => new SignIn().draw());
    return emptyPage;
  }
}

export default HomePage;
