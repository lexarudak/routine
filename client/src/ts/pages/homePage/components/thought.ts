import {
  createElement,
  createNewElement,
  isHTMLElement,
  getExistentElement,
  client,
  getExistentElementByClass,
} from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';
import Api from '../../../api';
import { ThoughtsData } from '../../../base/interface';
import { SetAttribute, GetAttribute } from '../../../base/enums/attributes';
import FlyingThought from './flyingThought';
import { GoToFn } from '../../../base/types';
// import RoutsList from '../../../base/enums/routsList';
// import Path from '../../../base/enums/path';
import PlanEditor from '../../planPage/components/planEditor';
// import Values from '../../../base/enums/values';
// import EditorMode from '../../../base/enums/editorMode';

class Thought {
  goTo: GoToFn;

  protected editor: PlanEditor;

  thoughtText: string;

  thoughtId: string | undefined;

  canCreate = true;

  constructor(goTo: GoToFn, editor: PlanEditor, text: string, id?: string) {
    this.goTo = goTo;
    this.editor = editor;
    this.thoughtText = text;
    this.thoughtId = id;
  }

  async createThought(thoughtText: string) {
    if (!thoughtText) return;
    this.canCreate = false;
    const thoughtAdd = getExistentElement(`.${HomePageClassList.thoughtAdd}`);
    thoughtAdd.classList.remove(HomePageClassList.open);
    thoughtAdd.classList.add(HomePageClassList.thoughtAddHold);

    const text = thoughtText;
    this.thoughtText = '';
    await Api.createThoughts({ title: text });
    const thoughtsDataList = await Api.getThoughts();

    this.createThoughtsList(getExistentElement(`.${HomePageClassList.thoughtContainer}`), thoughtsDataList);
    this.createFlyingThought(getExistentElement(`.${HomePageClassList.canvas}`), thoughtsDataList);

    getExistentElement<HTMLInputElement>(`.${HomePageClassList.thoughtInput}`).value = this.thoughtText;
    getExistentElement(`.${HomePageClassList.canvas}`).classList.remove(HomePageClassList.none);
    thoughtAdd.classList.remove(HomePageClassList.thoughtAddHold);

    this.canCreate = true;
  }

  async convertToPlan(thoughtText: string, e: Event) {
    console.log(thoughtText, e);
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

    thought.classList.add(HomePageClassList.none);
    setTimeout(() => thought.parentElement?.removeChild(thought), 350);

    if (!thoughtId) return;
    const deletedThought = await Api.deleteThought(thoughtId);
    const thoughtsDataList = await Api.getThoughts();
    console.log('deletedThought', deletedThought);
    this.createFlyingThought(getExistentElement(`.${HomePageClassList.canvas}`), thoughtsDataList);
  }

  openCloseThought(e: Event, thoughtAdd: HTMLElement) {
    if (!isHTMLElement(e.target)) return;
    if (this.canCreate) {
      if (e.target.closest(`.${HomePageClassList.open}`)) {
        thoughtAdd.classList.remove(HomePageClassList.open);
        if (!getExistentElementByClass(HomePageClassList.thoughtAdd).classList.contains('none')) {
          getExistentElement(`.${HomePageClassList.canvas}`).classList.remove(HomePageClassList.none);
        }
      } else {
        thoughtAdd.classList.add(HomePageClassList.open);
        if (e.target.closest(`.${HomePageClassList.thoughtAdd}`))
          getExistentElement(`.${HomePageClassList.canvas}`).classList.add(HomePageClassList.none);
      }
    }
  }

  openCloseThoughtList(thoughtAdd: HTMLElement, popup: HTMLElement) {
    console.log('can create ', this.canCreate);
    if (this.canCreate) {
      console.log('toggle');
      thoughtAdd.classList.toggle(HomePageClassList.none);
      popup.classList.toggle(HomePageClassList.none);

      document.querySelectorAll(`.${HomePageClassList.thoughtItem}`).forEach((el) => {
        if (thoughtAdd.classList.contains('none')) {
          el.classList.add(HomePageClassList.open);
          thoughtAdd.classList.remove(HomePageClassList.open);
          getExistentElement(`.${HomePageClassList.canvas}`).classList.add(HomePageClassList.none);
        } else {
          getExistentElement(`.${HomePageClassList.canvas}`).classList.remove(HomePageClassList.none);
        }
        el.classList.toggle(HomePageClassList.none);
      });
    }
  }

  async createThoughtsList(thoughtContainer: HTMLElement, thoughtsDataList: ThoughtsData[]) {
    thoughtContainer.innerHTML = '';
    const thoughtsArr: Thought[] = [];
    thoughtsDataList.forEach((thoughtDataEl: ThoughtsData) => {
      thoughtsArr.push(new Thought(this.goTo, this.editor, thoughtDataEl.title, thoughtDataEl._id));
    });

    for (let i = 0; i < thoughtsArr.length; i += 1) {
      const thoughtEl = thoughtsArr[i].draw(HomePageClassList.thoughtItem);
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
    const thoughtAdd = createElement('div', elClass);
    const thoughtAddBtn = createElement('div', HomePageClassList.thoughtAddBtn);
    thoughtAdd.classList.add(HomePageClassList.none);

    const thoughtInput = createNewElement<HTMLInputElement>('input', HomePageClassList.thoughtInput);
    thoughtInput.value = this.thoughtText;

    if (this.thoughtId !== undefined) thoughtAdd.setAttribute(SetAttribute.thoughtId, this.thoughtId.toString());

    thoughtInput.addEventListener('blur', (e) => {
      if (!thoughtInput.value) return;
      this.thoughtText = thoughtInput.value;
      if (elClass === HomePageClassList.thoughtItem) this.updateThought(this.thoughtText, e);
    });

    const thoughtCreate = createNewElement('div', HomePageClassList.thoughtCreateBtn);

    thoughtCreate.addEventListener('click', (e) => {
      if (elClass === HomePageClassList.thoughtItem) {
        this.convertToPlan(this.thoughtText, e);
      } else {
        this.createThought(this.thoughtText);
      }
    });

    thoughtAdd.append(thoughtInput);
    thoughtAddBtn.addEventListener('click', (e) => this.openCloseThought(e, thoughtAdd));

    if (elClass === HomePageClassList.thoughtItem) {
      const thoughtRemove = createNewElement('div', HomePageClassList.thoughtRemoveBtn);

      thoughtRemove.addEventListener('click', (e) => this.deleteThought(e));
      thoughtAdd.append(thoughtRemove);
    }

    thoughtAdd.append(thoughtCreate, thoughtAddBtn);
    return thoughtAdd;
  }
}

export default Thought;
