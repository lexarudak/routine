/* eslint-disable no-underscore-dangle */
import Api from '../../api';
import {
  BaseClassList,
  DayPageClassList,
  MainClassList,
  PlanRoundClassList,
  TimelineClassList,
  WeekPageClassList,
} from '../../base/enums/classList';
import Days from '../../base/enums/days';
import EditorMode from '../../base/enums/editorMode';
import ErrorsList from '../../base/enums/errorsList';
import InnerText from '../../base/enums/innerText';
import PageList from '../../base/enums/pageList';
import RoutsList from '../../base/enums/routsList';
import Values from '../../base/enums/values';
import {
  createNewElement,
  getExistentElementByClass,
  makeBanner,
  makeRoundIcon,
  minToHour,
  sortAllPlans,
} from '../../base/helpers';
import { DistDayPlan, Plan } from '../../base/interface';
import { GoToFn, PlanDis } from '../../base/types';
import Header from '../../components/header';
import PlanEditor from '../../components/planEditor';
import PlanRound from '../../components/planRound';
import { PlanRoundConfigDay } from '../../components/planRoundConfig';
import Popup from '../../components/popup';
import Page from '../page';
import PlanLayout from '../planPage/components/planLayout';
import Timeline from './components/timeLine';

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

  header: Header;

  planRounds: PlanRound[] = [];

  constructor(goTo: GoToFn, popup: Popup, editor: PlanEditor) {
    super(PageList.dayPage, goTo, editor);
    this.popup = popup;
    this.layout = new PlanLayout(goTo);
    this.timeLine = new Timeline(goTo);
    this.header = new Header(goTo);
  }

  private setRoundClick(roundDiv: HTMLElement, round: PlanRound) {
    const allPlanDur = this.allWeekPlans.filter((plan) => plan._id === round.planInfo._id)[0].duration;
    const maxTime =
      round.planInfo.duration +
      Math.min(allPlanDur - this.allPlansDist[round.planInfo._id], Values.allDayMinutes - this.getDayDistTime());
    roundDiv.addEventListener('click', () => {
      const minTime = this.getDayPlanDistTime(round);
      this.editor.open(minTime, maxTime, EditorMode.editDayPlan, round.planInfo, this.dayId);
    });
  }

  private makePlans() {
    this.planRounds = [];
    this.planRounds = this.allDayPlans.map((plan) => new PlanRound(plan));
  }

  private showElements() {
    setTimeout(() => {
      getExistentElementByClass(WeekPageClassList.planAddButton).classList.add(BaseClassList.scaleNormal);
      getExistentElementByClass(DayPageClassList.dayPageReturn).classList.add(BaseClassList.scaleNormal);
      const lines = document.querySelectorAll(`.${DayPageClassList.planListColor}`);
      lines.forEach((val) => {
        if (val instanceof HTMLDivElement) val.classList.add(BaseClassList.scaleNormal);
      });
      const rounds = document.querySelectorAll(`.${PlanRoundClassList.planRound}`);
      rounds.forEach((val) => {
        if (val instanceof HTMLDivElement) val.classList.add(BaseClassList.scaleNormal);
      });
    }, 0);
  }

  private getDayDistTime() {
    return this.allDayPlans.reduce((acc, val) => {
      return acc + val.duration;
    }, 0);
  }

  private setAddButton() {
    getExistentElementByClass(WeekPageClassList.planAddButton).addEventListener('click', () => {
      this.popup.editorMode();

      const freeDayTime = Values.allDayMinutes - this.getDayDistTime();
      if (freeDayTime < Values.minPlanDuration) {
        this.popup.open(makeBanner(ErrorsList.freeYourDayTime));
        return;
      }

      const freeWeekTime = Values.allWeekMinutes - this.getFilledWeekTime();
      if (freeWeekTime < Values.minPlanDuration) {
        this.popup.open(makeBanner(ErrorsList.freeYourWeekTime));
        return;
      }

      this.editor.open(
        Values.minPlanDuration,
        Math.min(freeWeekTime, freeDayTime),
        EditorMode.newPlanFromDay,
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
    getExistentElementByClass(WeekPageClassList.infoTextValue).innerText = minToHour(distTime);
    getExistentElementByClass(WeekPageClassList.planAddButtonValue).innerText = minToHour(
      Values.allDayMinutes - distTime
    );
  }

  private fillPlansZone() {
    const planZone = getExistentElementByClass(DayPageClassList.dayPagePlansZone);
    const maxRoundSize = planZone.clientWidth * PlanRoundConfigDay.maxSizeK;

    this.planRounds.forEach((round) => {
      round.setWidth(maxRoundSize);
      const roundDiv = round.draw();
      const distTime = this.getDayPlanDistTime(round);
      round.paintRound(distTime);
      this.setRoundClick(roundDiv, round);
      this.setRoundMove(roundDiv);

      planZone.append(roundDiv);
    });
  }

  private setRoundMove(roundDiv: HTMLElement) {
    const returnZone = getExistentElementByClass(DayPageClassList.dayPageReturn);
    const timeline = getExistentElementByClass(TimelineClassList.timeline);
    const sensor = getExistentElementByClass(TimelineClassList.timelineSensor);

    roundDiv.addEventListener('dragstart', (e) => {
      if (e.target instanceof HTMLDivElement) {
        this.timeLine.getPlanFromDiv(e.target);
        this.timeLine.round = e.target;
      }
    });

    roundDiv.addEventListener('dragstart', function dragstart(e) {
      sensor.classList.add(TimelineClassList.timelineSensorActive);
      const { icon, center } = makeRoundIcon(this);
      if (e.dataTransfer) e.dataTransfer.setDragImage(icon, center, center);
      this.classList.add(PlanRoundClassList.planRoundDrag);
      returnZone.classList.add(WeekPageClassList.planRemoveZoneDrag);
      timeline.classList.add(TimelineClassList.timelineDrag);
    });

    roundDiv.addEventListener('dragend', function dragend() {
      sensor.classList.remove(TimelineClassList.timelineSensorActive);
      this.classList.remove(PlanRoundClassList.planRoundDrag);
      returnZone.classList.remove(WeekPageClassList.planRemoveZoneDrag);
      timeline.classList.remove(TimelineClassList.timelineDrag);
    });
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
    const roundInNoDistList = this.notDistPlans.filter((plan) => plan._id === round.planInfo._id)[0];
    if (roundInNoDistList) return round.planInfo.duration - roundInNoDistList.duration;
    return round.planInfo.duration;
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
    const container = createNewElement('div', DayPageClassList.dayPageContainer);
    this.header.paintToday(this.dayId);

    container.append(
      this.header.draw(Days[Number(this.dayId)], undefined, this.layout.makeInfoText(InnerText.allDayHours)),
      createNewElement('div', TimelineClassList.timelineHeader),
      this.timeLine.draw(),
      this.layout.makeDayBody(this.dayId, this.allDayPlans, this.distPlans)
    );

    return container;
  }

  public async draw(id: string) {
    this.dayId = id;
    try {
      const container = getExistentElementByClass(MainClassList.mainContainer);
      await this.animatedFilledPageAppend(container);

      this.fillTextInfo();
      this.fillPlansZone();
      this.setAddButton();
      this.showElements();
      this.timeLine.setTimeline(this.notDistPlans, this.distPlans, this.allDayPlans, id);
    } catch (error) {
      this.goTo(RoutsList.loginPage);
    }
  }
}

export default DayPage;
