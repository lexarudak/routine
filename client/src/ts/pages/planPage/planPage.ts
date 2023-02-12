/* eslint-disable no-underscore-dangle */
import ClassList from '../../base/enums/classList';
import PagesList from '../../base/enums/pageList';
import PlanRoundConfig from '../../components/planRoundConfig';
import Values from '../../base/enums/values';
import { getExistentElementByClass, loginRedirect, minToHour } from '../../base/helpers';
import { Plan } from '../../base/interface';
import { GoToFn, PlanDis, WeekInfo } from '../../base/types';
import PlanRound from '../../components/planRound';
import Page from '../page';
import PlanLayout from './components/planLayout';
import Popup from '../../components/popup';
import ErrorsList from '../../base/enums/errorsList';
import PlanEditor from './components/planEditor';
import Api from '../../api';
import { GetAttribute } from '../../base/enums/attributes';
import TimeSlider from './components/timeSlider';

class PlanPage extends Page {
  layout: PlanLayout;

  allPlans: Plan[];

  allPlansDist: PlanDis;

  planRounds: PlanRound[];

  weekDistribution: Plan[][];

  popup: Popup;

  fillWeekTime;

  constructor(goTo: GoToFn, popup: Popup, editor: PlanEditor) {
    super(PagesList.planPage, goTo, editor);
    this.popup = popup;
    this.allPlans = [];
    this.planRounds = [];
    this.allPlansDist = {};
    this.weekDistribution = [[]];
    this.layout = new PlanLayout(goTo);
    this.fillWeekTime = 0;
    this.addDayListener = this.addDayListener.bind(this);
  }

  private isFreeTimeInWeek() {
    return Values.allWeekMinutes - this.fillWeekTime >= Values.minPlanDuration;
  }

  private ifFreeTimeInDay(minutes: number) {
    console.log(minutes);
    return minutes >= Values.allDayMinutes - Values.minPlanDuration;
  }

  private getFreeDayMinutes(dayId: string) {
    const dayPlans = this.weekDistribution[Number(dayId)];
    const filledMinutes = dayPlans.reduce((acc, plan) => {
      return acc + plan.duration;
    }, 0);
    return Values.allDayMinutes - filledMinutes;
  }

  private ifFreeTimeInPlan(planId: string, planDur: number) {
    console.log(planDur, this.allPlansDist[planId]);
    return planDur - (this.allPlansDist[planId] || 0) >= Values.minPlanDuration;
  }

  private getPlanDuration(planId: string) {
    return this.allPlans.filter((plan) => plan._id === planId)[0].duration;
  }

  private getCurrentDay(e: Event) {
    const { currentTarget } = e;
    if (!(currentTarget instanceof HTMLElement)) throw new Error(ErrorsList.elementNotFound);
    return currentTarget;
  }

  private getDragId() {
    const id = getExistentElementByClass(ClassList.planRoundDrag).dataset[GetAttribute.planId];
    if (id) return id;
    throw new Error(ErrorsList.noId);
  }

  private makeSliderForDay() {
    const slider = new TimeSlider();
    return slider.draw();
  }

  private addListenersToAllDays(listener: (day: HTMLElement) => void) {
    const allDays = document.querySelectorAll(`.${ClassList.planDay}`);
    allDays.forEach((day) => {
      if (day instanceof HTMLElement) listener(day);
    });
  }

