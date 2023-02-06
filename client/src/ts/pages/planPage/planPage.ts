import ClassList from '../../base/enums/classList';
import PagesList from '../../base/enums/pageList';
import { Plan } from '../../base/interface';
import { GoToFn } from '../../base/types';
import Page from '../page';
import PlanLayout from './components/planLayout';
// import testPlans from './components/testPlans';

class PlanPage extends Page {
  layout: PlanLayout;

  allPlans: Plan[] | [];

  constructor(goTo: GoToFn) {
    super(PagesList.planPage, goTo);
    this.allPlans = [];
    this.layout = new PlanLayout();
  }

  // private fillWeekLine(weekLine: HTMLDivElement) {
  //   const newWeekLine = weekLine;

  // }

  // private getWeekLine() {
  //   return this.fillWeekLine(this.layout.makeWeekLine());
  // }

  // private async getAllPlans() {
  //   // it should be Api get Fn
  //   return testPlans;
  // }

  protected async getFilledPage(): Promise<HTMLElement> {
    // await this.getAllPlans();

    const container = document.createElement('section');
    container.classList.add(ClassList.planContainer);

    container.append(this.layout.makeHomeButton(this.goTo));
    return container;
  }
}

export default PlanPage;
