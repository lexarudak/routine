import PagesList from '../base/enums/pageList';
import { getExistentElementByClass } from '../base/helpers';
import { MainClassList } from '../base/enums/classList';
import { GoToFn } from '../base/types';
import PlanEditor from '../components/planEditor';

abstract class Page {
  protected name: PagesList;

  protected goTo: GoToFn;

  protected editor: PlanEditor;

  protected dayId: string;

  constructor(name: PagesList, goTo: GoToFn, editor: PlanEditor) {
    this.name = name;
    this.goTo = goTo;
    this.editor = editor;
    this.dayId = '';
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    const emptyPage = document.createElement('h1');
    emptyPage.innerText = this.name;
    return emptyPage;
  }

  protected async animatedFilledPageAppend(container: HTMLElement) {
    container.classList.add(MainClassList.mainContainerHide);
    const page = await this.getFilledPage();
    container.innerHTML = '';
    container.classList.remove(MainClassList.mainContainerHide);
    container.append(page);
  }

  public async draw(id?: string) {
    if (id) this.dayId = id;
    const container = getExistentElementByClass(MainClassList.mainContainer);
    await this.animatedFilledPageAppend(container);
  }
}

export default Page;
