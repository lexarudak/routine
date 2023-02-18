/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import Api from '../../../api';
import { GetAttribute, SetAttribute } from '../../../base/enums/attributes';
import { ClassList } from '../../../base/enums/classList';
import ErrorsList from '../../../base/enums/errorsList';
import Values from '../../../base/enums/values';
import { createNewElement, loginRedirect } from '../../../base/helpers';
import { DistDayPlan, Plan } from '../../../base/interface';
import { GoToFn } from '../../../base/types';
import defaultPlan from '../../planPage/components/defaultPlan';
import TimelineDiv from './timelineDiv';
import TimelineMode from './timelineMode';

class Timeline {
  goTo: GoToFn;

  sensor: HTMLDivElement;

  showLine: HTMLDivElement;

  width = 0;

  dayId = '';

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
    canPush: true,
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

  constructor(goTo: GoToFn) {
    this.goTo = goTo;
    this.sensor = this.makeSensor();
    this.showLine = createNewElement('div', ClassList.timelineShow);
  }

  public set value(mode: TimelineMode) {
    this.mode = mode;
  }

  private makeSensor() {
    const sensor: HTMLDivElement = createNewElement('div', ClassList.timelineSensor);
    this.addListenerEnter(sensor);
    this.addListenerOver(sensor);
    this.addListenerLeave(sensor);
    this.addListenerDrop(sensor);

    return sensor;
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
    if (to <= cursorMin && to > startMin) {
      this.dragInfo.currentZone.startMin = to;
    }
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
      this.setStart(cursorMin, plan);
      this.setEnd(cursorMin, plan);
      this.setZoneType(cursorMin, plan);
    });
  }

  private checkZone(e: DragEvent, cursorMin: number) {
    if (cursorMin >= this.dragInfo.currentZone.endMin || cursorMin < this.dragInfo.currentZone.startMin) {
      console.log('check');
      this.setCurrentZone(e);
      if (this.dragInfo.currentZone.freeZone) {
        this.appendDiv(this.plan);
      } else {
        console.log('remove');
        this.removeDiv();
      }
    }
  }

  private setCurrentDivTimeInterval(startMin: number, durMin: number) {
    this.dragInfo.currentDiv.fromMin = startMin;
    this.dragInfo.currentDiv.toMin = startMin + durMin;
  }

  private appendDiv(plan: Plan) {
    if (plan.duration >= Values.minPlanDuration) {
      const currentDiv = new TimelineDiv(plan);
      const newDiv = currentDiv.draw();
      newDiv.classList.add(ClassList.timelineDivFake);
      this.currentDiv = currentDiv;
      this.currentDivHTML = newDiv;
      this.showLine.append(this.currentDivHTML);
    }
  }

  private removeDiv() {
    if (this.currentDivHTML instanceof HTMLDivElement) {
      this.currentDivHTML.remove();
      this.currentDivHTML = undefined;
    }
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
        this.appendDiv(this.plan);
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

      this.checkZone(e, startMin);

      const divDurMin = this.setDivWidth(startMin);
      const divWidthPx = this.minToPx(divDurMin);
      this.setCurrentDivTimeInterval(startMin, divDurMin);
      if (this.currentDiv) {
        this.currentDiv.showFake(startPx, divWidthPx);
        this.currentDiv.showTimeInterval(startMin, divDurMin, divWidthPx > 47);
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
    timelineDiv.addEventListener('drop', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.dropSmallPlan();
      await this.drop();
    });
  }

  private async pushToServer() {
    const dayDistribution = this.distPlans.map((plan) => {
      const { _id, from, to } = plan;
      return { planId: _id, from, to };
    });
    const dayOfWeek = Number(this.dayId);
    const body = { dayOfWeek, dayDistribution };
    if (this.dragInfo.canPush) {
      this.dragInfo.canPush = false;
      await Api.pushDayDistribution(body);
      this.dragInfo.canPush = true;
    } else {
      setTimeout(async () => {
        this.dragInfo.canPush = false;
        await Api.pushDayDistribution(body);
        this.dragInfo.canPush = true;
      }, 2000);
    }
  }

  private async drop() {
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
      try {
        await this.pushToServer();
      } catch (error) {
        loginRedirect(error, this.goTo);
      }
      // console.log('drop no dist', this.notDistPlans);
      // console.log('drop dist', this.distPlans);
    }
  }

  private dropSmallPlan() {
    if (this.currentDivHTML instanceof HTMLDivElement) {
      const { fromMin } = this.dragInfo.currentDiv;
      const { toMin } = this.dragInfo.currentDiv;
      if (toMin - fromMin < Values.minPlanDuration) {
        this.dragInfo.currentDiv.fromMin = toMin - Values.minPlanDuration;
        if (this.currentDiv) {
          this.currentDiv.showFake(this.minToPx(this.dragInfo.currentDiv.fromMin), this.minPlanInPx);
        }
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

  private fillTimeline() {
    this.showLine.innerHTML = '';
    console.log(this.distPlans);
    this.distPlans.forEach((distPlan) => {
      const { _id, color, title, text, from, to } = distPlan;
      const plan = { _id, color, title, text, duration: to - from };
      console.log(plan);
      this.appendDiv(plan);
      const planDur = to - from;
      this.currentDiv?.showFake(this.minToPx(from), this.minToPx(planDur));
      this.currentDiv?.showTimeInterval(from, planDur, this.minToPx(planDur) > 47);
      this.currentDivHTML?.setAttribute(SetAttribute.from, from.toString());
      this.currentDivHTML?.classList.remove(ClassList.timelineDivFake);
      this.currentDiv = undefined;
      this.currentDivHTML = undefined;
    });
  }

  public setTimeline(notDistPlans: Plan[], distPlans: DistDayPlan[], allDayPlans: Plan[], dayId: string) {
    this.width = this.sensor.clientWidth;
    this.notDistPlans = notDistPlans;
    this.distPlans = distPlans;
    this.allDayPlans = allDayPlans;
    this.dayId = dayId;
    this.minPlanInPx = this.minToPx(Values.minPlanDuration);
    this.fillTimeline();
  }

  public draw() {
    const timelineDiv: HTMLDivElement = createNewElement('div', ClassList.timeline);
    timelineDiv.append(this.showLine, this.sensor);
    return timelineDiv;
  }
}

export default Timeline;
