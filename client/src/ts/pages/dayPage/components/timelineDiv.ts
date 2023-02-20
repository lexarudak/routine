/* eslint-disable no-underscore-dangle */
import { ClassList } from '../../../base/enums/classList';
import Values from '../../../base/enums/values';
import {
  createNewElement,
  getExistentElementByClass,
  loginRedirect,
  minToHourTimeline,
  minToPx,
  pxToMin,
} from '../../../base/helpers';
import { DistDayPlan, Plan } from '../../../base/interface';
import { GoToFn } from '../../../base/types';
import colorsAndFonts from '../../../components/colorsAndFonts';

class TimelineDiv {
  pxToMin: (px: number) => number;

  minToPx: (minutes: number) => number;

  pushToServer: () => Promise<void>;

  goTo: GoToFn;

  paintRound: (round: HTMLElement | undefined, plan: Plan) => void;

  timelineWidthPx: number;

  distPlans: DistDayPlan[];

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
    distPlans: DistDayPlan[],
    pushToServer: () => Promise<void>,
    goTo: GoToFn,
    paintRound: (round: HTMLElement | undefined, plan: Plan) => void
  ) {
    this.goTo = goTo;
    this.pushToServer = pushToServer;
    this.paintRound = paintRound;
    this.timelineWidthPx = timelineWidthPx;
    this.distPlans = distPlans;
    this.plan = plan;
    this.from = createNewElement('div', ClassList.timelineDivFrom);
    this.to = createNewElement('div', ClassList.timelineDivTo);
    this.name = createNewElement('div', ClassList.timelineDivName);
    this.name.innerText = this.plan.title;
    this.div = this.makeDiv();
    this.pxToMin = pxToMin.bind(this, this.timelineWidthPx);
    this.minToPx = minToPx.bind(this, this.timelineWidthPx);
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
    const sensor = getExistentElementByClass(ClassList.timelineSensor);
    const main = getExistentElementByClass(ClassList.mainContainer);
    btn.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      this.move.start = e.clientX;
      console.log('mouse down');
      console.log('mouse down plan', this.plan);
      this.newFromMin = this.fromMin;
      this.newToMin = this.toMin;
      this.div.setAttribute('draggable', 'false');
      this.div.classList.add(ClassList.timelineDivActive);
      sensor.classList.add(ClassList.timelineSensorActive);
      main.classList.add(ClassList.mainContainerNoSelect);
      this.div.classList.add(ClassList.timelineDivFake);
      setZoneFn();

      document.addEventListener('mousemove', resizeFn);

      document.addEventListener(
        'mouseup',
        async (mUEvent) => {
          mUEvent.stopPropagation();
          console.log('mouse up');
          this.div.setAttribute('draggable', 'true');
          this.div.classList.remove(ClassList.timelineDivActive);
          sensor.classList.remove(ClassList.timelineSensorActive);
          main.classList.remove(ClassList.mainContainerNoSelect);
          this.div.classList.remove(ClassList.timelineDivFake);
          document.removeEventListener('mousemove', resizeFn);
          console.log('mouse up plan', this.plan);

          this.plan.duration -= this.fromMin - this.newFromMin;

          this.distPlans.forEach((plan) => {
            if (plan.from === this.fromMin) {
              plan.from = this.newFromMin;
              plan.to = this.newToMin;
            }
          });
          this.fromMin = this.newFromMin;
          this.toMin = this.newToMin;
          const round = document.querySelector(`div[data-plan-id="${this.plan._id}"]`);
          console.log(round);
          if (round instanceof HTMLElement) this.paintRound(round, this.plan);
          console.log('for each DIST PLANS', this.plan.duration);
          try {
            await this.pushToServer();
          } catch (error) {
            loginRedirect(error, this.goTo);
          }
          // console.log('small plan', this.plan, this.plan.duration);
        },
        { once: true }
      );
    });
  }

  private makeDiv() {
    const div: HTMLDivElement = createNewElement('div', ClassList.timelineDiv);
    div.setAttribute('draggable', 'true');
    const left = createNewElement('div', ClassList.timelineDivLeft);
    left.innerText = '<';
    const right = createNewElement('div', ClassList.timelineDivRight);
    right.innerText = '>';

    this.addSizeListener(left, this.leftButtonResize.bind(this), this.setZoneStart.bind(this));
    div.style.backgroundColor = this.plan.color;
    const textColor = colorsAndFonts.get(this.plan.color);
    if (textColor) div.style.color = textColor;

    const body = createNewElement('div', ClassList.timelineDivBody);
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
    if (this.minToPx(durMin) > 55) {
      this.from.style.display = 'flex';
      this.to.style.display = 'flex';
      this.name.style.display = 'flex';
    } else {
      this.from.style.display = 'none';
      this.to.style.display = 'none';
      this.name.style.display = 'none';
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
    const start = this.distPlans.reduce((acc, plan) => {
      if (plan.to <= this.fromMin && plan.to > acc) {
        return plan.to;
      }
      return acc;
    }, 0);
    this.zone.from = start;
  }
}

export default TimelineDiv;
