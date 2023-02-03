import PageList from '../../base/enums/pageList';
import { GoToFn } from '../../base/types';
import Page from '../page';

class HomePage extends Page {
  constructor(goTo: GoToFn) {
    super(PageList.homePage, goTo);
  }
}

export default HomePage;
