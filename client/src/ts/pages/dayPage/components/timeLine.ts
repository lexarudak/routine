/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import Api from '../../../api';
import { GetAttribute, SetAttribute } from '../../../base/enums/attributes';
import { ClassList } from '../../../base/enums/classList';
import ErrorsList from '../../../base/enums/errorsList';
import Values from '../../../base/enums/values';
import {
  createNewElement,
  getExistentElementByClass,
  loginRedirect,
  makeRoundIcon,
  minToPx,
  pxToMin,
} from '../../../base/helpers';
import { DistDayPlan, Plan } from '../../../base/interface';
import { GoToFn } from '../../../base/types';
import defaultPlan from '../../planPage/components/defaultPlan';
import TimelineDiv from './timelineDiv';

class Timeline {
  goTo: GoToFn;

  sensor: HTMLDivElement;

  showLine: HTMLDivElement;

  width = 0;

  dayId = '';

  plan: Plan = defaultPlan;

  round: HTMLDivElement | undefined;

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

  private getCursorX(e: DragEvent) {
    const viewWidth = window.innerWidth;
    const cursor = e.pageX - (viewWidth - this.width) / 2;
    if (cursor < 0) return 0;
    if (cursor > this.width - minToPx(this.width, Values.minPlanDuration))
      return this.width - minToPx(this.width, Values.minPlanDuration);
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

  private setCurrentZone(point: number) {
    const cursorMin = pxToMin(this.width, point);

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
      const cursor = this.getCursorX(e);
      this.setCurrentZone(cursor);
      if (this.dragInfo.currentZone.freeZone) {
        this.appendDiv(this.plan);
      } else {
        this.removeDiv();
      }
    }
  }

  private setCurrentDivTimeInterval(startMin: number, durMin: number) {
    this.dragInfo.currentDiv.fromMin = startMin;
    this.dragInfo.currentDiv.toMin = startMin + durMin;
  }

  private getDistPlans() {
    return this.distPlans;
  }

  private appendDiv(plan: Plan) {
    if (plan.duration >= Values.minPlanDuration) {
      const currentDiv = new TimelineDiv(
        this.width,
        plan,
        this.getDistPlans.bind(this),
        this.updateDistPlans.bind(this),
        this.pushToServer.bind(this),
        this.goTo,
        this.paintRound.bind(this)
      );

      const newDiv = currentDiv.draw();

      newDiv.addEventListener('dragstart', (e) => {
        console.log(currentDiv);
        this.startMove(e, currentDiv.fromMin, currentDiv.toMin);
      });

      newDiv.addEventListener('dragend', async (e) => {
        await this.stopMove(e);
      });

      newDiv.classList.add(ClassList.timelineDivFake);
      this.currentDiv = currentDiv;
      this.currentDivHTML = newDiv;

      const old = this.showLine.querySelector(`.${ClassList.timelineDivFake}`);
      if (old) old.remove();
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
    if (this.plan) return Math.min(this.plan.duration, this.dragInfo.currentZone.endMin - startMin);
    return 0;
  }

  private addListenerEnter(timelineDiv: HTMLDivElement) {
    timelineDiv.addEventListener('dragenter', (e) => {
      console.log('enter');
      e.preventDefault();
      e.stopPropagation();
      const cursor = this.getCursorX(e);
      this.setCurrentZone(cursor);
      if (this.dragInfo.currentZone.freeZone) {
        if (this.plan) this.appendDiv(this.plan);
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
      const startMin = pxToMin(this.width, startPx);

      this.checkZone(e, startMin);

      const divDurMin = this.setDivWidth(startMin);
      this.setCurrentDivTimeInterval(startMin, divDurMin);
      if (this.currentDiv) {
        this.currentDiv.showDiv(startMin, divDurMin);
        this.currentDiv.showTimeInterval(startMin, divDurMin);
      }
    });
  }

  private addListenerLeave(timelineDiv: HTMLDivElement) {
    timelineDiv.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.currentDivHTML instanceof HTMLDivElement) this.currentDivHTML.remove();
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
      this.paintRound(this.round, this.plan);
      this.currentDivHTML.setAttribute(SetAttribute.from, newDistPlan.from.toString());
      this.currentDivHTML.classList.remove(ClassList.timelineDivFake);
      this.currentDiv = undefined;
      this.currentDivHTML = undefined;
      try {
        await this.pushToServer();
      } catch (error) {
        loginRedirect(error, this.goTo);
      }
    }
  }

  private dropSmallPlan() {
    if (this.currentDivHTML instanceof HTMLDivElement) {
      const { fromMin } = this.dragInfo.currentDiv;
      const { toMin } = this.dragInfo.currentDiv;
      if (toMin - fromMin < Values.minPlanDuration) {
        this.dragInfo.currentDiv.fromMin = toMin - Values.minPlanDuration;
        if (this.currentDiv) {
          this.currentDiv.showDiv(this.dragInfo.currentDiv.fromMin, Values.minPlanDuration);
        }
      }
    }
  }

