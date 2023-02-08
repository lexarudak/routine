import { GetAttribute, SetAttribute } from '../../../base/enums/attributes';
import ClassList from '../../../base/enums/classList';
import ErrorsList from '../../../base/enums/errorsList';
import Values from '../../../base/enums/values';
import { getExistentElementByClass } from '../../../base/helpers';
import { Plan } from '../../../base/interface';
import colorsAndFonts from '../../../components/colorsAndFonts';
import Popup from '../../../components/popup';
import defaultPlan from './defaultPlan';

class PlanEditor {
  popup: Popup;

  plan: Plan;

  error: HTMLElement;

  constructor(popup: Popup) {
    this.popup = popup;
    this.plan = defaultPlan;
    this.open = this.open.bind(this);
    this.error = this.makeErrorMessage();
  }

  public open(plan?: Plan) {
    console.log('open', this);
    if (plan) this.plan = plan;
    this.drawEditor();
  }

  private drawEditor() {
    const secColor = colorsAndFonts.get(this.plan.color);
    if (!secColor) throw new Error(ErrorsList.notStandardColor);
    const container = this.makeContainer(secColor);
    const tools = document.createElement('div');
    tools.classList.add(ClassList.editorTools);

    tools.append(this.makeAcceptButton(), this.colorPicker(), this.makeColorBox());
    container.append(tools, this.makeTitle(), this.error, this.makeText());
    this.popup.open(container);
  }

  private makeContainer(secColor: string) {
    const editor = document.createElement('div');
    editor.classList.add(ClassList.editor);
    editor.style.backgroundColor = this.plan.color;
    editor.style.color = secColor;
    return editor;
  }

  private makeErrorMessage() {
    const error = document.createElement('div');
    error.innerHTML = ErrorsList.cantBeEmpty;
    error.classList.add(ClassList.editorError);
    return error;
  }

  private makeTitle() {
    const title = document.createElement('input');
    title.setAttribute('placeholder', Values.namePlaceholder);
    title.classList.add(ClassList.editorTitle);
    title.value = this.plan.title;
    title.addEventListener('blur', function trim() {
      this.value = this.value.trim();
    });
    title.addEventListener('blur', (e) => {
      const { target } = e;
      if (target instanceof HTMLInputElement) {
        if (target.value === '') this.error.classList.add(ClassList.editorErrorActive);
      }
    });
    title.addEventListener('focus', () => this.error.classList.remove(ClassList.editorErrorActive));
    return title;
  }

  private makeText() {
    const text = document.createElement('textarea');
    text.setAttribute('placeholder', Values.textPlaceholder);
    text.classList.add(ClassList.editorText);
    text.value = this.plan.text;
    return text;
  }

  private makeAcceptButton() {
    const container = document.createElement('div');
    container.classList.add(ClassList.editorButton);
    const left = document.createElement('span');
    left.classList.add(ClassList.editorButtonSpan, ClassList.editorButtonSpanLeft);
    const right = document.createElement('span');
    right.classList.add(ClassList.editorButtonSpan, ClassList.editorButtonSpanRight);

    container.append(left, right);
    return container;
  }

  private colorPicker() {
    const container = document.createElement('div');
    container.classList.add(ClassList.editorColorPicker);

    container.addEventListener('click', () => this.toggleColorBox());

    return container;
  }

  private makeColorBox() {
    const box = document.createElement('div');
    box.classList.add(ClassList.editorColorBox);
    box.style.backgroundColor = this.plan.color;

    colorsAndFonts.forEach((_value, color) => {
      box.append(this.makeColorRound(color));
    });

    return box;
  }

  private makeColorRound(color: string) {
    const round = document.createElement('div');
    round.classList.add(ClassList.editorColorRound);
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
        this.paintEditor();
      }
    }
  }

  private paintEditor() {
    const editor = getExistentElementByClass(ClassList.editor);
    editor.style.backgroundColor = this.plan.color;
    const secondColor = colorsAndFonts.get(this.plan.color);
    if (secondColor) editor.style.color = secondColor;
  }

  private toggleColorBox() {
    getExistentElementByClass(ClassList.editorColorBox).classList.toggle(ClassList.editorColorBoxActive);
  }
}

export default PlanEditor;
