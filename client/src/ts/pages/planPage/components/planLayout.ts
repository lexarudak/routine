/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
import Layout from '../../layout';
import {
  BaseClassList,
  ButtonClassList,
  DayPageClassList,
  MainClassList,
  PlanRoundClassList,
  WeekPageClassList,
} from '../../../base/enums/classList';
import { GetAttribute, SetAttribute } from '../../../base/enums/attributes';
import Days from '../../../base/enums/days';
import RoutsList from '../../../base/enums/routsList';
import Values from '../../../base/enums/values';
import { GoToFn } from '../../../base/types';
import {
  createNewElement,
  getColors,
  getExistentElementByClass,
  loginRedirect,
  minToHour,
} from '../../../base/helpers';
import Api from '../../../api';
import { DistDayPlan, Plan } from '../../../base/interface';
import ErrorsList from '../../../base/enums/errorsList';
import PageList from '../../../base/enums/pageList';
import InnerText from '../../../base/enums/innerText';
import Url from '../../../base/enums/url';

class PlanLayout extends Layout {
  goTo: GoToFn;

  constructor(goTo: GoToFn) {
    super();
    this.goTo = goTo;
  }

  public makeWeekLine() {
    const weekLine = document.createElement('div');
    weekLine.classList.add(WeekPageClassList.weekLine);
    return weekLine;
  }

  public makeInfoText(maxVal: string) {
    const infoTextContainer = createNewElement('div', WeekPageClassList.infoTextContainer);
    const infoTextValue = createNewElement('div', WeekPageClassList.infoTextValue);
    const infoText = createNewElement('div', WeekPageClassList.infoTextValue);
    infoText.innerText = maxVal;
    infoTextContainer.append(infoTextValue, infoText);
    return infoTextContainer;
  }

  private createDay(dayNum: number) {
    const planDay = document.createElement('div');
    planDay.classList.add(WeekPageClassList.planDay);
    planDay.setAttribute(SetAttribute.dayId, dayNum.toString());

    const planDayBody = document.createElement('div');
    planDayBody.classList.add(WeekPageClassList.planDayLine);

    const planDayName = document.createElement('div');
    planDayName.classList.add(WeekPageClassList.planDayName);
    planDayName.innerHTML = Days[dayNum].slice(0, 3);

    const planDayHours = document.createElement('div');
    planDayHours.classList.add(WeekPageClassList.planDayHours);

    planDay.append(planDayBody, planDayName, planDayHours);
    planDay.addEventListener('click', () => this.goTo(`/${Days[dayNum]}`));
    return planDay;
  }

  private fillPlanDaysContainer(emptyDayContainer: HTMLDivElement) {
    const planDaysContainer = emptyDayContainer;
    for (let i = 0; i < 7; i += 1) {
      planDaysContainer.append(this.createDay(i));
    }
    return planDaysContainer;
  }

  private makeAddButton() {
    const btn = document.createElement('button');
    btn.classList.add(ButtonClassList.button, WeekPageClassList.planAddButton);

    const name = document.createElement('span');
    name.innerText = InnerText.planAddButton;
    name.classList.add(WeekPageClassList.planAddButtonName);

    const value = document.createElement('span');
    value.classList.add(WeekPageClassList.planAddButtonValue);

    btn.append(name, value);
    return btn;
  }

  private makeReturnToWeekZone(dayId: string, allDayPlans: Plan[], distPlans: DistDayPlan[]) {
    const zone = createNewElement('div', DayPageClassList.dayPageReturn);
    const icon = document.createElement('div');
    icon.style.backgroundImage = Url.returnImg;
    zone.append(icon);
    this.addReturnListeners(zone, dayId, allDayPlans, distPlans);
    return zone;
  }

