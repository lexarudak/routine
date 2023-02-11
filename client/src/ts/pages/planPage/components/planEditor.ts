/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/naming-convention */
import { GetAttribute, SetAttribute } from '../../../base/enums/attributes';
import ClassList from '../../../base/enums/classList';
import ErrorsList from '../../../base/enums/errorsList';
import InnerText from '../../../base/enums/innerText';
import {
  buttonOff,
  buttonOn,
  getExistentElementByClass,
  getExistentInputElement,
  makeElement,
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

class PlanEditor {
  goTo: GoToFn;

  popup: Popup;

  plan: Plan;

  slider: TimeSlider;

  pickedColor: string | undefined;

  mode: EditorMode;

  constructor(popup: Popup, goTo: GoToFn) {
    this.goTo = goTo;
    this.mode = EditorMode.newPlan;
    this.popup = popup;
    this.plan = defaultPlan;
    this.open = this.open.bind(this);
    this.slider = new TimeSlider();
    this.saveToLocalStorage = this.saveToLocalStorage.bind(this);
    this.sendPlan = this.sendPlan.bind(this);
  }

  public open(minTime: number, maxTime: number, plan?: Plan) {
    this.slider.setTimer(minTime, maxTime, plan?.duration);
    console.log(plan);
    if (plan) {
      this.mode = EditorMode.editPlan;
      this.plan = { ...plan };
      this.popup.editorMode(this.sendPlan);
      this.loadToLocalStorage();
    } else {
      console.log('new plan mode');
      this.mode = EditorMode.newPlan;
      this.popup.newPlanMode(this.saveToLocalStorage);
      this.loadToLocalStorage();
    }
    this.drawEditor();
  }

  private loadToLocalStorage() {
    console.log('load');
    const savedNewPlan = localStorage.getItem(Values.newPlanSave);
    const savedExistPlan = localStorage.getItem(this.plan._id);
    switch (this.mode) {
      case EditorMode.newPlan:
        console.log(savedNewPlan);
        this.plan = savedNewPlan ? JSON.parse(savedNewPlan) : defaultPlan;
        break;
      case EditorMode.editPlan:
        this.plan = savedExistPlan ? JSON.parse(savedExistPlan) : this.plan;
        localStorage.removeItem(this.plan._id);
        break;

      default:
        break;
    }
  }

  private async sendPlan() {
    this.setPlan();
    const { _id, title, text, color, duration } = this.plan;
    switch (this.mode) {
      case EditorMode.newPlan:
        await Api.createNewPlan({ title, text, color, duration });
        localStorage.removeItem(Values.newPlanSave);
        break;
      case EditorMode.editPlan:
        await Api.editPlan({ _id, title, text, color, duration });
        break;

      default:
        break;
    }
  }

  private saveToLocalStorage() {
    this.setPlan();
    switch (this.mode) {
      case EditorMode.newPlan:
        localStorage.setItem(Values.newPlanSave, JSON.stringify(this.plan));
        break;
      case EditorMode.editPlan:
        localStorage.setItem(this.plan._id, JSON.stringify(this.plan));
        break;

      default:
        break;
    }
  }

  private setPlan() {
    this.plan.duration = Number(getExistentInputElement(`.${ClassList.timeContainerSlider}`).value);
    this.plan.title = getExistentInputElement(`.${ClassList.editorTitle}`).value;
    const textArea = document.querySelector(`.${ClassList.editorText}`);
    if (textArea instanceof HTMLTextAreaElement) this.plan.text = textArea.value;
  }

  private drawEditor() {
    const secColor = colorsAndFonts.get(this.plan.color);
    if (!secColor) throw new Error(ErrorsList.notStandardColor);
    const container = this.makeContainer(secColor);
    const tools = makeElement(ClassList.editorTools);

    tools.append(this.makeAcceptButton(secColor), this.colorPicker(), this.makeColorBox(), this.slider.draw());
    container.append(tools, this.makeTitle(), this.makeText());
    this.popup.open(container);
  }

  private makeContainer(secColor: string) {
    const editor = makeElement(ClassList.editor);
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
    console.log(this.plan.text);
    return text;
  }

  private makeAcceptButton(secColor: string) {
    const container = document.createElement('button');
    container.classList.add(ClassList.editorButton);
    container.innerHTML = savePlanIcon(secColor, ClassList.editorSaveIcon);

    container.addEventListener('click', async () => {
      buttonOff(container);
      try {
        await this.sendPlan();
        this.goTo(RoutsList.planPage);
      } catch (error) {
        if (error instanceof Error) {
          this.saveToLocalStorage();
          if (error.message === ErrorsList.needLogin) {
            this.goTo(RoutsList.loginPage);
          }
        }
      } finally {
        buttonOn(container);
        this.popup.easyClose();
      }
    });
    return container;
  }

  private colorPicker() {
    const container = makeElement(ClassList.editorColorPicker);

    container.addEventListener('click', () => this.toggleColorBox());
    return container;
  }

  private makeColorBox() {
    const box = makeElement(ClassList.editorColorBox);

    colorsAndFonts.forEach((_value, color) => {
      box.append(this.makeColorRound(color));
    });

    return box;
  }

  private makeColorRound(color: string) {
    const round = makeElement(ClassList.editorColorRound);
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
