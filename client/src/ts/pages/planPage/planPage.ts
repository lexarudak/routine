import ClassList from '../../base/enums/classList';
import PagesList from '../../base/enums/pageList';
import PlanRoundConfig from '../../components/planRoundConfig';
import Values from '../../base/enums/values';
import { getExistentElementByClass, minToHour } from '../../base/helpers';
import { Plan } from '../../base/interface';
import { GoToFn, WeekInfo } from '../../base/types';
import PlanRound from '../../components/planRound';
import Page from '../page';
import PlanLayout from './components/planLayout';
import testPlans from './components/testPlans';
import testWeekDistribution from './components/testWeekDistribution';

class PlanPage extends Page {
  layout: PlanLayout;

  allPlans: Plan[];

  planRounds: PlanRound[];

  weekDistribution: Plan[][];

  constructor(goTo: GoToFn) {
    super(PagesList.planPage, goTo);
    this.allPlans = [];
    this.planRounds = [];
    this.weekDistribution = [[]];
    this.layout = new PlanLayout(goTo);
  }

  private sortAllPlans() {
    return this.allPlans.sort((a, b) => (a.duration > b.duration ? +1 : 1));
  }

  private makePlans() {
    this.planRounds = [];
    this.planRounds = this.allPlans.map((plan) => {
      return new PlanRound(plan);
    });
  }

  private showElements() {
    const scale = 'scale(1)';
    setTimeout(() => {
      getExistentElementByClass(ClassList.planAddButton).style.transform = scale;
      getExistentElementByClass(ClassList.planRemoveZone).style.transform = scale;
      getExistentElementByClass(ClassList.weekLine).childNodes.forEach((val) => {
        if (val instanceof HTMLDivElement) val.style.transform = scale;
      });
      const rounds = document.querySelectorAll(`.${ClassList.planRound}`);
      rounds.forEach((val) => {
        if (val instanceof HTMLDivElement) val.style.transform = scale;
      });
      const days = document.querySelectorAll(`.${ClassList.planDayLine}`);
      days.forEach((day) => {
        if (day instanceof HTMLDivElement) {
          day.childNodes.forEach((val) => {
            if (val instanceof HTMLDivElement) val.style.transform = scale;
          });
        }
      });
    }, 0);
  }

  private fillPlansFields() {
    const bigZone = getExistentElementByClass(ClassList.weekendFieldsBig);
    const smallZone = getExistentElementByClass(ClassList.weekendFieldsSmall);
    const maxRoundSize = bigZone.clientWidth * PlanRoundConfig.maxSizeK;

    this.planRounds.forEach((round, ind) => {
      const timePer = round.planInfo.duration / (PlanRoundConfig.maxProcDur - PlanRoundConfig.minProcDur);
      let width = (maxRoundSize - PlanRoundConfig.minRoundSize) * timePer + PlanRoundConfig.minRoundSize;
      if (width < PlanRoundConfig.minRoundSize) width = PlanRoundConfig.minRoundSize;
      if (width > maxRoundSize) width = maxRoundSize;

      (ind % 2 === 0 ? bigZone : smallZone).append(round.draw(width));
    });
  }

  private fillDays() {
    const daysArr = document.querySelectorAll(`.${ClassList.planDay}`);
    daysArr.forEach((day, ind) => {
      if (day.firstChild instanceof HTMLElement) {
        const fillHours = this.fillLine(day.firstChild, this.weekDistribution[ind], Values.allDayMinutes, true);
        if (day.lastChild instanceof HTMLElement) {
          day.lastChild.innerHTML = minToHour(Values.allDayMinutes - fillHours);
        }
      }
    });
  }

  private fillLine(line: HTMLElement, data: Plan[], maxMins: number, isVertical: boolean) {
    line.innerHTML = '';
    const containerSize = isVertical ? line.clientHeight : line.clientWidth;
    const k = containerSize / maxMins;
    const fullMinutes = data.reduce((acc, val) => {
      const section = document.createElement('div');
      section.style.height = isVertical ? `${val.duration * k}px` : `100%`;
      section.style.width = isVertical ? `100%` : `${val.duration * k}px`;
      section.style.backgroundColor = val.color;
      line.append(section);
      return acc + val.duration;
    }, 0);
    return fullMinutes;
  }

  private fillWeekLine() {
    const weekLine = getExistentElementByClass(ClassList.weekLine);
    const sortWeek = this.sortAllPlans();
    const fillWeekTime = this.fillLine(weekLine, sortWeek, Values.allWeekMinutes, false);

    getExistentElementByClass(ClassList.weekTextValue).innerText = minToHour(fillWeekTime);
    getExistentElementByClass(ClassList.planAddButtonValue).innerText = minToHour(Values.allWeekMinutes - fillWeekTime);
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
      }, 300);
    });
  }

  private async getWeekDistribution(): Promise<Plan[][]> {
    // it should be Api get Fn
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(testWeekDistribution);
      }, 300);
    });
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    await this.setWeekInfo();

    this.makePlans();

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
    this.fillPlansFields();
    this.fillDays();
    this.showElements();
  }
}

export default PlanPage;
