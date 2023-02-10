import PagesList from '../base/enums/pageList';
import { getExistentElementByClass } from '../base/helpers';
import ClassList from '../base/enums/classList';
import { GoToFn } from '../base/types';
import PlanEditor from './planPage/components/planEditor';

abstract class Page {
  protected name: PagesList;

  protected goTo: GoToFn;

  protected editor: PlanEditor;

  constructor(name: PagesList, goTo: GoToFn, editor: PlanEditor) {
    this.name = name;
    this.goTo = goTo;
    this.editor = editor;
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
