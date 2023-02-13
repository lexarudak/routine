import Api from '../../api';
import { ClassList } from '../../base/enums/classList';
import InnerText from '../../base/enums/innerText';
import PageList from '../../base/enums/pageList';
import RoutsList from '../../base/enums/routsList';
import Values from '../../base/enums/values';
import { createNewElement, getExistentElementByClass, minToHour, sortAllPlans } from '../../base/helpers';
import { DistDayPlan, Plan } from '../../base/interface';
import { GoToFn } from '../../base/types';
import PlanRound from '../../components/planRound';
import PlanRoundConfigDay from '../../components/planRoundConfigDay';
import Popup from '../../components/popup';
import Page from '../page';
import PlanEditor from '../planPage/components/planEditor';
import PlanLayout from '../planPage/components/planLayout';
import Timeline from './components/timeLine';

class DayPage extends Page {
  popup: Popup;

  distPlans: DistDayPlan[];

  notDistPlans: Plan[];

  allDayPlans: Plan[];

  layout: PlanLayout;

  timeLine: Timeline;

  planRounds: PlanRound[];

  constructor(goTo: GoToFn, popup: Popup, editor: PlanEditor) {
    super(PageList.dayPage, goTo, editor);
    this.popup = popup;
    this.layout = new PlanLayout(goTo);
    this.timeLine = new Timeline();
    this.distPlans = [];
    this.notDistPlans = [];
    this.allDayPlans = [];
    this.planRounds = [];
  }

  private makePlans() {
    this.planRounds = [];
    this.planRounds = this.notDistPlans.map((plan) => new PlanRound(plan));
  }

  private showElements() {
    const scale = Values.scaleNormal;
    setTimeout(() => {
      getExistentElementByClass(ClassList.planAddButton).style.transform = scale;
      getExistentElementByClass(ClassList.dayPageReturn).style.transform = scale;
      const lines = document.querySelectorAll(`.${ClassList.planListColor}`);
      lines.forEach((val) => {
        if (val instanceof HTMLDivElement) val.style.transform = scale;
      });
      const rounds = document.querySelectorAll(`.${ClassList.planRound}`);
      rounds.forEach((val) => {
        if (val instanceof HTMLDivElement) val.style.transform = scale;
      });
    }, 0);
  }

  private fillTextInfo() {
    const distTime = this.allDayPlans.reduce((acc, val) => {
      return acc + val.duration;
    }, 0);
    getExistentElementByClass(ClassList.infoTextValue).innerText = minToHour(distTime);
    getExistentElementByClass(ClassList.planAddButtonValue).innerText = minToHour(Values.allDayMinutes - distTime);
  }

  private fillPlansZone() {
    const planZone = getExistentElementByClass(ClassList.dayPagePlansZone);
    const maxRoundSize = planZone.clientWidth * PlanRoundConfigDay.maxSizeK;

    this.planRounds.forEach((round) => {
      const timePer = round.planInfo.duration / (PlanRoundConfigDay.maxProcDur - PlanRoundConfigDay.minProcDur);
      let width = (maxRoundSize - PlanRoundConfigDay.minRoundSize) * timePer + PlanRoundConfigDay.minRoundSize;
      if (width < PlanRoundConfigDay.minRoundSize) width = PlanRoundConfigDay.minRoundSize;
      if (width > maxRoundSize) width = maxRoundSize;

      planZone.append(round.draw(width, width));
    });
  }

  private async setDayInfo() {
    const dayInfo = await Promise.all([Api.getDayDistribution(this.dayId), Api.getWeekDistribution()]);
    const { distributedPlans, notDistributedPlans } = dayInfo[0];
    this.allDayPlans = sortAllPlans(dayInfo[1][Number(this.dayId)]);
    this.distPlans = distributedPlans;
    this.notDistPlans = notDistributedPlans;
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    await this.setDayInfo();

    this.makePlans();
    const container = createNewElement('div', ClassList.dayPageContainer);

    container.append(
      this.layout.makeButtonsBlock(),
      this.layout.makeInfoText(InnerText.allDayHours),
      this.timeLine.draw(),
      this.layout.makeDayBody(this.dayId, this.allDayPlans)
    );

    return container;
  }

  public async draw(id: string) {
    this.dayId = id;
    try {
      const container = getExistentElementByClass(ClassList.mainContainer);
      await this.animatedFilledPageAppend(container);

      this.fillTextInfo();
      this.fillPlansZone();
      this.showElements();
    } catch (error) {
      this.goTo(RoutsList.loginPage);
    }
  }
}

export default DayPage;
