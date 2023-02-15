/* eslint-disable no-underscore-dangle */
import ButtonClasses from '../../../base/enums/buttonClasses';
import ButtonNames from '../../../base/enums/buttonNames';
import { ClassList } from '../../../base/enums/classList';
import { GetAttribute, SetAttribute } from '../../../base/enums/attributes';
import Days from '../../../base/enums/days';
import RoutsList from '../../../base/enums/routsList';
import Values from '../../../base/enums/values';
import { GoToFn } from '../../../base/types';
import { createNewElement, getExistentElementByClass, loginRedirect, minToHour } from '../../../base/helpers';
import Api from '../../../api';
import { Plan } from '../../../base/interface';
import ErrorsList from '../../../base/enums/errorsList';

class PlanLayout {
  goTo: GoToFn;

  constructor(goTo: GoToFn) {
    this.goTo = goTo;
  }

  public makeNavButton(name: string, routPath: RoutsList, callback: GoToFn) {
    const btn: HTMLButtonElement = createNewElement('button', ButtonClasses.navButton);
    btn.innerText = name;
    btn.addEventListener('click', () => callback(routPath));
    return btn;
  }

  public makeWeekLine() {
    const weekLine = document.createElement('div');
    weekLine.classList.add(ClassList.weekLine);
    return weekLine;
  }

  public makeInfoText(maxVal: string) {
    const infoTextContainer = createNewElement('div', ClassList.infoTextContainer);
    const infoTextValue = createNewElement('div', ClassList.infoTextValue);
    const infoText = createNewElement('div', ClassList.infoTextValue);
    infoText.innerText = maxVal;
    infoTextContainer.append(infoTextValue, infoText);
    return infoTextContainer;
  }

  private createDay(dayNum: number) {
    const planDay = document.createElement('div');
    planDay.classList.add(ClassList.planDay);
    planDay.setAttribute(SetAttribute.dayId, dayNum.toString());

    const planDayBody = document.createElement('div');
    planDayBody.classList.add(ClassList.planDayLine);

    const planDayName = document.createElement('div');
    planDayName.classList.add(ClassList.planDayName);
    planDayName.innerHTML = Days[dayNum].slice(0, 3);

    const planDayHours = document.createElement('div');
    planDayHours.classList.add(ClassList.planDayHours);

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
    btn.classList.add(ButtonClasses.button, ClassList.planAddButton);

    const name = document.createElement('span');
    name.innerText = ButtonNames.planAddButton;
    name.classList.add(ClassList.planAddButtonName);

    const value = document.createElement('span');
    value.classList.add(ClassList.planAddButtonValue);

    btn.append(name, value);
    return btn;
  }

  private makeReturnToWeekZone(dayId: string, allDayPlans: Plan[]) {
    const zone = createNewElement('div', ClassList.dayPageReturn);
    const icon = document.createElement('div');
    icon.style.backgroundImage = Values.returnImg;
    zone.append(icon);
    this.addReturnListeners(zone, dayId, allDayPlans);
    return zone;
  }

