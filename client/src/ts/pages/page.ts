import PagesList from '../base/enums/pageList';
import { getExistentElementByClass } from '../base/helpers';
import ClassList from '../base/enums/classList';
import { GoToFn } from '../base/types';

abstract class Page {
  protected name: PagesList;

  protected goTo: GoToFn;

  constructor(name: PagesList, goTo: GoToFn) {
    this.name = name;
    this.goTo = goTo;
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    const emptyPage = document.createElement('h1');
    emptyPage.innerText = this.name;
    return emptyPage;
  }

  public async draw() {
    const container = getExistentElementByClass(ClassList.mainContainer);
    container.innerHTML = '';
    const page = await this.getFilledPage();
    container.append(page);
  }
}

export default Page;