  private addReturnListeners(zone: HTMLElement, dayId: string, allDayPlans: Plan[], distPlans: DistDayPlan[]) {
    zone.addEventListener('dragover', function enter(e) {
      e.preventDefault();
      try {
        getExistentElementByClass(PlanRoundClassList.planRoundDrag);
        this.classList.add(DayPageClassList.dayPageReturnOver);
      } catch {
        console.log();
      }
    });

    zone.addEventListener('dragleave', function leave() {
      this.classList.remove(DayPageClassList.dayPageReturnOver);
    });

    zone.addEventListener('drop', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const { currentTarget } = e;
      if (currentTarget instanceof HTMLElement) currentTarget.classList.remove(DayPageClassList.dayPageReturnOver);
      try {
        getExistentElementByClass(PlanRoundClassList.planRoundDrag);
      } catch {
        console.log('this element is from timeline');
        return;
      }
      const roundDiv = getExistentElementByClass(PlanRoundClassList.planRoundDrag);
      const id = roundDiv.dataset[GetAttribute.planId];
      if (!id) throw new Error(ErrorsList.noId);

      const newDistList = distPlans.filter((plan) => plan._id !== id);
      const dayDistribution = newDistList.map((plan) => {
        const { _id, from, to } = plan;
        return { planId: _id, from, to };
      });
      const dayOfWeek = Number(dayId);
      const body = { dayOfWeek, dayDistribution };

      const planDur = allDayPlans.filter((plan) => plan._id === id)[0].duration;
      const opt = { dayOfWeek: Number(dayId), planId: id, duration: -planDur };

      if (id) {
        try {
          roundDiv.style.visibility = 'hidden';
          getExistentElementByClass(MainClassList.mainContainer).classList.add(MainClassList.mainContainerHide);
          await Promise.all([Api.pushPlanToDay(opt), Api.pushDayDistribution(body)]);
          this.goTo(`/${Days[Number(dayId)]}`);
        } catch (error) {
          loginRedirect(error, this.goTo);
        }
      }
    });
  }

  private makeRemoveZone() {
    const remove = createNewElement('div', WeekPageClassList.planRemoveZone);
    const bin = document.createElement('div');
    bin.style.backgroundImage = Url.binImg;
    remove.append(bin);

    remove.addEventListener('dragover', function enter(e) {
      e.preventDefault();
      this.classList.add(WeekPageClassList.planRemoveZoneOver);
    });
    remove.addEventListener('dragleave', function leave() {
      this.classList.remove(WeekPageClassList.planRemoveZoneOver);
    });
    remove.addEventListener('drop', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const { currentTarget } = e;
      if (currentTarget instanceof HTMLElement) currentTarget.classList.remove(WeekPageClassList.planRemoveZoneOver);
      const roundDiv = getExistentElementByClass(PlanRoundClassList.planRoundDrag);
      const id = roundDiv.dataset[GetAttribute.planId];
      if (id) {
        try {
          roundDiv.style.display = 'none';
          getExistentElementByClass(MainClassList.mainContainer).classList.add(MainClassList.mainContainerHide);
          await Api.deletePlan(id);
          this.goTo(RoutsList.planPage);
        } catch (error) {
          loginRedirect(error, this.goTo);
        }
      }
    });
    return remove;
  }

  public makePlanBody() {
    const planBody = createNewElement('div', WeekPageClassList.planBody);
    const planField = createNewElement('div', WeekPageClassList.planField);
    const buttons = createNewElement('div', WeekPageClassList.planButtons);
    const weekendFields = createNewElement('div', WeekPageClassList.weekFields);
    const weekendFieldsBig = createNewElement('div', WeekPageClassList.weekFieldsBig);
    const weekendFieldsSmall = createNewElement('div', WeekPageClassList.weekFieldsSmall);
    const emptyDayContainer = document.createElement('div');
    const leftColumn = createNewElement('div', WeekPageClassList.planLeftColumn);
    const planName = createNewElement('div', WeekPageClassList.planName);
    planName.innerText = PageList.planPage;
    planName.classList.add(BaseClassList.title);

    const planDaysContainer = this.fillPlanDaysContainer(emptyDayContainer);
    planDaysContainer.classList.add(WeekPageClassList.planDaysContainer);

    leftColumn.append(planName, planDaysContainer);

    buttons.append(this.makeAddButton(), this.makeRemoveZone());
    weekendFields.append(weekendFieldsBig, weekendFieldsSmall);
    planField.append(buttons, weekendFields);
    planBody.append(leftColumn, planField);
    return planBody;
  }

  private createPlanListItem(plan: Plan) {
    const [bgColor] = getColors(plan.color);
    const li: HTMLLIElement = createNewElement('li', DayPageClassList.planListItem);
    const color = createNewElement('div', DayPageClassList.planListColor);
    color.style.backgroundColor = bgColor;
    const width = ((Values.maxDayPlanWidth * plan.duration) / Values.allDayMinutes) * Values.planListWidthK;
    color.style.width = `${width}px`;
    const name = createNewElement('span', DayPageClassList.planListName);
    name.innerText = plan.title;
    const dur = createNewElement('span', DayPageClassList.planListDur);
    dur.innerText = `( ${minToHour(plan.duration)} )`;

    li.append(color, name, dur);
    return li;
  }

  public fillPlanList(planList: HTMLUListElement, plans: Plan[]) {
    const filledList = planList;
    plans.forEach((plan) => {
      filledList.append(this.createPlanListItem(plan));
    });
    return filledList;
  }

  public makeDayBody(dayId: string, allDayPlans: Plan[], distPlans: DistDayPlan[]) {
    const container = createNewElement('div', DayPageClassList.dayPageBody);
    const info = createNewElement('div', DayPageClassList.dayPageInfo);
    const field = createNewElement('div', DayPageClassList.dayPageField);
    const tools = createNewElement('div', DayPageClassList.dayPageTools);
    const plansZone = createNewElement('div', DayPageClassList.dayPagePlansZone);
    const name = createNewElement('h1', DayPageClassList.dayPageName);
    name.classList.add(BaseClassList.title);
    name.innerText = Days[Number(dayId)];
    const planList: HTMLUListElement = createNewElement('ul', DayPageClassList.planList);
    this.fillPlanList(planList, allDayPlans);

    tools.append(this.makeReturnToWeekZone(dayId, allDayPlans, distPlans), this.makeAddButton());
    field.append(tools, plansZone);
    info.append(name, planList);
    container.append(info, field);
    return container;
  }
}

export default PlanLayout;