  private addReturnListeners(zone: HTMLElement, dayId: string, allDayPlans: Plan[]) {
    zone.addEventListener('dragover', function enter(e) {
      e.preventDefault();
      this.classList.add(ClassList.dayPageReturnOver);
    });
    zone.addEventListener('dragleave', function leave() {
      this.classList.remove(ClassList.dayPageReturnOver);
    });
    zone.addEventListener('drop', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const { currentTarget } = e;
      if (currentTarget instanceof HTMLElement) currentTarget.classList.remove(ClassList.dayPageReturnOver);
      const roundDiv = getExistentElementByClass(ClassList.planRoundDrag);
      const id = roundDiv.dataset[GetAttribute.planId];
      if (!id) throw new Error(ErrorsList.noId);

      const planDur = allDayPlans.filter((plan) => plan._id === id)[0].duration;
      const opt = { dayOfWeek: Number(dayId), planId: id, duration: -planDur };
      if (id) {
        try {
          roundDiv.style.visibility = 'hidden';
          getExistentElementByClass(ClassList.mainContainer).classList.add(ClassList.mainContainerHide);
          await Api.pushPlanToDay(opt);
          this.goTo(`/${Days[Number(dayId)]}`);
        } catch (error) {
          loginRedirect(error, this.goTo);
        }
      }
    });
  }

  private makeRemoveZone() {
    const remove = createNewElement('div', ClassList.planRemoveZone);
    const bin = document.createElement('div');
    bin.style.backgroundImage = Values.binImg;
    remove.append(bin);

    remove.addEventListener('dragover', function enter(e) {
      e.preventDefault();
      this.classList.add(ClassList.planRemoveZoneOver);
    });
    remove.addEventListener('dragleave', function leave() {
      this.classList.remove(ClassList.planRemoveZoneOver);
    });
    remove.addEventListener('drop', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const { currentTarget } = e;
      if (currentTarget instanceof HTMLElement) currentTarget.classList.remove(ClassList.planRemoveZoneOver);
      const roundDiv = getExistentElementByClass(ClassList.planRoundDrag);
      const id = roundDiv.dataset[GetAttribute.planId];
      if (id) {
        try {
          roundDiv.style.display = 'none';
          getExistentElementByClass(ClassList.mainContainer).classList.add(ClassList.mainContainerHide);
          await Api.deletePlan(id);
          this.goTo(RoutsList.planPage);
        } catch (error) {
          loginRedirect(error, this.goTo);
        }
      }
    });
    return remove;
  }

  public makeBanner(bannerText: string) {
    const banner = document.createElement('h2');
    banner.classList.add(ClassList.banner);
    banner.innerText = bannerText;
    return banner;
  }

  public makePlanBody() {
    const planBody = document.createElement('div');
    planBody.classList.add(ClassList.planBody);

    const planTools = document.createElement('div');
    planTools.classList.add(ClassList.planTools);

    const planField = document.createElement('div');
    planField.classList.add(ClassList.planField);

    const buttons = document.createElement('div');
    buttons.classList.add(ClassList.planButtons);

    const weekendFields = document.createElement('div');
    weekendFields.classList.add(ClassList.weekendFields);

    const weekendFieldsBig = document.createElement('div');
    weekendFieldsBig.classList.add(ClassList.weekendFieldsBig);

    const weekendFieldsSmall = document.createElement('div');
    weekendFieldsSmall.classList.add(ClassList.weekendFieldsSmall);

    const emptyDayContainer = document.createElement('div');
    const planDaysContainer = this.fillPlanDaysContainer(emptyDayContainer);
    planDaysContainer.classList.add(ClassList.planDaysContainer);

    buttons.append(this.makeAddButton(), this.makeRemoveZone());
    weekendFields.append(weekendFieldsBig, weekendFieldsSmall);
    planField.append(buttons, weekendFields);
    planBody.append(planDaysContainer, planField);
    return planBody;
  }

  public makeButtonsBlock() {
    const container = createNewElement('div', ClassList.dayPageNavButtons);
    container.append(
      this.makeNavButton(ButtonNames.home, RoutsList.homePage, this.goTo),
      this.makeNavButton(ButtonNames.plan, RoutsList.planPage, this.goTo)
    );
    return container;
  }

  private createPlanListItem(plan: Plan) {
    const li: HTMLLIElement = createNewElement('li', ClassList.planListItem);
    const color = createNewElement('div', ClassList.planListColor);
    color.style.backgroundColor = plan.color;
    color.style.width = `${
      ((Values.maxDayPlanWidth * plan.duration) / Values.allDayMinutes) * Values.planListWidthK
    }px`;
    const name = createNewElement('span', ClassList.planListName);
    name.innerText = plan.title;
    const dur = createNewElement('span', ClassList.planListDur);
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

  public makeDayBody(dayId: string, allDayPlans: Plan[]) {
    const container = createNewElement('div', ClassList.dayPageBody);
    const info = createNewElement('div', ClassList.dayPageInfo);
    const field = createNewElement('div', ClassList.dayPageField);
    const tools = createNewElement('div', ClassList.dayPageTools);
    const plansZone = createNewElement('div', ClassList.dayPagePlansZone);
    const name = createNewElement('h2', ClassList.dayPageName);
    name.innerText = Days[Number(dayId)].toUpperCase();
    const planList: HTMLUListElement = createNewElement('ul', ClassList.planList);
    this.fillPlanList(planList, allDayPlans);

    tools.append(this.makeReturnToWeekZone(dayId, allDayPlans), this.makeAddButton());
    field.append(tools, plansZone);
    info.append(name, planList);
    container.append(info, field);
    return container;
  }
}

export default PlanLayout;
