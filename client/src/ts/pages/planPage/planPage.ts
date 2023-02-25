/* eslint-disable no-underscore-dangle */
import {
  BaseClassList,
  EditorClassList,
  MainClassList,
  PlanRoundClassList,
  WeekPageClassList,
} from '../../base/enums/classList';
import PagesList from '../../base/enums/pageList';
import Values from '../../base/enums/values';
import {
  buttonOff,
  createNewElement,
  getColors,
  getExistentElementByClass,
  makeBanner,
  makeRoundIcon,
  minToHour,
  sortAllPlans,
} from '../../base/helpers';
import { Plan } from '../../base/interface';
import { GoToFn, PlanDis, WeekInfo } from '../../base/types';
import PlanRound from '../../components/planRound';
import Page from '../page';
import PlanLayout from './components/planLayout';
import Popup from '../../components/popup';
import ErrorsList from '../../base/enums/errorsList';
import Api from '../../api';
import { GetAttribute } from '../../base/enums/attributes';
import TimeSlider from '../../components/timeSlider';
import savePlanIcon from './components/savePlanIcon';
import RoutsList from '../../base/enums/routsList';
import InnerText from '../../base/enums/innerText';
import EditorMode from '../../base/enums/editorMode';
import Header from '../../components/header';
import NavButtons from '../../base/enums/navButtons';
import { PlanRoundConfig } from '../../components/planRoundConfig';
import PlanEditor from '../../components/planEditor';

class PlanPage extends Page {
  layout: PlanLayout;

  allPlans: Plan[];

  allPlansDist: PlanDis;

  planRounds: PlanRound[];

  weekDistribution: Plan[][];

  popup: Popup;

  header: Header;

  fillWeekTime;

  constructor(goTo: GoToFn, popup: Popup, editor: PlanEditor) {
    super(PagesList.planPage, goTo, editor);
    this.popup = popup;
    this.allPlans = [];
    this.planRounds = [];
    this.allPlansDist = {};
    this.weekDistribution = [[]];
    this.layout = new PlanLayout(goTo);
    this.header = new Header(goTo);
    this.fillWeekTime = 0;
    this.addDayListener = this.addDayListener.bind(this);
  }

  private isFreeTimeInWeek() {
    return Values.allWeekMinutes - this.fillWeekTime >= Values.minPlanDuration;
  }

  private ifFreeTimeInDay(minutes: number) {
    return minutes >= Values.minPlanDuration;
  }

  private getFreeDayMinutes(dayId: string) {
    const dayPlans = this.weekDistribution[Number(dayId)];
    const filledMinutes = dayPlans.reduce((acc, plan) => {
      return acc + plan.duration;
    }, 0);
    return Values.allDayMinutes - filledMinutes;
  }

  private getFreePlanMinutes(plan: Plan) {
    return plan.duration - (this.allPlansDist[plan._id] || 0);
  }

  private ifFreeTimeInPlan(minutes: number) {
    return minutes >= Values.minPlanDuration;
  }

  private getPlan(planId: string) {
    return this.allPlans.filter((plan) => plan._id === planId)[0];
  }

  private getCurrentDay(e: Event) {
    const { currentTarget } = e;
    if (!(currentTarget instanceof HTMLElement)) throw new Error(ErrorsList.elementNotFound);
    return currentTarget;
  }

  private getDragId() {
    const id = getExistentElementByClass(PlanRoundClassList.planRoundDrag).dataset[GetAttribute.planId];
    if (id) return id;
    throw new Error(ErrorsList.noId);
  }

  private setPushPlanData(plan: Plan, dayId: string, slider: TimeSlider) {
    return { dayOfWeek: Number(dayId), planId: plan._id, duration: slider.currentTime };
  }

