/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { GetAttribute, SetAttribute } from '../../../base/enums/attributes';
import { ClassList } from '../../../base/enums/classList';
import ErrorsList from '../../../base/enums/errorsList';
import {
  buttonOff,
  createNewElement,
  getExistentElementByClass,
  getExistentInputElement,
  loginRedirect,
} from '../../../base/helpers';
import { Plan } from '../../../base/interface';
import colorsAndFonts from '../../../components/colorsAndFonts';
import Popup from '../../../components/popup';
import TimeSlider from './timeSlider';
import defaultPlan from './defaultPlan';
import savePlanIcon from './savePlanIcon';
import Values from '../../../base/enums/values';
import EditorMode from '../../../base/enums/editorMode';
import Api from '../../../api';
import { GoToFn } from '../../../base/types';
import RoutsList from '../../../base/enums/routsList';
import InnerText from '../../../base/enums/innerText';
import Days from '../../../base/enums/days';

class PlanEditor {
  goTo: GoToFn;

  popup: Popup;

  plan: Plan;

  slider: TimeSlider;

  pickedColor: string | undefined;

  mode: EditorMode;

  dayId = '';

  oldDur = 0;

  constructor(popup: Popup, goTo: GoToFn) {
    this.goTo = goTo;
    this.mode = EditorMode.newPlan;
    this.popup = popup;
    this.plan = { ...defaultPlan };
    this.open = this.open.bind(this);
    this.slider = new TimeSlider();
    this.saveToLocalStorage = this.saveToLocalStorage.bind(this);
    this.sendPlan = this.sendPlan.bind(this);
  }

  public open(minTime: number, maxTime: number, mode: EditorMode, plan?: Plan, dayId?: string) {
    this.mode = mode;
    this.dayId = '';
    this.slider.setTimer(minTime, maxTime, plan?.duration);

    switch (this.mode) {
      case EditorMode.editPlan:
        if (plan) this.plan = { ...plan };
        this.popup.editorMode();
        break;

      case EditorMode.day:
        if (plan) this.plan = { ...plan };
        if (plan) this.oldDur = { ...plan }.duration;
        if (dayId) this.dayId = dayId;
        this.popup.editorMode();
        break;

      case EditorMode.newPlan:
        this.popup.editorMode(this.saveToLocalStorage);
        this.loadToLocalStorage();
        break;

      default:
        break;
    }
    this.drawEditor();
  }

  private loadToLocalStorage() {
    const savedNewPlan = localStorage.getItem(Values.newPlanSave);
    if (savedNewPlan) {
      this.plan = JSON.parse(savedNewPlan);
    } else {
      this.plan = { ...defaultPlan };
      this.plan.color = this.getRandomColor();
    }
  }

  private async sendPlan() {
    this.setPlan();
    const { _id, title, text, color, duration } = this.plan;
    const dayOpt = { dayOfWeek: Number(this.dayId), planId: this.plan._id, duration: this.plan.duration - this.oldDur };
    switch (this.mode) {
      case EditorMode.newPlan:
        await Api.createNewPlan({ title, text, color, duration });
        localStorage.removeItem(Values.newPlanSave);
        break;

      case EditorMode.editPlan:
        await Api.editPlan({ _id, title, text, color, duration });
        break;

      case EditorMode.day:
        await Api.editPlan({ _id, title, text, color });
        await Api.pushPlanToDay(dayOpt);
        break;

      default:
        break;
    }
  }

  private saveToLocalStorage() {
    this.setPlan();
    localStorage.setItem(Values.newPlanSave, JSON.stringify(this.plan));
  }

  private setPlan() {
    this.plan.duration = this.slider.currentTime;
    this.plan.title = getExistentInputElement(`.${ClassList.editorTitle}`).value;
    const textArea = document.querySelector(`.${ClassList.editorText}`);
    if (textArea instanceof HTMLTextAreaElement) this.plan.text = textArea.value;
  }

  private getRandomColor() {
    const maxVal = colorsAndFonts.size;
    const num = Math.floor(Math.random() * maxVal);
    const arr: string[] = [];
    colorsAndFonts.forEach((_font, color) => {
      arr.push(color);
    });
    return arr[num];
  }

  private drawEditor() {
    const secColor = colorsAndFonts.get(this.plan.color);
    if (!secColor) throw new Error(ErrorsList.notStandardColor);
    const container = this.makeContainer(secColor);
    const tools = createNewElement('div', ClassList.editorTools);

    tools.append(this.makeAcceptButton(secColor), this.colorPicker(), this.makeColorBox(), this.slider.draw());
    container.append(tools, this.makeTitle(), this.makeText());
    this.popup.open(container);
  }

  private makeContainer(secColor: string) {
    const editor = createNewElement('div', ClassList.editor);
    editor.style.backgroundColor = this.plan.color;
    editor.style.color = secColor;
    return editor;
  }

  private makeTitle() {
    const title = document.createElement('input');
    title.classList.add(ClassList.editorTitle);
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
    text.classList.add(ClassList.editorText);
    text.value = this.plan.text;
    return text;
  }

  private makeAcceptButton(secColor: string) {
    const container = document.createElement('button');
    container.classList.add(ClassList.editorButton);
    container.innerHTML = savePlanIcon(secColor, ClassList.editorSaveIcon);

    container.addEventListener('click', async (e) => {
      const { currentTarget } = e;
      if (!(currentTarget instanceof HTMLButtonElement)) throw new Error(ErrorsList.elementIsNotButton);
      buttonOff(currentTarget);

      try {
        await this.sendPlan();
        this.goTo(!this.dayId ? RoutsList.planPage : `/${Days[Number(this.dayId)]}`);
      } catch (error) {
        console.log(error);
        loginRedirect(error, this.goTo);
      } finally {
        this.popup.easyClose();
      }
    });
    return container;
  }

  private colorPicker() {
    const container = createNewElement('div', ClassList.editorColorPicker);

    container.addEventListener('click', () => this.toggleColorBox());
    return container;
  }

  private makeColorBox() {
    const box = createNewElement('div', ClassList.editorColorBox);

    colorsAndFonts.forEach((_value, color) => {
      box.append(this.makeColorRound(color));
    });

    return box;
  }

  private makeColorRound(color: string) {
    const round = createNewElement('div', ClassList.editorColorRound);
    round.style.backgroundColor = color;
    round.setAttribute(SetAttribute.pickerColor, color);

    round.addEventListener('click', () => this.toggleColorBox());
    round.addEventListener('click', (e) => this.changeColor(e));
    return round;
  }

  private changeColor(e: Event) {
    const { target } = e;
    if (target instanceof HTMLElement) {
      const color = target.dataset[GetAttribute.pickerColor];
      if (color) {
        this.plan.color = color;
        this.paintEditor(color);
      }
    }
  }

  private paintEditor(color: string) {
    const editor = getExistentElementByClass(ClassList.editor);
    editor.style.backgroundColor = color;
    const secondColor = colorsAndFonts.get(color);
    if (secondColor) {
      editor.style.color = secondColor;
      getExistentElementByClass(ClassList.editorSaveIcon).style.stroke = secondColor;
    }
  }

  private toggleColorBox() {
    getExistentElementByClass(ClassList.editorColorBox).classList.toggle(ClassList.editorColorBoxActive);
  }
}

export default PlanEditor;
