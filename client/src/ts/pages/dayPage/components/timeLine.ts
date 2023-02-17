/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import { GetAttribute, SetAttribute } from '../../../base/enums/attributes';
import { ClassList } from '../../../base/enums/classList';
import ErrorsList from '../../../base/enums/errorsList';
import Values from '../../../base/enums/values';
import { createNewElement, minToHourTimeline } from '../../../base/helpers';
import { DistDayPlan, Plan } from '../../../base/interface';
import defaultPlan from '../../planPage/components/defaultPlan';
import TimelineDiv from './timelineDiv';
import TimelineMode from './timelineMode';

class Timeline {
  timelineHTML: HTMLDivElement;

  width = 0;

  plan: Plan = defaultPlan;

  round: HTMLDivElement | undefined;

  mode = TimelineMode.noMode;

  minPlanInPx = 0;

  currentDiv: TimelineDiv | undefined;

  currentDivHTML: HTMLDivElement | undefined;

  notDistPlans: Plan[] = [];

  distPlans: DistDayPlan[] = [];

  allDayPlans: Plan[] = [];

  dragInfo = {
    currentDiv: {
      fromMin: 0,
      toMin: 0,
    },
    currentZone: {
      freeZone: true,
      startMin: 0,
      endMin: <number>Values.allDayMinutes,
    },
  };

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

  private pxToMin(px: number) {
    return Math.floor((px / this.width) * Values.allDayMinutes);
  }

  private minToPx(minutes: number) {
    return (this.width / Values.allDayMinutes) * minutes;
  }

  private getCursorX(e: DragEvent) {
    const viewWidth = window.innerWidth;
    const cursor = e.pageX - (viewWidth - this.width) / 2;
    if (cursor < 0) return 0;
    if (cursor > this.width - this.minToPx(Values.minPlanDuration))
      return this.width - this.minToPx(Values.minPlanDuration);
    return cursor;
  }

  private setStart(cursorMin: number, distDayPlan: DistDayPlan) {
    const { from, to } = distDayPlan;
    const { startMin } = this.dragInfo.currentZone;
    if (from <= cursorMin && from > startMin) {
      this.dragInfo.currentZone.startMin = from;
    }
    console.log(from <= cursorMin && from > startMin, '1');
    if (to <= cursorMin && to > startMin) {
      this.dragInfo.currentZone.startMin = to;
    }
    console.log(to <= cursorMin && to > startMin, '2');
    console.log('from:', from, 'to:', to, 'cursor:', cursorMin, 'start:', this.dragInfo.currentZone.startMin);
  }

  private setEnd(cursorMin: number, distDayPlan: DistDayPlan) {
    const { from, to } = distDayPlan;
    const { endMin } = this.dragInfo.currentZone;
    if (to > cursorMin && to < endMin) this.dragInfo.currentZone.endMin = to;
    if (from > cursorMin && from < endMin) this.dragInfo.currentZone.endMin = from;
  }

  private setZoneType(cursorMin: number, distDayPlan: DistDayPlan) {
    const { from, to } = distDayPlan;
    if (
      (from <= cursorMin && to > cursorMin) ||
      this.dragInfo.currentZone.endMin - this.dragInfo.currentZone.startMin < Values.minPlanDuration
    ) {
      this.dragInfo.currentZone.freeZone = false;
    }
  }

  private setCurrentZone(e: DragEvent) {
    const cursor = this.getCursorX(e);
    const cursorMin = this.pxToMin(cursor);

    this.dragInfo.currentZone.startMin = 0;
    this.dragInfo.currentZone.endMin = Values.allDayMinutes;
    this.dragInfo.currentZone.freeZone = true;

    this.distPlans.forEach((plan) => {
      console.log('plans on timeline', plan);
      this.setStart(cursorMin, plan);
      this.setEnd(cursorMin, plan);
      this.setZoneType(cursorMin, plan);
    });

    console.log('set zone', this.dragInfo.currentZone);
  }

  private checkZone(e: DragEvent, cursorMin: number) {
    if (cursorMin >= this.dragInfo.currentZone.endMin || cursorMin < this.dragInfo.currentZone.startMin) {
      console.log('check');
      this.setCurrentZone(e);
      if (this.dragInfo.currentZone.freeZone) {
        this.appendDiv();
      } else {
        this.removeDiv();
        console.log('remove');
      }
    }
  }

  private setCurrentDivTimeInterval(startMin: number, durMin: number) {
    this.dragInfo.currentDiv.fromMin = startMin;
    this.dragInfo.currentDiv.toMin = startMin + durMin;
  }