  private async pushPlanToThisDay(e: Event, plan: Plan, dayId: string, slider: TimeSlider) {
    const userData = this.setPushPlanData(plan, dayId, slider);
    const { currentTarget } = e;
    if (!(currentTarget instanceof HTMLButtonElement)) throw new Error(ErrorsList.elementIsNotButton);
    buttonOff(currentTarget);
    this.popup.editorModeOff();

    try {
      this.popup.easyClose();
      getExistentElementByClass(MainClassList.mainContainer).classList.add(MainClassList.mainContainerHide);
      await Api.pushPlanToDay(userData);
      this.goTo(RoutsList.planPage);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === ErrorsList.needLogin) {
          this.goTo(RoutsList.loginPage);
        }
      }
    }
  }

  private makeSliderForDay(dayId: string, plan: Plan, freeDayMinutes: number, freePlanMinutes: number) {
    const [bgColor, fontColor] = getColors(plan.color);
    const container = createNewElement('div', BaseClassList.sliderPopup);
    container.style.background = bgColor;
    const button = document.createElement('button');
    button.classList.add(EditorClassList.editorButton);
    container.style.color = fontColor;
    button.innerHTML = savePlanIcon(fontColor, EditorClassList.editorSaveIcon);

    const slider = new TimeSlider();
    slider.setTimer(Values.minPlanDuration, Math.min(freeDayMinutes, freePlanMinutes));

    button.addEventListener('click', async (e) => this.pushPlanToThisDay(e, plan, dayId, slider));

    container.append(slider.draw(), button);
    return container;
  }

  private addListenersToAllDays(listener: (day: HTMLElement) => void) {
    const allDays = document.querySelectorAll(`.${WeekPageClassList.planDay}`);
    allDays.forEach((day) => {
      if (day instanceof HTMLElement) listener(day);
    });
  }

  private addDayListener(day: HTMLElement) {
    day.addEventListener('dragover', function enter(e) {
      e.preventDefault();
      this.classList.add(WeekPageClassList.planDayOver);
    });
    day.addEventListener('dragleave', function leave() {
      this.classList.remove(WeekPageClassList.planDayOver);
    });
    day.addEventListener('drop', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const currentDay = this.getCurrentDay(e);
      currentDay.classList.remove(WeekPageClassList.planDayOver);

      const dayId = currentDay.dataset[GetAttribute.dayId];
      const planId = this.getDragId();
      if (!dayId || !planId) throw new Error(ErrorsList.noId);
      const plan = this.getPlan(planId);
      const freeDayMinutes = this.getFreeDayMinutes(dayId);
      const freePlanMinutes = this.getFreePlanMinutes(plan);

      this.popup.editorMode();
      if (!this.ifFreeTimeInDay(freeDayMinutes)) {
        this.popup.open(makeBanner(ErrorsList.freeYourWeekTime));
      } else if (!this.ifFreeTimeInPlan(freePlanMinutes)) {
        this.popup.open(makeBanner(ErrorsList.thisPlanIsDist));
      } else {
        this.popup.open(this.makeSliderForDay(dayId, plan, freeDayMinutes, freePlanMinutes));
      }
    });
  }

  private setAddButton() {
    getExistentElementByClass(WeekPageClassList.planAddButton).addEventListener('click', () => {
      if (this.isFreeTimeInWeek()) {
        this.editor.open(Values.minPlanDuration, Values.allWeekMinutes - this.fillWeekTime, EditorMode.newPlanFromWeek);
      } else {
        this.popup.editorMode();
        this.popup.open(makeBanner(ErrorsList.freeYourWeekTime));
      }
    });
  }

  private makePlans() {
    this.planRounds = [];
    this.planRounds = this.allPlans.map((plan) => {
      return new PlanRound(plan);
    });
  }

  private setPlanDistTime() {
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
    setTimeout(() => {
      getExistentElementByClass(WeekPageClassList.planAddButton).classList.add(BaseClassList.scaleNormal);
      getExistentElementByClass(WeekPageClassList.planRemoveZone).classList.add(BaseClassList.scaleNormal);
      getExistentElementByClass(WeekPageClassList.weekLine).childNodes.forEach((val) => {
        if (val instanceof HTMLDivElement) val.classList.add(BaseClassList.scaleNormal);
      });
      const rounds = document.querySelectorAll(`.${PlanRoundClassList.planRound}`);
      rounds.forEach((val) => {
        if (val instanceof HTMLDivElement) val.classList.add(BaseClassList.scaleNormal);
      });
      const days = document.querySelectorAll(`.${WeekPageClassList.planDayLine}`);
      days.forEach((day) => {
        if (day instanceof HTMLDivElement) {
          day.childNodes.forEach((val) => {
            if (val instanceof HTMLDivElement) val.classList.add(BaseClassList.scaleNormal);
          });
        }
      });
    }, 0);
  }

  private fillPlansFields() {
    const bigZone = getExistentElementByClass(WeekPageClassList.weekFieldsBig);
    const smallZone = getExistentElementByClass(WeekPageClassList.weekFieldsSmall);
    const maxRoundSize = bigZone.clientWidth * PlanRoundConfig.maxSizeK;

    this.planRounds.forEach((round, ind) => {
      const timePer = round.planInfo.duration / (PlanRoundConfig.maxProcDur - PlanRoundConfig.minProcDur);
      let width = (maxRoundSize - PlanRoundConfig.minRoundSize) * timePer + PlanRoundConfig.minRoundSize;
      if (width < PlanRoundConfig.minRoundSize) width = PlanRoundConfig.minRoundSize;
      if (width > maxRoundSize) width = maxRoundSize;

      round.setWidth(width);
      const roundDiv = this.addRoundListener(round);

      (ind % 2 === 0 ? bigZone : smallZone).append(roundDiv);
    });
  }

  private addRoundListener(round: PlanRound) {
    const distTime = this.allPlansDist[round.planInfo._id] || 0;
    const roundDiv = round.draw();
    round.paintRound(distTime);
    roundDiv.addEventListener('click', () => {
      this.editor.open(
        distTime,
        round.planInfo.duration + Values.allWeekMinutes - this.fillWeekTime,
        EditorMode.editWeekPlan,
        round.planInfo
      );
    });
    const days = getExistentElementByClass(WeekPageClassList.planDaysContainer);
    const bin = getExistentElementByClass(WeekPageClassList.planRemoveZone);
    roundDiv.addEventListener('dragstart', function dragstart(e) {
      const { icon, center } = makeRoundIcon(this);
      if (e.dataTransfer) e.dataTransfer.setDragImage(icon, center, center);
      this.classList.add(PlanRoundClassList.planRoundDrag);
      bin.classList.add(WeekPageClassList.planRemoveZoneDrag);
      days.classList.add(WeekPageClassList.planDaysContainerDrag);
    });
    roundDiv.addEventListener('dragend', function dragend() {
      this.classList.remove(PlanRoundClassList.planRoundDrag);
      bin.classList.remove(WeekPageClassList.planRemoveZoneDrag);
      days.classList.remove(WeekPageClassList.planDaysContainerDrag);
    });
    return roundDiv;
  }

  private fillDays() {
    const daysArr = document.querySelectorAll(`.${WeekPageClassList.planDay}`);
    daysArr.forEach((day, ind) => {
      if (day.firstChild instanceof HTMLElement) {
        const sortDay = sortAllPlans(this.weekDistribution[ind]);
        const fillHours = this.fillLine(day.firstChild, sortDay, Values.allDayMinutes, true);
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
      [section.style.backgroundColor] = getColors(val.color);
      line.append(section);
      return acc + val.duration;
    }, 0);
    return fullMinutes;
  }

  private fillWeekLine() {
    const weekLine = getExistentElementByClass(WeekPageClassList.weekLine);
    const sortWeek = sortAllPlans(this.allPlans);
    const fillWeekTime = this.fillLine(weekLine, sortWeek, Values.allWeekMinutes, false);
    this.fillWeekTime = fillWeekTime;

    getExistentElementByClass(WeekPageClassList.infoTextValue).innerText = minToHour(fillWeekTime);
    getExistentElementByClass(WeekPageClassList.planAddButtonValue).innerText = minToHour(
      Values.allWeekMinutes - fillWeekTime
    );
  }

  private async setWeekInfo() {
    const weekInfo: WeekInfo = await Promise.all([Api.getAllPlans(), Api.getWeekDistribution()]);
    [this.allPlans, this.weekDistribution] = weekInfo;
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    await this.setWeekInfo();

    this.makePlans();

    const container = createNewElement('section', WeekPageClassList.planContainer);

    container.append(
      this.header.draw(PagesList.planPage, NavButtons.week, this.layout.makeInfoText(InnerText.allWeekHours)),
      this.layout.makeWeekLine(),
      this.layout.makePlanBody()
    );
    return container;
  }

  public async draw() {
    try {
      const container = getExistentElementByClass(MainClassList.mainContainer);
      await this.animatedFilledPageAppend(container);

      this.fillWeekLine();
      this.setPlanDistTime();
      this.fillPlansFields();
      this.fillDays();
      this.showElements();
      this.setAddButton();
      this.addListenersToAllDays(this.addDayListener);
    } catch (error) {
      this.goTo(RoutsList.loginPage);
    }
  }
}

export default PlanPage;