  private paintRound(round: HTMLElement | undefined, plan: Plan) {
    if (round) {
      const allTime = this.allDayPlans.filter((plans) => plans._id === plan._id)[0].duration;
      const noDistPlan = this.notDistPlans.filter((plans) => plans._id === plan._id)[0];
      const blur = round.childNodes[1];
      if (blur instanceof HTMLElement) {
        blur.style.height = `${100 * (1 - (noDistPlan ? noDistPlan.duration : plan.duration) / allTime)}%`;
        // console.log(noDistPlan, blur.style.height);
      }
    }
  }

  private reduceNoDistPlan() {
    this.plan.duration -= this.dragInfo.currentDiv.toMin - this.dragInfo.currentDiv.fromMin;
  }

  private increaseNoDistPlan() {
    this.plan.duration += this.dragInfo.currentDiv.toMin - this.dragInfo.currentDiv.fromMin;
  }

  private updateDistPlans(distPlans: DistDayPlan[]) {
    this.distPlans = distPlans;
  }

  private fillTimeline() {
    this.showLine.innerHTML = '';
    this.distPlans.forEach((distPlan) => {
      const { _id, color, title, text, from, to } = distPlan;
      const noDistPlan = this.notDistPlans.filter((plan) => plan._id === _id)[0];
      const plan = { _id, color, title, text, duration: 0 };
      if (!noDistPlan) this.notDistPlans.push(plan);

      const currentDiv = new TimelineDiv(
        this.width,
        noDistPlan || plan,
        this.getDistPlans.bind(this),
        this.updateDistPlans.bind(this),
        this.pushToServer.bind(this),
        this.goTo,
        this.paintRound.bind(this)
      );

      const newDiv = currentDiv.draw();

      newDiv.addEventListener('dragstart', (e) => {
        this.startMove(e, currentDiv.fromMin, currentDiv.toMin);
      });

      newDiv.addEventListener('dragend', async (e) => {
        await this.stopMove(e);
      });

      this.showLine.append(newDiv);
      const planDur = to - from;
      currentDiv.showDiv(from, planDur);
      currentDiv.showTimeInterval(from, planDur);
      newDiv.setAttribute(SetAttribute.from, from.toString());
    });
  }

  private startMove(e: DragEvent, from: number, to: number) {
    const { target } = e;
    if (!(target instanceof HTMLDivElement)) return;
    this.setRoundForDrag(e, target);
    console.log('FROM WORKS', from);
    this.setDragInfoCurrentDiv(from, to);
    this.increaseNoDistPlan();
    this.deleteFromDistPlan(target.dataset[GetAttribute.from]);

    setTimeout(() => {
      this.sensor.classList.add(ClassList.timelineSensorActive);
      target.style.display = 'none';
    }, 0);
  }

  private async stopMove(e: DragEvent) {
    const { target } = e;
    this.sensor.classList.remove(ClassList.timelineSensorActive);
    getExistentElementByClass(ClassList.planRoundDrag).classList.remove(ClassList.planRoundDrag);
    if (target instanceof HTMLElement) {
      target.remove();
    }
    this.paintRound(this.round, this.plan);
    if (e.dataTransfer) {
      if (e.dataTransfer.dropEffect === 'none') {
        await this.pushToServer();
      }
    }
  }

  private setRoundForDrag(e: DragEvent, target: HTMLElement) {
    const roundId = target.dataset[GetAttribute.planTimelineId];
    const round = document.querySelector(`div[data-plan-id="${roundId}"]`);
    if (!(round instanceof HTMLDivElement)) return;
    this.getPlanFromDiv(round);
    this.round = round;
    const { icon, center } = makeRoundIcon(round);
    if (e.dataTransfer) e.dataTransfer.setDragImage(icon, center, center);
    round.classList.add(ClassList.planRoundDrag);
  }

  private setDragInfoCurrentDiv(from: number, to: number) {
    console.log('from and to', from, to);
    this.dragInfo.currentDiv.fromMin = from;
    this.dragInfo.currentDiv.toMin = to;
  }

  private deleteFromDistPlan(fromId: string | undefined) {
    console.log('before delete', this.distPlans);
    if (fromId) this.distPlans = this.distPlans.filter((disPlan) => disPlan.from.toString() !== fromId);
    console.log('after delete', this.distPlans);
    // this.
  }

  public setTimeline(notDistPlans: Plan[], distPlans: DistDayPlan[], allDayPlans: Plan[], dayId: string) {
    this.width = this.sensor.clientWidth;
    this.notDistPlans = notDistPlans;
    this.distPlans = distPlans;
    this.allDayPlans = allDayPlans;
    this.dayId = dayId;
    this.fillTimeline();
  }

  public draw() {
    const timelineDiv: HTMLDivElement = createNewElement('div', ClassList.timeline);
    timelineDiv.append(this.showLine, this.sensor);
    return timelineDiv;
  }
}

export default Timeline;