  private addDayListener(day: HTMLElement) {
    day.addEventListener('dragover', function enter(e) {
      e.preventDefault();
      this.classList.add(ClassList.planDayOver);
    });
    day.addEventListener('dragleave', function leave() {
      this.classList.remove(ClassList.planDayOver);
    });
    day.addEventListener('drop', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const currentDay = this.getCurrentDay(e);
      currentDay.classList.remove(ClassList.planDayOver);

      const dayId = currentDay.dataset[GetAttribute.dayId];
      const planId = this.getDragId();
      if (!dayId || !planId) throw new Error(ErrorsList.noId);
      const planDur = this.getPlanDuration(planId);
      const freeDayMinutes = this.getFreeDayMinutes(dayId);

      this.popup.editorMode();
      if (!this.ifFreeTimeInDay(freeDayMinutes)) {
        this.popup.open(this.layout.makeBanner(ErrorsList.freeYourTime));
      } else if (!this.ifFreeTimeInPlan(planId, planDur)) {
        this.popup.open(this.layout.makeBanner(ErrorsList.thisPlanIsDist));
      } else {
        this.popup.open(this.makeSliderForDay());
      }
      // this.ifFreeTimeInPlan();

      console.log(planId);
    });
  }

  private setAddButton() {
    getExistentElementByClass(ClassList.planAddButton).addEventListener('click', () => {
      if (this.isFreeTimeInWeek()) {
        this.editor.open(Values.minPlanDuration, Values.allWeekMinutes - this.fillWeekTime);
      } else {
        this.popup.open(this.layout.makeBanner(ErrorsList.freeYourTime));
      }
    });
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

  private setPlanDistTime() {
    console.log('s');
    const flatArr = this.weekDistribution.flat();
    this.allPlansDist = flatArr.reduce((acc, plan) => {
      if (acc[plan._id]) {
        acc[plan._id] += plan.duration;
      } else {
        acc[plan._id] = plan.duration;
      }
      return acc;
    }, <PlanDis>{});
  }

  private showElements() {
    const scale = Values.scaleNormal;
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

      const roundDiv = this.addRoundListener(round, width);

      (ind % 2 === 0 ? bigZone : smallZone).append(roundDiv);
    });
  }

  private addRoundListener(round: PlanRound, width: number) {
    const freeTime = round.planInfo.duration - (this.allPlansDist[round.planInfo._id] || 0);
    const roundDiv = round.draw(width, freeTime);
    roundDiv.addEventListener('click', () => {
      this.editor.open(
        round.planInfo.duration - freeTime,
        round.planInfo.duration + Values.allWeekMinutes - this.fillWeekTime,
        round.planInfo
      );
    });
    const days = getExistentElementByClass(ClassList.planDaysContainer);
    const bin = getExistentElementByClass(ClassList.planRemoveZone);
    roundDiv.addEventListener('dragstart', function dragstart() {
      setTimeout(() => {
        this.classList.add(ClassList.planRoundDrag);
        bin.classList.add(ClassList.planRemoveZoneDrag);
        days.classList.add(ClassList.planDaysContainerDrag);
        bin.style.transform = Values.scaleBig;
      }, 50);
    });
    roundDiv.addEventListener('dragend', function dragend() {
      this.classList.remove(ClassList.planRoundDrag);
      bin.classList.remove(ClassList.planRemoveZoneDrag);
      days.classList.remove(ClassList.planDaysContainerDrag);
      bin.style.transform = Values.scaleNormal;
    });
    return roundDiv;
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
    console.log(fullMinutes);
    return fullMinutes;
  }

  private fillWeekLine() {
    const weekLine = getExistentElementByClass(ClassList.weekLine);
    const sortWeek = this.sortAllPlans();
    const fillWeekTime = this.fillLine(weekLine, sortWeek, Values.allWeekMinutes, false);
    this.fillWeekTime = fillWeekTime;

    getExistentElementByClass(ClassList.weekTextValue).innerText = minToHour(fillWeekTime);
    getExistentElementByClass(ClassList.planAddButtonValue).innerText = minToHour(Values.allWeekMinutes - fillWeekTime);
  }

  private async setWeekInfo() {
    const weekInfo: WeekInfo = await Promise.all([Api.getAllPlans(), Api.getWeekDistribution()]);
    [this.allPlans, this.weekDistribution] = weekInfo;
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
    try {
      const container = getExistentElementByClass(ClassList.mainContainer);
      await this.animatedFilledPageAppend(container);

      this.fillWeekLine();
      this.setPlanDistTime();
      this.fillPlansFields();
      this.fillDays();
      this.showElements();
      this.setAddButton();
      this.addListenersToAllDays(this.addDayListener);
    } catch (error) {
      loginRedirect(error, this.goTo);
    }
  }
}

export default PlanPage;
