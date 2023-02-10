import { GetAttribute, SetAttribute } from '../../../base/enums/attributes';
import ClassList from '../../../base/enums/classList';
import ErrorsList from '../../../base/enums/errorsList';
import InnerText from '../../../base/enums/innerText';
import { getExistentElementByClass, getExistentInputElement, makeElement } from '../../../base/helpers';
import { Plan } from '../../../base/interface';
import colorsAndFonts from '../../../components/colorsAndFonts';
import Popup from '../../../components/popup';
import TimeSlider from './timeSlider';
import defaultPlan from './defaultPlan';
import savePlanIcon from './savePlanIcon';
import Values from '../../../base/enums/values';

class PlanEditor {
  popup: Popup;

  plan: Plan;

  slider: TimeSlider;

  pickedColor: string | undefined;

  constructor(popup: Popup) {
    this.popup = popup;
    this.plan = defaultPlan;
    this.open = this.open.bind(this);
    this.slider = new TimeSlider();
    this.saveToLocalStorage = this.saveToLocalStorage.bind(this);
  }

  public open(minTime: number, maxTime: number, plan?: Plan) {
    this.slider.setTimer(minTime, maxTime, plan?.duration);
    console.log(plan?.duration);
    if (plan) {
      this.plan = plan;
      this.popup.editorMode(this.sendPlan);
    } else {
      this.popup.newPlanMode(this.saveToLocalStorage);
      this.loadToLocalStorage();
    }
    this.drawEditor();
  }

  private sendPlan() {
    console.log('send plan');
  }

  private saveToLocalStorage() {
    this.setPlan();
    localStorage.setItem(Values.newPlanSave, JSON.stringify(this.plan));
  }

  private loadToLocalStorage() {
    const savePlan = localStorage.getItem(Values.newPlanSave);
    this.plan = savePlan ? JSON.parse(savePlan) : defaultPlan;
  }

  private setPlan() {
    if (this.pickedColor) this.plan.color = this.pickedColor;
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
    const container = makeElement(ClassList.editorButton);

    container.innerHTML = savePlanIcon(secColor, ClassList.editorSaveIcon);
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
        this.pickedColor = color;
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
