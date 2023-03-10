/* eslint-disable no-underscore-dangle */
import { SetAttribute } from '../base/enums/attributes';
import { ButtonClassList, PlanRoundClassList } from '../base/enums/classList';
import { createNewElement, getColors, makeColorTransparent, minToHour } from '../base/helpers';
import { Plan } from '../base/interface';
import { PlanRoundConfig, PlanRoundConfigDay } from './planRoundConfig';
import alignValues from './plansAlignValues';

class PlanRound {
  planInfo: Plan;

  blur: HTMLElement;

  width: number;

  constructor(planInfo: Plan) {
    this.planInfo = planInfo;
    this.width = 0;
    this.blur = createNewElement('div', PlanRoundClassList.planRoundBlur);
  }

  private getUniqValue() {
    const [bgColor] = getColors(this.planInfo.color);
    const a = parseInt(bgColor.slice(5, 6), 16);
    const b = parseInt(bgColor.slice(4, 5), 16);
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
    round.classList.add(PlanRoundClassList.planRound, ButtonClassList.button);
    time.classList.add(PlanRoundClassList.planRoundVal);

    const [bgColor, fontColor] = getColors(this.planInfo.color);
    round.style.backgroundColor = bgColor;
    name.innerText = this.planInfo.title;
    name.style.fontSize = this.getFontSize();
    time.innerText = minToHour(this.planInfo.duration);
    time.style.fontSize = this.getValueSize();
    round.style.width = `${this.width}px`;
    round.style.height = round.style.width;
    const val = this.getUniqValue();
    round.style.margin = `${val}px`;
    round.style.alignSelf = `${alignValues[val % alignValues.length]}`;
    round.style.color = fontColor;
    time.style.color = makeColorTransparent(fontColor, 50);

    round.append(name, this.blur, time);
    return round;
  }
}

export default PlanRound;
