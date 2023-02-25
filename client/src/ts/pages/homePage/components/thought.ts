import {
  createNewElement,
  isHTMLElement,
  getExistentElement,
  getExistentElementByClass,
  makeBanner,
} from '../../../base/helpers';
import { client } from '../data/data';
import { BaseClassList, ThoughtsClassList } from '../../../base/enums/classList';
import Api from '../../../api';
import { ThoughtsData } from '../../../base/interface';
import { SetAttribute, GetAttribute } from '../../../base/enums/attributes';
import FlyingThought from './flyingThought';
import { GoToFn } from '../../../base/types';
import Popup from '../../../components/popup';
import Values from '../../../base/enums/values';
import EditorMode from '../../../base/enums/editorMode';
import ErrorsList from '../../../base/enums/errorsList';
import PlanEditor from '../../../components/planEditor';

class Thought {
  goTo: GoToFn;

  protected editor: PlanEditor;

  fillWeekTime: number;

  thoughtText: string;

  popup: Popup;

  thoughtId: string | undefined;

  canCreate = true;

  constructor(goTo: GoToFn, editor: PlanEditor, popup: Popup, fillWeekTime: number, text: string, id?: string) {
    this.goTo = goTo;
    this.editor = editor;
    this.popup = popup;
    this.fillWeekTime = fillWeekTime;
    this.thoughtText = text;
    this.thoughtId = id;
  }

  async createThought(thoughtText: string) {
    if (!thoughtText) return;
    this.canCreate = false;
    const thoughtAdd = getExistentElement(`.${ThoughtsClassList.thoughtAdd}`);
    thoughtAdd.classList.remove(BaseClassList.open);
    thoughtAdd.classList.add(ThoughtsClassList.thoughtAddHold);

    const text = thoughtText;
    this.thoughtText = '';
    await Api.createThoughts({ title: text });
    const thoughtsDataList = await Api.getThoughts();

    this.createThoughtsList(getExistentElement(`.${ThoughtsClassList.thoughtContainer}`), thoughtsDataList);
    this.createFlyingThought(getExistentElement(`.${BaseClassList.canvas}`), thoughtsDataList);

    getExistentElement<HTMLInputElement>(`.${ThoughtsClassList.thoughtInput}`).value = this.thoughtText;
    getExistentElement(`.${BaseClassList.canvas}`).classList.remove(BaseClassList.none);
    thoughtAdd.classList.remove(ThoughtsClassList.thoughtAddHold);

    this.canCreate = true;
  }

  async convertToPlan(thoughtText: string) {
    this.openCloseThoughtList(
      getExistentElementByClass(ThoughtsClassList.thoughtAdd),
      getExistentElementByClass(BaseClassList.blur)
    );
    if (this.fillWeekTime + Values.minPlanDuration <= Values.allWeekMinutes) {
      this.editor.open(
        Values.minPlanDuration,
        Values.allWeekMinutes - this.fillWeekTime,
        EditorMode.newPlanFromThought,
        undefined,
        undefined,
        this.thoughtId,
        thoughtText
      );
    } else {
      this.popup.editorMode();
      this.popup.open(makeBanner(ErrorsList.freeYourWeekTime));
    }
  }

  async updateThought(thoughtText: string, e: Event) {
    if (!isHTMLElement(e.target) || !e.target.parentElement) return;
    const thoughtId = e.target.parentElement.dataset[GetAttribute.thoughtId];

    if (thoughtId) await Api.updateThought({ _id: thoughtId, title: thoughtText });
  }

  async deleteThought(e: Event) {
    if (!isHTMLElement(e.target) || !e.target.parentElement) return;
    const thought = e.target.parentElement;
    const thoughtId = e.target.parentElement.dataset[GetAttribute.thoughtId];

    thought.classList.add(BaseClassList.none);
    setTimeout(() => thought.parentElement?.removeChild(thought), 350);

    if (!thoughtId) return;
    await Api.deleteThought(thoughtId);
    const thoughtsDataList = await Api.getThoughts();
    this.createFlyingThought(getExistentElement(`.${BaseClassList.canvas}`), thoughtsDataList);
  }

  openCloseThought(e: Event, thoughtAdd: HTMLElement) {
    if (!isHTMLElement(e.target)) return;
    if (this.canCreate) {
      if (e.target.closest(`.${BaseClassList.open}`)) {
        thoughtAdd.classList.remove(BaseClassList.open);
        if (!getExistentElementByClass(ThoughtsClassList.thoughtAdd).classList.contains('none')) {
          getExistentElement(`.${BaseClassList.canvas}`).classList.remove(BaseClassList.none);
        }
      } else {
        thoughtAdd.classList.add(BaseClassList.open);
        if (e.target.closest(`.${ThoughtsClassList.thoughtAdd}`))
          getExistentElement(`.${BaseClassList.canvas}`).classList.add(BaseClassList.none);
      }
    }
  }

