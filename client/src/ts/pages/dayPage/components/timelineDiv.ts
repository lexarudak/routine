/* eslint-disable no-underscore-dangle */
import { SetAttribute } from '../../../base/enums/attributes';
import { MainClassList, TimelineClassList } from '../../../base/enums/classList';
import Values from '../../../base/enums/values';
import {
  createNewElement,
  getColors,
  getExistentElementByClass,
  loginRedirect,
  minToHourTimeline,
  minToPx,
  pxToMin,
} from '../../../base/helpers';
import { DistDayPlan, Plan } from '../../../base/interface';
import { GoToFn } from '../../../base/types';

class TimelineDiv {
  pxToMin: (px: number) => number;

  minToPx: (minutes: number) => number;

  pushToServer: () => Promise<void>;

  goTo: GoToFn;

  paintRound: (round: HTMLElement | undefined, plan: Plan) => void;

  timelineWidthPx: number;

  getDistPlans: () => DistDayPlan[];

  updateDistPlans: (distPlans: DistDayPlan[]) => void;

  div: HTMLDivElement;

  from: HTMLDivElement;

  to: HTMLDivElement;

  plan: Plan;

  name: HTMLDivElement;

  fromMin = 0;

  newToMin = 0;

  newFromMin = 0;

  toMin = 0;

  zone = { from: 0, to: <number>Values.allDayMinutes };

  move = {
    start: 0,
  };

  constructor(
    timelineWidthPx: number,
    plan: Plan,
    getDistPlans: () => DistDayPlan[],
    updateDistPlans: (distPlans: DistDayPlan[]) => void,
    pushToServer: () => Promise<void>,
    goTo: GoToFn,
    paintRound: (round: HTMLElement | undefined, plan: Plan) => void
  ) {
    this.goTo = goTo;
    this.pushToServer = pushToServer;
    this.paintRound = paintRound;
    this.timelineWidthPx = timelineWidthPx;
    this.getDistPlans = getDistPlans;
    this.updateDistPlans = updateDistPlans;
    this.plan = plan;
    this.from = createNewElement('div', TimelineClassList.timelineDivFrom);
    this.to = createNewElement('div', TimelineClassList.timelineDivTo);
    this.name = createNewElement('div', TimelineClassList.timelineDivName);
    this.name.innerText = this.plan.title;
    this.div = this.makeDiv();
    this.pxToMin = pxToMin.bind(this, this.timelineWidthPx);
    this.minToPx = minToPx.bind(this, this.timelineWidthPx);
  }

  private rightButtonResize(e: MouseEvent) {
    const dur = this.toMin - this.fromMin;
    const maxValue = Math.min(this.zone.to, this.fromMin + dur + this.plan.duration);
    const minDifferenceMin = this.pxToMin(e.clientX - this.move.start); //  - | +

    if (this.toMin + minDifferenceMin > maxValue) {
      this.newToMin = maxValue;
      this.showDiv(this.fromMin, this.newToMin - this.fromMin);
    } else if (dur + minDifferenceMin < Values.minPlanDuration) {
      this.newToMin = this.fromMin + Values.minPlanDuration;
      this.showDiv(this.fromMin, Values.minPlanDuration);
    } else {
      this.newToMin = this.toMin + minDifferenceMin;
      this.showDiv(this.fromMin, dur + minDifferenceMin);
    }
  }

  private leftButtonResize(e: MouseEvent) {
    const dur = this.toMin - this.fromMin;
    const minValue = Math.max(this.zone.from, this.fromMin - this.plan.duration);
    const minDifferenceMin = this.pxToMin(this.move.start - e.clientX); //  + | -

    if (this.fromMin - minDifferenceMin < minValue) {
      this.newFromMin = minValue;
      this.showDiv(this.newFromMin, this.toMin - this.newFromMin);
    } else if (dur + minDifferenceMin < Values.minPlanDuration) {
      this.newFromMin = this.toMin - Values.minPlanDuration;
      this.showDiv(this.newFromMin, Values.minPlanDuration);
    } else {
      this.newFromMin = this.fromMin - minDifferenceMin;
      this.showDiv(this.newFromMin, dur + minDifferenceMin);
    }
  }

