/* eslint-disable no-underscore-dangle */
import { ClassList } from '../../../base/enums/classList';
import { createNewElement } from '../../../base/helpers';
import { Plan } from '../../../base/interface';
import colorsAndFonts from '../../../components/colorsAndFonts';

class TimelineDiv {
  div: HTMLDivElement;

  from: HTMLDivElement;

  to: HTMLDivElement;

  plan: Plan;

  name: HTMLDivElement;

  constructor(plan: Plan) {
    this.plan = plan;
    this.from = createNewElement('div', ClassList.timelineDivFrom);
    this.to = createNewElement('div', ClassList.timelineDivTo);
    this.name = createNewElement('div', ClassList.timelineDivName);
    this.div = this.makeDiv();
  }

  private makeDiv() {
    const div: HTMLDivElement = createNewElement('div', ClassList.timelineDiv);
    const left = createNewElement('div', ClassList.timelineDivLeft);
    const right = createNewElement('div', ClassList.timelineDivRight);
    div.style.backgroundColor = this.plan.color;
    const textColor = colorsAndFonts.get(this.plan.color);
    if (textColor) div.style.color = textColor;

    console.log();
    div.append(this.from, left, this.name, right, this.to);
    return div;
  }

  public showFake(start: number, finish: number) {
    this.div.style.left = `${Math.floor(start)}px`;
    this.div.style.width = `${finish}px`;
  }

  public showTimeInterval(from: string, to: string, show: boolean) {
    if (show) {
      this.from.style.display = 'flex';
      this.to.style.display = 'flex';
      this.from.innerText = from;
      this.to.innerText = to;
      this.name.innerText = this.plan.title;
    } else {
      this.from.style.display = 'none';
      this.to.style.display = 'none';
      this.name.innerText = '';
    }
  }

  public draw() {
    return this.div;
  }
}

export default TimelineDiv;
