/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { GetAttribute, SetAttribute } from '../base/enums/attributes';
import { EditorClassList, MainClassList } from '../base/enums/classList';
import ErrorsList from '../base/enums/errorsList';
import {
  buttonOff,
  createNewElement,
  getColors,
  getExistentElementByClass,
  getExistentInputElement,
  loginRedirect,
} from '../base/helpers';
import { Plan } from '../base/interface';
import Popup from './popup';
import Values from '../base/enums/values';
import EditorMode from '../base/enums/editorMode';
import Api from '../api';
import { GoToFn } from '../base/types';
import RoutsList from '../base/enums/routsList';
import InnerText from '../base/enums/innerText';
import Days from '../base/enums/days';
import { colorsAndFonts } from './colorsAndFonts';
import TimeSlider from '../pages/planPage/components/timeSlider';
import defaultPlan from '../pages/planPage/components/defaultPlan';
import savePlanIcon from '../pages/planPage/components/savePlanIcon';

class PlanEditor {
  goTo: GoToFn;

  popup: Popup;

  plan: Plan;

  slider: TimeSlider;

  pickedColor: string | undefined;

  mode: EditorMode;

  dayId = '';

  thoughtId = '';

  oldDur = 0;

  constructor(popup: Popup, goTo: GoToFn) {
    this.goTo = goTo;
    this.mode = EditorMode.newPlanFromWeek;
    this.popup = popup;
    this.plan = { ...defaultPlan };
    this.open = this.open.bind(this);
    this.slider = new TimeSlider();
    this.saveToLocalStorage = this.saveToLocalStorage.bind(this);
    this.sendPlan = this.sendPlan.bind(this);
  }

  public open(
    minTime: number,
    maxTime: number,
    mode: EditorMode,
    plan?: Plan,
    dayId?: string,
    thoughtId?: string,
    title?: string
  ) {
    this.mode = mode;
    this.dayId = '';
    this.slider.setTimer(minTime, maxTime, plan?.duration);

    switch (this.mode) {
      case EditorMode.editWeekPlan:
        if (plan) this.plan = { ...plan };
        this.popup.editorMode();
        break;

      case EditorMode.editDayPlan:
        if (plan) this.plan = { ...plan };
        if (plan) this.oldDur = { ...plan }.duration;
        if (dayId) this.dayId = dayId;
        this.popup.editorMode();
        break;

      case EditorMode.newPlanFromWeek:
        this.popup.editorMode(this.saveToLocalStorage);
        this.loadToLocalStorage();
        break;

      case EditorMode.newPlanFromThought:
        this.popup.editorMode();
        this.loadToLocalStorage();
        if (title) this.plan.title = title;
        if (thoughtId) this.thoughtId = thoughtId;
        break;

      case EditorMode.newPlanFromDay:
        if (dayId) this.dayId = dayId;
        this.popup.editorMode(this.saveToLocalStorage);
        this.loadToLocalStorage();
        break;

      default:
        break;
    }
    this.drawEditor();
  }

  private loadToLocalStorage() {
    const savedNewPlan = localStorage.getItem(`${Values.locStorNewPlanName}/${this.dayId}`);
    if (savedNewPlan) {
      this.plan = JSON.parse(savedNewPlan);
    } else {
      this.plan = { ...defaultPlan };
      this.plan.color = this.getRandomColorId();
    }
  }

  private async sendPlan() {
    this.setPlan();
    const { _id, title, text, color, duration } = this.plan;
    const dayOpt = { dayOfWeek: Number(this.dayId), planId: this.plan._id, duration: this.plan.duration - this.oldDur };
    switch (this.mode) {
      case EditorMode.newPlanFromWeek:
        await Api.createNewPlan({ title, text, color, duration });
        localStorage.removeItem(`${Values.locStorNewPlanName}/${this.dayId}`);
        break;

      case EditorMode.newPlanFromThought:
        await Api.convertToPlan({ title, text, color, duration }, this.thoughtId);
        break;

      case EditorMode.editWeekPlan:
        await Api.editPlan({ _id, title, text, color, duration });
        break;

      case EditorMode.editDayPlan:
        await Api.editPlan({ _id, title, text, color });
        await Api.pushPlanToDay(dayOpt);
        break;

      case EditorMode.newPlanFromDay:
        // eslint-disable-next-line no-case-declarations
        const newPlan = await Api.createNewPlan({ title, text, color, duration });
        await Api.pushPlanToDay({
          dayOfWeek: Number(this.dayId),
          planId: newPlan._id,
          duration: newPlan.duration,
        });
        localStorage.removeItem(`${Values.locStorNewPlanName}/${this.dayId}`);
        break;

      default:
        break;
    }
  }

