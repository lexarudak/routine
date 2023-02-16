/* eslint-disable no-underscore-dangle */
import Api from '../../api';
import { ClassList } from '../../base/enums/classList';
import EditorMode from '../../base/enums/editorMode';
import ErrorsList from '../../base/enums/errorsList';
import InnerText from '../../base/enums/innerText';
import PageList from '../../base/enums/pageList';
import RoutsList from '../../base/enums/routsList';
import Values from '../../base/enums/values';
import {
  createNewElement,
  getExistentElementByClass,
  makeRoundIcon,
  minToHour,
  sortAllPlans,
} from '../../base/helpers';
import { DistDayPlan, Plan } from '../../base/interface';
import { GoToFn, PlanDis } from '../../base/types';
import PlanRound from '../../components/planRound';
import PlanRoundConfigDay from '../../components/planRoundConfigDay';
import Popup from '../../components/popup';
import Page from '../page';
import PlanEditor from '../planPage/components/planEditor';
import PlanLayout from '../planPage/components/planLayout';
import Timeline from './components/timeLine';
import TimelineMode from './components/timelineMode';

class DayPage extends Page {
  popup: Popup;

  distPlans: DistDayPlan[] = [];

  notDistPlans: Plan[] = [];

  allDayPlans: Plan[] = [];

  allWeekPlans: Plan[] = [];

  weekDistribution: Plan[][] = [];

  allPlansDist: PlanDis = {};

  layout: PlanLayout;

  timeLine: Timeline;

  planRounds: PlanRound[] = [];

  constructor(goTo: GoToFn, popup: Popup, editor: PlanEditor) {
    super(PageList.dayPage, goTo, editor);
    this.popup = popup;
    this.layout = new PlanLayout(goTo);
    this.timeLine = new Timeline();
  }

  private makePlans() {
    this.planRounds = [];
    this.planRounds = this.notDistPlans.map((plan) => new PlanRound(plan));
  }

  private showElements() {
    setTimeout(() => {
      getExistentElementByClass(ClassList.planAddButton).classList.add(ClassList.scaleNormal);
      getExistentElementByClass(ClassList.dayPageReturn).classList.add(ClassList.scaleNormal);
      const lines = document.querySelectorAll(`.${ClassList.planListColor}`);
      lines.forEach((val) => {
        if (val instanceof HTMLDivElement) val.classList.add(ClassList.scaleNormal);
      });
      const rounds = document.querySelectorAll(`.${ClassList.planRound}`);
      rounds.forEach((val) => {
        if (val instanceof HTMLDivElement) val.classList.add(ClassList.scaleNormal);
      });
    }, 0);
  }

  private getDayDistTime() {
    return this.allDayPlans.reduce((acc, val) => {
      return acc + val.duration;
    }, 0);
  }

  private setAddButton() {
    getExistentElementByClass(ClassList.planAddButton).addEventListener('click', () => {
      this.popup.editorMode();

      const freeDayTime = Values.allDayMinutes - this.getDayDistTime();
      if (freeDayTime < Values.minPlanDuration) {
        this.popup.open(this.layout.makeBanner(ErrorsList.freeYourDayTime));
        return;
      }

      const freeWeekTime = Values.allWeekMinutes - this.getFilledWeekTime();
      if (freeWeekTime < Values.minPlanDuration) {
        this.popup.open(this.layout.makeBanner(ErrorsList.freeYourWeekTime));
        return;
      }

      this.editor.open(
        Values.minPlanDuration,
        Math.min(freeWeekTime, freeDayTime),
        EditorMode.newPlanDay,
        undefined,
        this.dayId
      );
    });
  }

  private getFilledWeekTime() {
    return this.allWeekPlans.reduce((acc, plan) => {
      return acc + plan.duration;
    }, 0);
  }

  private fillTextInfo() {
    const distTime = this.getDayDistTime();
    getExistentElementByClass(ClassList.infoTextValue).innerText = minToHour(distTime);
    getExistentElementByClass(ClassList.planAddButtonValue).innerText = minToHour(Values.allDayMinutes - distTime);
  }

