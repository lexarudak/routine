import ButtonClasses from '../base/enums/buttonClasses';
import ClassList from '../base/enums/classList';
import { minToHour } from '../base/helpers';
import { Plan } from '../base/interface';
import colorsAndFonts from './colorsAndFonts';
import PlanRoundConfig from './planRoundConfig';
import alignValues from './plansAlignValues';

class PlanRound {
  planInfo: Plan;

  constructor(planInfo: Plan) {
    this.planInfo = planInfo;
  }

  private getUniqValue() {
    const a = parseInt(this.planInfo.color.slice(6, 7), 16);
    const b = parseInt(this.planInfo.color.slice(4, 5), 16);
    return a + b;
  }

  private getFontSize(width: number) {
    return `${width / PlanRoundConfig.fontSizeK}px`;
  }

  private getValueSize(width: number) {
    const k = PlanRoundConfig.timeSizeK;
    const k2 = PlanRoundConfig.timeSizeK2;
    return `${width / k + k / k2}px`;
  }

  public draw(width: number) {
    const round = document.createElement('div');
    const name = document.createElement('span');
    const time = document.createElement('span');
    round.classList.add(ClassList.planRound, ButtonClasses.button);
    time.classList.add(ClassList.planRoundVal);

    round.style.backgroundColor = this.planInfo.color;
    name.innerText = this.planInfo.title;
    name.style.fontSize = this.getFontSize(width);
    time.innerText = minToHour(this.planInfo.duration);
    time.style.fontSize = this.getValueSize(width);
    round.style.width = `${width}px`;
    round.style.height = round.style.width;
    const val = this.getUniqValue();
    round.style.margin = `${val}px`;
    round.style.alignSelf = `${alignValues[val % alignValues.length]}`;
    const fontColor = colorsAndFonts.get(this.planInfo.color);
    if (fontColor) round.style.color = fontColor;

    round.append(name, time);
    return round;
  }
}

export default PlanRound;
