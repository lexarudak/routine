import PagesList from '../base/enums/pageList';
import { getExistentElementByClass } from '../base/helpers';
import ClassList from '../base/enums/classList';

abstract class Page {
  protected name: PagesList;

  constructor(name: PagesList) {
    this.name = name;
  }

  public getFilledPage() {
    const emptyPage = document.createElement('h1');
    emptyPage.innerText = this.name;
    return emptyPage;
  }

  public async draw(): Promise<void> {
    const container = getExistentElementByClass(ClassList.mainContainer);
    container.innerHTML = '';
    container.append(this.getFilledPage());
  }
}

export default Page;
