import { ButtonClassList, NotFoundPageClassList } from '../../base/enums/classList';
import InnerText from '../../base/enums/innerText';
import PagesList from '../../base/enums/pageList';
import RoutsList from '../../base/enums/routsList';
import { GoToFn } from '../../base/types';
import PlanEditor from '../../components/planEditor';
import Page from '../page';

class NotFoundPage extends Page {
  constructor(goToFn: GoToFn, editor: PlanEditor) {
    super(PagesList.notFoundPage, goToFn, editor);
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    const page = document.createElement('section');
    page.classList.add(NotFoundPageClassList.page404);

    const name = document.createElement('h1');
    name.innerText = this.name;
    name.classList.add(NotFoundPageClassList.page404title);

    const description = document.createElement('p');
    description.innerText = InnerText.page404text;
    description.classList.add(NotFoundPageClassList.page404text);

    const button = document.createElement('button');
    button.classList.add(ButtonClassList.button, ButtonClassList.main);
    button.textContent = InnerText.home;
    button.addEventListener('click', () => this.goTo(RoutsList.homePage));

    page.append(name, description, button);
    return page;
  }
}

export default NotFoundPage;