  private saveToLocalStorage() {
    this.setPlan();
    localStorage.setItem(`${Values.locStorNewPlanName}/${this.dayId}`, JSON.stringify(this.plan));
  }

  private setPlan() {
    this.plan.duration = this.slider.currentTime;
    this.plan.title = getExistentInputElement(`.${EditorClassList.editorTitle}`).value;
    const textArea = document.querySelector(`.${EditorClassList.editorText}`);
    if (textArea instanceof HTMLTextAreaElement) this.plan.text = textArea.value;
  }

  private getRandomColorId() {
    const min = 1;
    const max = colorsAndFonts.length;
    return (Math.floor(Math.random() * (max - min)) + min).toString();
  }

  private drawEditor() {
    const [bgColor, fontColor] = getColors(this.plan.color);
    const container = this.makeContainer(bgColor, fontColor);
    const tools = createNewElement('div', EditorClassList.editorTools);

    tools.append(
      this.makeAcceptButton(fontColor),
      this.colorPicker(),
      this.makeColorBox(),
      this.slider.draw(this.mode)
    );
    container.append(tools, this.makeTitle(), this.makeText());
    this.popup.open(container);
  }

  private makeContainer(bgColor: string, fontColor: string) {
    const editor = createNewElement('div', EditorClassList.editor);
    editor.style.backgroundColor = bgColor;
    editor.style.color = fontColor;
    return editor;
  }

  private makeTitle() {
    const title = document.createElement('input');
    title.classList.add(EditorClassList.editorTitle);
    title.value = this.plan.title;
    title.addEventListener('blur', function trim() {
      this.value = this.value.trim();
    });
    title.addEventListener('blur', (e) => {
      const { target } = e;
      if (target instanceof HTMLInputElement) {
        if (target.value === '') {
          target.value = InnerText.defaultPlanName;
        }
      }
    });
    title.addEventListener('focus', (e) => {
      const { target } = e;
      if (target instanceof HTMLInputElement) {
        if (target.value === InnerText.defaultPlanName) {
          target.value = '';
        }
      }
    });
    return title;
  }

  private makeText() {
    const text = document.createElement('textarea');
    text.classList.add(EditorClassList.editorText);
    text.value = this.plan.text;
    return text;
  }

  private makeAcceptButton(secColor: string) {
    const container = document.createElement('button');
    container.classList.add(EditorClassList.editorButton);
    container.innerHTML = savePlanIcon(secColor, EditorClassList.editorSaveIcon);

    container.addEventListener('click', async (e) => {
      const { currentTarget } = e;
      if (!(currentTarget instanceof HTMLButtonElement)) throw new Error(ErrorsList.elementIsNotButton);
      buttonOff(currentTarget);

      try {
        this.popup.easyClose();
        getExistentElementByClass(MainClassList.mainContainer).classList.add(MainClassList.mainContainerHide);
        await this.sendPlan();
        this.goTo(!this.dayId ? RoutsList.planPage : `/${Days[Number(this.dayId)]}`);
      } catch (error) {
        this.popup.easyClose();
        loginRedirect(error, this.goTo);
      }
    });
    return container;
  }

  private colorPicker() {
    const container = createNewElement('div', EditorClassList.editorColorPicker);

    container.addEventListener('click', () => this.toggleColorBox());
    return container;
  }

  private makeColorBox() {
    const box = createNewElement('div', EditorClassList.editorColorBox);

    colorsAndFonts.forEach((_value, id) => {
      if (id !== 0) box.append(this.makeColorRound(id.toString()));
    });

    return box;
  }

  private makeColorRound(colorId: string) {
    const [bgColor] = getColors(colorId);
    const round = createNewElement('div', EditorClassList.editorColorRound);
    round.style.backgroundColor = bgColor;
    round.setAttribute(SetAttribute.pickerColor, colorId);

    round.addEventListener('click', () => this.toggleColorBox());
    round.addEventListener('click', (e) => this.changeColor(e));
    return round;
  }

  private changeColor(e: Event) {
    const { target } = e;
    if (target instanceof HTMLElement) {
      const colorId = target.dataset[GetAttribute.pickerColor];
      if (colorId) {
        this.plan.color = colorId;
        this.paintEditor(colorId);
      }
    }
  }

  private paintEditor(colorId: string) {
    const [bgColor, fontColor] = getColors(colorId);
    const editor = getExistentElementByClass(EditorClassList.editor);
    editor.style.backgroundColor = bgColor;
    editor.style.color = fontColor;
    getExistentElementByClass(EditorClassList.editorSaveIcon).style.stroke = fontColor;
  }

  private toggleColorBox() {
    getExistentElementByClass(EditorClassList.editorColorBox).classList.toggle(EditorClassList.editorColorBoxActive);
  }
}

export default PlanEditor;
