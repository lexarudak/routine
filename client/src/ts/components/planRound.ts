/* eslint-disable no-underscore-dangle */
import { SetAttribute } from '../base/enums/attributes';
import ButtonClasses from '../base/enums/buttonClasses';
import { ClassList } from '../base/enums/classList';
import { createNewElement, makeColorTransparent, minToHour } from '../base/helpers';
import { Plan } from '../base/interface';
import colorsAndFonts from './colorsAndFonts';
import PlanRoundConfig from './planRoundConfig';
import PlanRoundConfigDay from './planRoundConfigDay';
import alignValues from './plansAlignValues';

class PlanRound {
  planInfo: Plan;

  blur: HTMLElement;

  width: number;

  constructor(planInfo: Plan) {
    this.planInfo = planInfo;
    this.width = 0;
    this.blur = createNewElement('div', ClassList.planRoundBlur);
  }

  private getUniqValue() {
    const a = parseInt(this.planInfo.color.slice(6, 7), 16);
    const b = parseInt(this.planInfo.color.slice(4, 5), 16);
    return a + b;
  }

  private getFontSize() {
    return `${this.width / PlanRoundConfig.fontSizeK}px`;
  }

  private getBlurHeight(distTime: number) {
    const percent = distTime / this.planInfo.duration;
    return `${percent * this.width}px`;
  }

  private getValueSize() {
    const k = PlanRoundConfig.timeSizeK;
    const k2 = PlanRoundConfig.timeSizeK2;
    return `${this.width / k + k / k2}px`;
  }

  public paintRound(distTime: number) {
    this.blur.style.height = this.getBlurHeight(distTime);
  }

  public setWidth(maxRoundSize: number) {
    const timePer = this.planInfo.duration / (PlanRoundConfigDay.maxProcDur - PlanRoundConfigDay.minProcDur);
    let width = (maxRoundSize - PlanRoundConfigDay.minRoundSize) * timePer + PlanRoundConfigDay.minRoundSize;
    if (width < PlanRoundConfigDay.minRoundSize) width = PlanRoundConfigDay.minRoundSize;
    if (width > maxRoundSize) width = maxRoundSize;
    this.width = width;
  }

  public draw() {
    const round = document.createElement('div');
    const name = document.createElement('span');
    const time = document.createElement('span');
    round.setAttribute('draggable', 'true');
    round.setAttribute(SetAttribute.planId, this.planInfo._id);
    round.classList.add(ClassList.planRound, ButtonClasses.button);
    time.classList.add(ClassList.planRoundVal);

    round.style.backgroundColor = this.planInfo.color;
    name.innerText = this.planInfo.title;
    name.style.fontSize = this.getFontSize();
    time.innerText = minToHour(this.planInfo.duration);
    time.style.fontSize = this.getValueSize();
    round.style.width = `${this.width}px`;
    round.style.height = round.style.width;
    const val = this.getUniqValue();
    round.style.margin = `${val}px`;
    round.style.alignSelf = `${alignValues[val % alignValues.length]}`;
    const fontColor = colorsAndFonts.get(this.planInfo.color);
    if (fontColor) {
      round.style.color = fontColor;
      time.style.color = makeColorTransparent(fontColor, 50);
    }

    round.append(name, this.blur, time);
    return round;
  }
}

export default PlanRound;