  private fillPlansZone() {
    const planZone = getExistentElementByClass(ClassList.dayPagePlansZone);
    const maxRoundSize = planZone.clientWidth * PlanRoundConfigDay.maxSizeK;

    this.planRounds.forEach((round) => {
      round.setWidth(maxRoundSize);
      const roundDiv = round.draw();
      const distTime = this.getDayPlanDistTime(round);
      round.paintRound(distTime);
      this.setRoundClick(roundDiv, distTime, round);
      this.setRoundMove(roundDiv);

      planZone.append(roundDiv);
    });
  }

  private setRoundMove(roundDiv: HTMLElement) {
    const returnZone = getExistentElementByClass(ClassList.dayPageReturn);
    const timeline = getExistentElementByClass(ClassList.timeline);
    const planAddButton = getExistentElementByClass(ClassList.planAddButton);
    roundDiv.addEventListener('dragstart', (e) => {
      if (e.target instanceof HTMLDivElement) this.timeLine.getPlanFromDiv(e.target);
      this.timeLine.mode = TimelineMode.addMode;
    });
    roundDiv.addEventListener('dragstart', function dragstart(e) {
      const { icon, center } = makeRoundIcon(this);
      if (e.dataTransfer) e.dataTransfer.setDragImage(icon, center, center);
      this.classList.add(ClassList.planRoundDrag);
      returnZone.classList.add(ClassList.planRemoveZoneDrag);
      planAddButton.classList.add(ClassList.planAddButtonDarg);
      timeline.classList.add(ClassList.timelineDrag);
    });
    roundDiv.addEventListener('dragend', () => {
      this.timeLine.mode = TimelineMode.noMode;
    });
    roundDiv.addEventListener('dragend', function dragend() {
      this.classList.remove(ClassList.planRoundDrag);
      returnZone.classList.remove(ClassList.planRemoveZoneDrag);
      planAddButton.classList.remove(ClassList.planAddButtonDarg);
      timeline.classList.remove(ClassList.timelineDrag);
    });
  }

  private setRoundClick(roundDiv: HTMLElement, distTime: number, round: PlanRound) {
    const allPlanDur = this.allWeekPlans.filter((plan) => plan._id === round.planInfo._id)[0].duration;
    const minTime = distTime;
    const maxTime =
      round.planInfo.duration +
      Math.min(allPlanDur - this.allPlansDist[round.planInfo._id], Values.allDayMinutes - this.getDayDistTime());
    roundDiv.addEventListener('click', () =>
      this.editor.open(minTime, maxTime, EditorMode.day, round.planInfo, this.dayId)
    );
  }

  private setPlanDistTime() {
    const flatArr = this.weekDistribution.flat();
    this.allPlansDist = flatArr.reduce((acc, plan) => {
      if (acc[plan._id]) {
        acc[plan._id] += plan.duration;
      } else {
        acc[plan._id] = plan.duration;
      }
      return acc;
    }, <PlanDis>{});
  }

  private getDayPlanDistTime(round: PlanRound) {
    return round.planInfo.duration - this.notDistPlans.filter((plan) => plan._id === round.planInfo._id)[0].duration;
  }

  private async setDayInfo() {
    const dayInfo = await Promise.all([
      Api.getDayDistribution(this.dayId),
      Api.getWeekDistribution(),
      Api.getAllPlans(),
    ]);
    const [dayDist, weekDist, allPlans] = dayInfo;
    const { distributedPlans, notDistributedPlans } = dayDist;
    this.allDayPlans = sortAllPlans(weekDist[Number(this.dayId)]);
    this.weekDistribution = weekDist;
    this.allWeekPlans = allPlans;
    this.distPlans = distributedPlans;
    this.notDistPlans = notDistributedPlans;
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    await this.setDayInfo();
    this.setPlanDistTime();

    this.makePlans();
    const container = createNewElement('div', ClassList.dayPageContainer);

    container.append(
      this.layout.makeButtonsBlock(),
      this.layout.makeInfoText(InnerText.allDayHours),
      createNewElement('div', ClassList.timelineHeader),
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
      this.setAddButton();
      this.showElements();
      this.timeLine.setTimeline(this.notDistPlans);
    } catch (error) {
      this.goTo(RoutsList.loginPage);
    }
  }
}

export default DayPage;
