import ButtonClasses from '../../../base/enums/buttonClasses';
import ButtonNames from '../../../base/enums/buttonNames';
import ClassList from '../../../base/enums/classList';
import { SetAttribute } from '../../../base/enums/attributes';
import Days from '../../../base/enums/days';
import InnerText from '../../../base/enums/innerText';
import RoutsList from '../../../base/enums/routsList';
import { GoToFn } from '../../../base/types';
import Values from '../../../base/enums/values';

class PlanLayout {
  goTo: GoToFn;

  constructor(goTo: GoToFn) {
    this.goTo = goTo;
  }

  public makeHomeButton(callback: GoToFn) {
    const btn = document.createElement('button');
    btn.innerText = ButtonNames.home;
    btn.classList.add(ButtonClasses.navButton);
    btn.addEventListener('click', () => callback(RoutsList.homePage));
    return btn;
  }

  public makeWeekLine() {
    const weekLine = document.createElement('div');
    weekLine.classList.add(ClassList.weekLine);
    return weekLine;
  }

  public makeWeekText() {
    const weekTextContainer = document.createElement('div');
    weekTextContainer.classList.add(ClassList.weekTextContainer);
    const weekTextValue = document.createElement('div');
    weekTextValue.classList.add(ClassList.weekTextValue);
    const weekText = document.createElement('div');
    weekText.innerText = InnerText.allWeekHours;
    weekTextContainer.append(weekTextValue, weekText);
    return weekTextContainer;
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

  private makeAddButton(openEditorFn: () => void) {
    const btn = document.createElement('button');
    btn.classList.add(ButtonClasses.button, ClassList.planAddButton);

    const name = document.createElement('span');
    name.innerText = ButtonNames.planAddButton;
    name.classList.add(ClassList.planAddButtonName);

    const value = document.createElement('span');
    value.classList.add(ClassList.planAddButtonValue);

    btn.addEventListener('click', () => openEditorFn());

    btn.append(name, value);
    return btn;
  }

  private makeRemoveZone() {
    const remove = document.createElement('div');
    remove.classList.add(ClassList.planRemoveZone);
    const bin = document.createElement('div');
    bin.style.backgroundImage = Values.binImg;
    remove.append(bin);
    return remove;
  }

  public makePlanBody(openEditorFn: () => void) {
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

    buttons.append(this.makeAddButton(openEditorFn), this.makeRemoveZone());
    weekendFields.append(weekendFieldsBig, weekendFieldsSmall);
    planField.append(buttons, weekendFields);
    planBody.append(planDaysContainer, planField);
    return planBody;
  }
}

export default PlanLayout;
