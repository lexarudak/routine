import ClassList from '../../base/enums/classList';
import PagesList from '../../base/enums/pageList';
import Values from '../../base/enums/values';
import { getExistentElementByClass } from '../../base/helpers';
import { Plan } from '../../base/interface';
import { GoToFn, WeekInfo } from '../../base/types';
import Page from '../page';
import PlanLayout from './components/planLayout';
import testPlans from './components/testPlans';
import testWeekDistribution from './components/testWeekDistribution';

class PlanPage extends Page {
  layout: PlanLayout;

  allPlans: Plan[];

  weekDistribution: Plan[][] | [][];

  constructor(goTo: GoToFn) {
    super(PagesList.planPage, goTo);
    this.allPlans = [];
    this.weekDistribution = [[]];
    this.layout = new PlanLayout(goTo);
  }

  private sortAllPlans() {
    return this.allPlans.sort((a, b) => (a.duration > b.duration ? +1 : 1));
  }

  private fillDays() {
    const daysArr = document.querySelectorAll(`.${ClassList.planDay}`);
    daysArr.forEach((day, ind) => {
      if (day.firstChild instanceof HTMLElement) {
        const fillHours = this.fillLine(day.firstChild, this.weekDistribution[ind], Values.allDayHours, true);
        if (day.lastChild instanceof HTMLElement) {
          day.lastChild.innerHTML = `${Values.allDayHours - fillHours} h`;
        }
      }
    });
  }

  private fillLine(line: HTMLElement, data: Plan[], maxHours: number, isVertical: boolean) {
    line.innerHTML = '';
    const containerSize = isVertical ? line.clientHeight : line.clientWidth;
    const k = containerSize / maxHours;
    const fullHours = data.reduce((acc, val) => {
      const section = document.createElement('div');
      section.style.height = isVertical ? `${val.duration * k}px` : `100%`;
      section.style.width = isVertical ? `100%` : `${val.duration * k}px`;
      section.style.backgroundColor = val.color;
      line.append(section);
      return acc + val.duration;
    }, 0);
    return fullHours;
  }

  private fillWeekLine() {
    const weekLine = getExistentElementByClass(ClassList.weekLine);
    const sortWeek = this.sortAllPlans();
    const fillWeekTime = this.fillLine(weekLine, sortWeek, Values.allWeekHours, false);
    getExistentElementByClass(ClassList.weekTextValue).innerText = fillWeekTime.toString();
  }

  private async setWeekInfo() {
    const weekInfo: WeekInfo = await Promise.all([this.getAllPlans(), this.getWeekDistribution()]);
    [this.allPlans, this.weekDistribution] = weekInfo;
  }

  private async getAllPlans(): Promise<Plan[]> {
    // it should be Api get Fn
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(testPlans);
      }, 500);
    });
  }

  private async getWeekDistribution(): Promise<Plan[][]> {
    // it should be Api get Fn
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(testWeekDistribution);
      }, 500);
    });
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    await this.setWeekInfo();

    const container = document.createElement('section');
    container.classList.add(ClassList.planContainer);

    container.append(
      this.layout.makeHomeButton(this.goTo),
      this.layout.makeWeekText(),
      this.layout.makeWeekLine(),
      this.layout.makePlanBody()
    );
    return container;
  }

  public async draw() {
    const container = getExistentElementByClass(ClassList.mainContainer);
    container.innerHTML = '';
    const page = await this.getFilledPage();
    container.append(page);
    this.fillWeekLine();
    this.fillDays();
  }
}

export default PlanPage;