  private addSizeListener(btn: HTMLElement, resizeFn: (e: MouseEvent) => void, setZoneFn: () => void) {
    const sensor = getExistentElementByClass(TimelineClassList.timelineSensor);
    const main = getExistentElementByClass(MainClassList.mainContainer);

    btn.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.move.start = e.clientX;
      console.log('mouse down');
      this.newFromMin = this.fromMin;
      this.newToMin = this.toMin;
      this.div.setAttribute('draggable', 'false');
      this.div.classList.add(TimelineClassList.timelineDivActive);
      sensor.classList.add(TimelineClassList.timelineSensorActive);
      main.classList.add(MainClassList.mainContainerNoSelect);
      this.div.classList.add(TimelineClassList.timelineDivFake);
      setZoneFn();

      document.addEventListener('mousemove', resizeFn);

      document.addEventListener(
        'mouseup',
        async (mUEvent) => {
          mUEvent.stopPropagation();
          console.log('mouse up');
          this.div.setAttribute('draggable', 'true');
          this.div.classList.remove(TimelineClassList.timelineDivActive);
          sensor.classList.remove(TimelineClassList.timelineSensorActive);
          main.classList.remove(MainClassList.mainContainerNoSelect);
          this.div.classList.remove(TimelineClassList.timelineDivFake);
          document.removeEventListener('mousemove', resizeFn);
          this.updatePlan();
          this.paintRound(this.findRound(this.plan._id), this.plan);

          try {
            await this.pushToServer();
          } catch (error) {
            loginRedirect(error, this.goTo);
          }
        },
        { once: true }
      );
    });
  }

  private findRound(planId: string) {
    const round = document.querySelector(`div[data-plan-id="${planId}"]`);
    if (round instanceof HTMLElement) return round;
    return undefined;
  }

  private updatePlan() {
    this.plan.duration -= this.fromMin - this.newFromMin;
    this.plan.duration -= this.newToMin - this.toMin;

    const distPlans = this.getDistPlans();
    distPlans.forEach((plan) => {
      if (plan.from === this.fromMin) {
        plan.from = this.newFromMin;
        plan.to = this.newToMin;
      }
    });
    this.updateDistPlans(distPlans);
    this.fromMin = this.newFromMin;
    this.toMin = this.newToMin;

    this.div.setAttribute(SetAttribute.from, this.fromMin.toString());
    console.log('from after resize', this.fromMin);
  }

  private makeDiv() {
    const [bgColor, fontColor] = getColors(this.plan.color);
    const div: HTMLDivElement = createNewElement('div', TimelineClassList.timelineDiv);
    div.setAttribute('draggable', 'true');
    div.setAttribute(SetAttribute.planTimelineId, this.plan._id);
    const left = createNewElement('div', TimelineClassList.timelineDivLeft);
    left.innerText = '<';
    const right = createNewElement('div', TimelineClassList.timelineDivRight);
    right.innerText = '>';

    this.addSizeListener(left, this.leftButtonResize.bind(this), this.setZoneStart.bind(this));
    this.addSizeListener(right, this.rightButtonResize.bind(this), this.setZoneEnd.bind(this));
    div.style.color = fontColor;

    const body = createNewElement('div', TimelineClassList.timelineDivBody);
    body.style.backgroundColor = bgColor;
    body.append(left, this.name, right);

    div.append(this.from, body, this.to);
    this.addMoveListener(div);
    return div;
  }

  public showDiv(startMin: number, durMin: number) {
    this.setLeftFromMin(startMin);
    this.setWidthFromDur(durMin);
    this.updateFromView(startMin);
    this.updateToView(startMin + durMin);
    this.updateInfoView(durMin);
  }

  private setLeftFromMin(startMin: number) {
    this.div.style.left = `${this.minToPx(startMin)}px`;
  }

  private setWidthFromDur(durMin: number) {
    this.div.style.width = `${this.minToPx(durMin)}px`;
  }

  public showTimeInterval(fromMin: number, durMin: number) {
    this.fromMin = fromMin;
    this.toMin = fromMin + durMin;
  }

  private updateFromView(fromMin: number) {
    this.from.innerText = minToHourTimeline(fromMin);
  }

  private updateToView(toMin: number) {
    this.to.innerText = minToHourTimeline(toMin);
  }

  private updateInfoView(durMin: number) {
    if (this.minToPx(durMin) > Values.minTimelineBlockWithText) {
      this.div.classList.remove(TimelineClassList.timelineDivHide);
      // this.from.style.display = 'flex';
      // this.to.style.display = 'flex';
      // this.name.style.display = 'flex';
    } else {
      this.div.classList.add(TimelineClassList.timelineDivHide);
      // this.from.style.display = 'none';
      // this.to.style.display = 'none';
      // this.name.style.display = 'none';
    }
  }

  private addMoveListener(block: HTMLElement) {
    block.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      console.log('block fn');
    });
  }

  public draw() {
    return this.div;
  }

  private setZoneStart() {
    const distPlans = this.getDistPlans();
    console.log('set start zone', distPlans);
    const start = distPlans.reduce((acc, plan) => {
      if (plan.to <= this.fromMin && plan.to > acc) {
        return plan.to;
      }
      return acc;
    }, 0);
    this.zone.from = start;
  }

  private setZoneEnd() {
    const distPlans = this.getDistPlans();
    console.log('set end zone', distPlans);
    const end = distPlans.reduce((acc, plan) => {
      if (plan.from >= this.toMin && plan.from < acc) {
        return plan.from;
      }
      return acc;
    }, <number>Values.allDayMinutes);
    this.zone.to = end;
  }
}

export default TimelineDiv;