  private appendDiv() {
    const currentDiv = new TimelineDiv(this.plan);
    const newDiv = currentDiv.draw();
    newDiv.classList.add(ClassList.timelineDivFake);
    this.currentDiv = currentDiv;
    this.currentDivHTML = newDiv;
    this.timelineHTML.append(this.currentDivHTML);
  }

  private removeDiv() {
    if (this.currentDivHTML instanceof HTMLDivElement) this.currentDivHTML.remove();
  }

  private setDivWidth(startMin: number) {
    return Math.min(this.plan.duration, this.dragInfo.currentZone.endMin - startMin);
  }

  private addListenerEnter(timelineDiv: HTMLDivElement) {
    timelineDiv.addEventListener('dragenter', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.setCurrentZone(e);
      if (this.dragInfo.currentZone.freeZone) {
        this.appendDiv();
      } else {
        this.removeDiv();
      }
    });
  }

  private addListenerOver(timelineDiv: HTMLDivElement) {
    timelineDiv.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const startPx = this.getCursorX(e);
      const startMin = this.pxToMin(startPx);
      const endMin = this.setDivWidth(startMin);
      this.checkZone(e, startMin);
      const endPx = this.minToPx(endMin);
      this.setCurrentDivTimeInterval(startMin, endMin);
      if (this.currentDiv) {
        this.currentDiv.showFake(startPx, endPx);
        this.currentDiv.showTimeInterval(minToHourTimeline(startMin), minToHourTimeline(startMin + endMin), endPx > 47);
      }
    });
  }

  private addListenerLeave(timelineDiv: HTMLDivElement) {
    timelineDiv.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.currentDivHTML instanceof HTMLDivElement) this.currentDivHTML.remove();
      console.log('leave');
    });
  }

  private addListenerDrop(timelineDiv: HTMLDivElement) {
    timelineDiv.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dropSmallPlan();
      this.drop();
    });
  }

  private drop() {
    if (this.currentDivHTML instanceof HTMLDivElement) {
      const { _id, color, title, text } = this.plan;
      const newDistPlan: DistDayPlan = {
        _id,
        color,
        title,
        text,
        from: this.dragInfo.currentDiv.fromMin,
        to: this.dragInfo.currentDiv.toMin,
      };
      this.distPlans.push(newDistPlan);
      this.reduceNoDistPlan();
      this.paintRound();
      this.currentDivHTML.setAttribute(SetAttribute.from, newDistPlan.from.toString());
      this.currentDivHTML.classList.remove(ClassList.timelineDivFake);
      this.currentDiv = undefined;
      this.currentDivHTML = undefined;
      console.log(this.distPlans);
    }
  }

  private dropSmallPlan() {
    const { fromMin } = this.dragInfo.currentDiv;
    const { toMin } = this.dragInfo.currentDiv;
    console.log(fromMin, toMin);
    if (toMin - fromMin < Values.minPlanDuration) {
      this.dragInfo.currentDiv.fromMin = toMin - Values.minPlanDuration;
      console.log(this.dragInfo.currentDiv.fromMin, this.dragInfo.currentDiv.toMin);
      if (this.currentDiv) {
        console.log(this.currentDiv);
        this.currentDiv.showFake(this.minToPx(this.dragInfo.currentDiv.fromMin), this.minPlanInPx);
      }
    }
  }

  private paintRound() {
    if (this.round) {
      const allTime = this.allDayPlans.filter((plan) => plan._id === this.plan._id)[0].duration;
      const noDistTime = this.notDistPlans.filter((plan) => plan._id === this.plan._id)[0].duration;
      const blur = this.round.childNodes[1];
      if (blur instanceof HTMLElement) {
        blur.style.height = `${100 * (1 - noDistTime / allTime)}%`;
      }
    }
  }

  private reduceNoDistPlan() {
    this.plan.duration -= this.dragInfo.currentDiv.toMin - this.dragInfo.currentDiv.fromMin;
  }

  public setTimeline(notDistPlans: Plan[], distPlans: DistDayPlan[], allDayPlans: Plan[]) {
    this.width = this.timelineHTML.clientWidth;
    this.notDistPlans = notDistPlans;
    this.distPlans = distPlans;
    this.allDayPlans = allDayPlans;
    this.minPlanInPx = this.minToPx(Values.minPlanDuration);
    console.log('load dist', this.distPlans);
    console.log('load noDist', this.notDistPlans);
  }

  public draw() {
    return this.timelineHTML;
  }
}

export default Timeline;
