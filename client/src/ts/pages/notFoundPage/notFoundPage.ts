import ButtonClasses from '../../base/enums/buttonClasses';
import ButtonNames from '../../base/enums/buttonNames';
import { ClassList } from '../../base/enums/classList';
import InnerText from '../../base/enums/innerText';
import PagesList from '../../base/enums/pageList';
import RoutsList from '../../base/enums/routsList';
import { GoToFn } from '../../base/types';
import Page from '../page';

class NotFoundPage extends Page {
  constructor(goToFn: GoToFn) {
    super(PagesList.notFound, goToFn);
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    const page = document.createElement('section');

    const name = document.createElement('h1');
    name.innerText = this.name;
    name.classList.add(ClassList.page404title);

    const description = document.createElement('p');
    description.innerText = InnerText.page404text;
    description.classList.add(ClassList.page404text);

    const button = document.createElement('button');
    button.classList.add(ButtonClasses.button, ButtonClasses.main);
    button.textContent = ButtonNames.home;
    button.addEventListener('click', () => this.goTo(RoutsList.homePage));

    page.append(name, description, button);
    return page;
  }
}

export default NotFoundPage;
