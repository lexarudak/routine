import ButtonClasses from '../base/enums/buttonClasses';
import { ClassList } from '../base/enums/classList';
import Days from '../base/enums/days';
import NavButtons from '../base/enums/navButtons';
import RoutsList from '../base/enums/routsList';
import { createNewElement, getCurrentDayNum } from '../base/helpers';
import { GoToFn } from '../base/types';
import Layout from '../pages/layout';

class Header {
  goTo: GoToFn;

  layout: Layout;

  today: HTMLElement;

  constructor(goTo: GoToFn) {
    this.goTo = goTo;
    this.layout = new Layout();
    this.today = this.layout.makeNavButton(NavButtons.today, this.makeTodayPath(), this.goTo);
  }

  private makeTodayPath() {
    return `/${Days[getCurrentDayNum()]}`;
  }

  public paintToday(dayId: string) {
    if (dayId === getCurrentDayNum().toString()) {
      this.today.classList.add(ButtonClasses.navButtonActive);
    } else {
      this.today.classList.remove(ButtonClasses.navButtonActive);
    }
  }

  makeInfoBlock(infoBlock: HTMLElement) {
    infoBlock.classList.add(ClassList.headerInfo);
    return infoBlock;
  }

  private makeNav(activeNavButton?: NavButtons) {
    const nav = createNewElement('nav', ClassList.nav);
    const buttons = [
      this.layout.makeNavButton(NavButtons.week, RoutsList.planPage, this.goTo),
      this.today,
      this.layout.makeNavButton(NavButtons.confirm, RoutsList.confirmPage, this.goTo),
      this.layout.makeNavButton(NavButtons.profile, RoutsList.profilePage, this.goTo),
    ];
    buttons.forEach((button) => {
      console.log(button.innerText);
      console.log(activeNavButton);
      if (button.innerText === activeNavButton?.toString()) {
        button.classList.add(ButtonClasses.navButtonActive);
      }
      nav.append(button);
    });
    return nav;
  }

  private makeLogo() {
    const logo = createNewElement('div', ClassList.headerLogo);
    logo.addEventListener('click', () => this.goTo(RoutsList.homePage));
    return logo;
  }

  private makeName(name: string) {
    const nameDiv = createNewElement('h1', ClassList.headerName);
    nameDiv.innerText = name;
    return nameDiv;
  }

  public draw(name: string, activeButton?: NavButtons, infoBlock?: HTMLElement) {
    const header = createNewElement('header', ClassList.header);
    header.append(this.makeLogo(), this.makeName(name), this.makeNav(activeButton));
    if (infoBlock) header.append(this.makeInfoBlock(infoBlock));
    return header;
  }
}

export default Header;
