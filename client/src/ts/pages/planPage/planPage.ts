import { ClassList } from '../../base/enums/classList';
import PagesList from '../../base/enums/pageList';
import Values from '../../base/enums/values';
import { getExistentElementByClass } from '../../base/helpers';
import { Plan } from '../../base/interface';
import { GoToFn, WeekInfo } from '../../base/types';
import Page from '../page';
import PlanLayout from './components/planLayout';
import testPlans from './components/testPlans';
import testWeekDistribution from './components/testWeekDistribution';
// import testPlans from './components/testPlans';

class PlanPage extends Page {
  layout: PlanLayout;

  allPlans: Plan[];

  weekDistribution: Plan[][] | [][];

  constructor(goTo: GoToFn) {
    super(PagesList.planPage, goTo);
    this.allPlans = [];
    this.weekDistribution = [[]];
    this.layout = new PlanLayout();
  }

  private getFilledHours() {
    return this.allPlans
      .reduce((acc, val) => {
        return acc + val.duration;
      }, 0)
      .toString();
  }

  private sortAllPlans() {
    return this.allPlans.sort((a, b) => (a.duration > b.duration ? +1 : 1));
  }

  private fillWeekLine() {
    const weekLine = getExistentElementByClass(ClassList.weekLine);
    weekLine.innerHTML = '';
    const containerWidth = weekLine.clientWidth;
    const sortWeek = this.sortAllPlans();
    const k = containerWidth / Values.allWeekHours;
    sortWeek.forEach((val) => {
      const section = document.createElement('div');
      section.style.width = `${val.duration * k}px`;
      section.style.height = `100%`;
      section.style.backgroundColor = val.color;
      weekLine.append(section);
    });
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
      this.layout.makeWeekText(this.getFilledHours()),
      this.layout.makeWeekLine()
    );
    return container;
  }

  public async draw() {
    const container = getExistentElementByClass(ClassList.mainContainer);
    container.innerHTML = '';
    const page = await this.getFilledPage();
    container.append(page);
    this.fillWeekLine();
  }
}

export default PlanPage;