  openCloseThoughtList(thoughtAdd: HTMLElement, popup: HTMLElement) {
    if (this.canCreate) {
      thoughtAdd.classList.toggle(BaseClassList.none);
      popup.classList.toggle(BaseClassList.none);

      document.querySelectorAll(`.${ThoughtsClassList.thoughtItem}`).forEach((el) => {
        if (thoughtAdd.classList.contains('none')) {
          el.classList.add(BaseClassList.open);
          thoughtAdd.classList.remove(BaseClassList.open);
          getExistentElement(`.${BaseClassList.canvas}`).classList.add(BaseClassList.none);
        } else {
          getExistentElement(`.${BaseClassList.canvas}`).classList.remove(BaseClassList.none);
        }
        el.classList.toggle(BaseClassList.none);
      });
    }
  }

  async createThoughtsList(thoughtContainer: HTMLElement, thoughtsDataList: ThoughtsData[]) {
    thoughtContainer.innerHTML = '';
    const thoughtsArr: Thought[] = [];
    thoughtsDataList.forEach((thoughtDataEl: ThoughtsData) => {
      thoughtsArr.push(
        new Thought(this.goTo, this.editor, this.popup, this.fillWeekTime, thoughtDataEl.title, thoughtDataEl._id)
      );
    });

    for (let i = 0; i < thoughtsArr.length; i += 1) {
      const thoughtEl = thoughtsArr[i].draw(ThoughtsClassList.thoughtItem);
      thoughtContainer.append(thoughtEl);
    }
  }

  createFlyingThought(canvas: HTMLCanvasElement, thoughtsDataList: ThoughtsData[]) {
    const ctx = canvas.getContext('2d');
    const thoughtsArray: FlyingThought[] = [];

    thoughtsDataList.forEach((thought: ThoughtsData) => {
      const radius = 20;
      const id = thought._id;
      if (!id) return;
      const x = Math.random() * (client.width - radius * 2) + radius;
      const y = Math.random() * (client.height - radius * 2) + radius;
      const dx = (Math.random() - 0.5) * 2;
      const dy = (Math.random() - 0.5) * 2;
      thoughtsArray.push(new FlyingThought(id, x, y, dx, dy, radius));
    });

    if (ctx) {
      const animate = () => {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, client.width, client.height);
        for (let i = 0; i < thoughtsArray.length; i += 1) {
          thoughtsArray[i].draw(ctx);
          thoughtsArray[i].thoughtCollision(thoughtsArray);
        }
        this.updateHeight();
        const planBorder = new FlyingThought('planCircle', client.planPosWidth, client.planPosHeight, 1, 1, 100);
        if (ctx) planBorder.drawCircles(ctx);

        const clockCircle = new FlyingThought('clockCircle', client.clockPosWidth, client.clockPosHeight, 1, 1, 330);
        if (ctx) clockCircle.drawCircles(ctx);
        planBorder.thoughtCollision([...thoughtsArray, planBorder, clockCircle]);
        clockCircle.thoughtCollision([...thoughtsArray, planBorder, clockCircle]);
      };
      animate();
    }
  }

  private updateHeight() {
    const documentHeight = document.documentElement.clientHeight;
    client.height = documentHeight;
    client.planPosHeight = documentHeight / 2 - 15;
    client.clockPosHeight = documentHeight / 2 - 15;
  }

  draw(elClass: string) {
    const thoughtAdd = createNewElement('div', elClass);
    const thoughtAddBtn = createNewElement('div', ThoughtsClassList.thoughtAddBtn);
    thoughtAdd.classList.add(BaseClassList.none);

    const thoughtInput = createNewElement<HTMLInputElement>('input', ThoughtsClassList.thoughtInput);
    thoughtInput.value = this.thoughtText;

    if (this.thoughtId !== undefined) thoughtAdd.setAttribute(SetAttribute.thoughtId, this.thoughtId.toString());

    thoughtInput.addEventListener('blur', (e) => {
      if (!thoughtInput.value) return;
      this.thoughtText = thoughtInput.value;
      if (elClass === ThoughtsClassList.thoughtItem) this.updateThought(this.thoughtText, e);
    });

    const thoughtCreate = createNewElement('div', ThoughtsClassList.thoughtCreateBtn);

    thoughtCreate.addEventListener('click', () => {
      if (elClass === ThoughtsClassList.thoughtItem) {
        this.convertToPlan(this.thoughtText);
      } else {
        this.createThought(this.thoughtText);
      }
    });

    thoughtAdd.append(thoughtInput);
    thoughtAddBtn.addEventListener('click', (e) => this.openCloseThought(e, thoughtAdd));

    if (elClass === ThoughtsClassList.thoughtItem) {
      const thoughtRemove = createNewElement('div', ThoughtsClassList.thoughtRemoveBtn);

      thoughtRemove.addEventListener('click', (e) => this.deleteThought(e));
      thoughtAdd.append(thoughtRemove);
    }

    thoughtAdd.append(thoughtCreate, thoughtAddBtn);
    return thoughtAdd;
  }
}

export default Thought;
