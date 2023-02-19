/* eslint-disable no-underscore-dangle */
import { ClassList } from '../../../base/enums/classList';
import Values from '../../../base/enums/values';
import { createNewElement, getExistentElementByClass, minToHourTimeline } from '../../../base/helpers';
import { DistDayPlan, Plan } from '../../../base/interface';
import colorsAndFonts from '../../../components/colorsAndFonts';

class TimelineDiv {
  distPlans: DistDayPlan[];

  div: HTMLDivElement;

  from: HTMLDivElement;

  to: HTMLDivElement;

  plan: Plan;

  name: HTMLDivElement;

  fromMin = 0;

  toMin = 0;

  zone = { from: 0, to: <number>Values.allDayMinutes };

  constructor(plan: Plan, distPlans: DistDayPlan[]) {
    this.distPlans = distPlans;
    this.plan = plan;
    this.from = createNewElement('div', ClassList.timelineDivFrom);
    this.to = createNewElement('div', ClassList.timelineDivTo);
    this.name = createNewElement('div', ClassList.timelineDivName);
    this.div = this.makeDiv();
  }

  private addSizeListener(btn: HTMLElement) {
    const sensor = getExistentElementByClass(ClassList.timelineSensor);
    btn.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      console.log('mouse down');
      this.div.setAttribute('draggable', 'false');
      this.div.classList.add(ClassList.timelineDivActive);
      sensor.classList.add(ClassList.timelineSensorActive);
      this.setZoneStart();
      console.log(this.distPlans, this.fromMin, this.toMin, this.zone.from);

      document.addEventListener(
        'mouseup',
        (mUEvent) => {
          mUEvent.stopPropagation();
          console.log('mouse up');
          this.div.setAttribute('draggable', 'true');
          this.div.classList.remove(ClassList.timelineDivActive);
          sensor.classList.remove(ClassList.timelineSensorActive);
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

    this.addSizeListener(left);
    this.addSizeListener(right);
    div.style.backgroundColor = this.plan.color;
    const textColor = colorsAndFonts.get(this.plan.color);
    if (textColor) div.style.color = textColor;

    const body = createNewElement('div', ClassList.timelineDivBody);
    body.append(left, this.name, right);

    div.append(this.from, body, this.to);
    this.addMoveListener(div);
    return div;
  }

  public showFake(start: number, finish: number) {
    this.div.style.left = `${Math.floor(start)}px`;
    this.div.style.width = `${finish}px`;
  }

  public showTimeInterval(fromMin: number, toMin: number, show: boolean) {
    this.fromMin = fromMin;
    this.toMin = fromMin + toMin;
    if (show) {
      this.from.style.display = 'flex';
      this.to.style.display = 'flex';
      this.from.innerText = minToHourTimeline(fromMin);
      this.to.innerText = minToHourTimeline(fromMin + toMin);
      this.name.innerText = this.plan.title;
    } else {
      this.from.style.display = 'none';
      this.to.style.display = 'none';
      this.name.innerText = '';
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
