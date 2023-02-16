/* eslint-disable no-underscore-dangle */
import { GetAttribute } from '../../../base/enums/attributes';
import { ClassList } from '../../../base/enums/classList';
import ErrorsList from '../../../base/enums/errorsList';
import Values from '../../../base/enums/values';
// import Values from '../../../base/enums/values';
import { createNewElement, getExistentElementByClass, minToHourTimeline } from '../../../base/helpers';
import { Plan } from '../../../base/interface';
import defaultPlan from '../../planPage/components/defaultPlan';
import TimelineDiv from './timelineDiv';
import TimelineMode from './timelineMode';

class Timeline {
  timelineHTML: HTMLDivElement;

  width = 0;

  plan: Plan = defaultPlan;

  mode = TimelineMode.noMode;

  currentDiv = new TimelineDiv(this.plan);

  notDistPlans: Plan[] = [];

  constructor() {
    this.timelineHTML = this.makeTimelineHTML();
  }

  public set value(mode: TimelineMode) {
    this.mode = mode;
  }

  private makeTimelineHTML() {
    const timelineDiv: HTMLDivElement = createNewElement('div', ClassList.timeline);
    this.addListenerEnter(timelineDiv);
    this.addListenerOver(timelineDiv);
    this.addListenerLeave(timelineDiv);
    this.addListenerDrop(timelineDiv);
    return timelineDiv;
  }

  public getPlanFromDiv(div: HTMLElement) {
    const id = div.dataset[GetAttribute.planId];
    if (!id) throw new Error(ErrorsList.noId);
    [this.plan] = this.notDistPlans.filter((plan) => plan._id === id);
  }

  private getTimeFrom(px: number) {
    let min = Math.floor((px / this.width) * Values.allDayMinutes);
    if (min < 0 || min > Values.allDayMinutes) min = Values.allDayMinutes;
    const time = minToHourTimeline(min);
    return time;
  }

  private getPxFromMinutes(minutes: number) {
    return Math.floor((this.width / Values.allDayMinutes) * minutes);
  }

  private getCursorX(e: DragEvent) {
    const viewWidth = window.innerWidth;
    return e.pageX - (viewWidth - this.width) / 2;
  }

  private addListenerEnter(timelineDiv: HTMLDivElement) {
    timelineDiv.addEventListener('dragenter', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const currentDiv = new TimelineDiv(this.plan);
      const newDiv = currentDiv.draw();
      newDiv.classList.add(ClassList.timelineDivFake);
      this.currentDiv = currentDiv;
      this.timelineHTML.append(newDiv);
    });
  }

  private addListenerLeave(timelineDiv: HTMLDivElement) {
    timelineDiv.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log('leave');
    });
  }

  private addListenerDrop(timelineDiv: HTMLDivElement) {
    timelineDiv.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      getExistentElementByClass(ClassList.timelineDivFake).classList.remove(ClassList.timelineDivFake);
      console.log('drop');
    });
  }

  private addListenerOver(timelineDiv: HTMLDivElement) {
    timelineDiv.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const startPx = this.getCursorX(e);
      const endPx = this.getPxFromMinutes(this.plan.duration);
      this.currentDiv.showFake(startPx, endPx);
      this.currentDiv.showTimeInterval(this.getTimeFrom(startPx), this.getTimeFrom(startPx + endPx), endPx > 47);
    });
  }

  public setTimeline(notDistPlans: Plan[]) {
    this.width = this.timelineHTML.clientWidth;
    this.notDistPlans = notDistPlans;
  }

  public draw() {
    return this.timelineHTML;
  }
}

export default Timeline;
