import { createElement, createNewElement, isHTMLElement, getExistentElement, client } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';
import Api from '../../../api';
import { ThoughtsData } from '../../../base/interface';
import { SetAttribute, GetAttribute } from '../../../base/enums/attributes';
import FlyingThought from './flyingThought';
import { GoToFn } from '../../../base/types';
import RoutsList from '../../../base/enums/routsList';
import Path from '../../../base/enums/path';
import PlanEditor from '../../planPage/components/planEditor';
// import Values from '../../../base/enums/values';
// import EditorMode from '../../../base/enums/editorMode';

class Thought {
  goTo: GoToFn;

  protected editor: PlanEditor;

  thoughtText: string;

  thoughtId: string | undefined;

  thoughtsDataList: ThoughtsData[] | undefined;

  constructor(goTo: GoToFn, editor: PlanEditor, text: string, id?: string) {
    this.goTo = goTo;
    this.editor = editor;
    this.thoughtText = text;
    this.thoughtId = id;
    this.thoughtsDataList = undefined;
  }

  async convertToPlan(thoughtText: string, e: Event) {
    console.log(thoughtText, e);
  }

  async updateThought(thoughtText: string, e: Event) {
    if (!isHTMLElement(e.target) || !e.target.parentElement) return;
    const thoughtId = e.target.parentElement.dataset[GetAttribute.thoughtId];
    console.log(thoughtId, thoughtText, e);
    if (thoughtId) await Api.updateThought({ _id: thoughtId, title: thoughtText });
  }

  async deleteThought(thoughtText: string, e: Event) {
    if (!isHTMLElement(e.target) || !e.target.parentElement) return;
    const thought = e.target.parentElement;
    const thoughtId = e.target.parentElement.dataset[GetAttribute.thoughtId];

    thought.classList.add(HomePageClassList.none);
    setTimeout(() => thought.parentElement?.removeChild(thought), 350);

    if (thoughtId) await Api.deleteThought(thoughtId);
    console.log(thoughtText, thoughtId);
    this.createFlyingThought(getExistentElement(`.${HomePageClassList.canvas}`));
  }

  openCloseThought(e: Event, thoughtAdd: HTMLElement) {
    if (!isHTMLElement(e.target)) return;
    if (e.target.closest(`.${HomePageClassList.open}`)) {
      thoughtAdd.classList.remove(HomePageClassList.open);
    } else {
      thoughtAdd.classList.add(HomePageClassList.open);
    }
  }

  async createThought(thoughtText: string) {
    if (!thoughtText) return;

    await Api.createThoughts({ title: thoughtText });
    this.createFlyingThought(getExistentElement(`.${HomePageClassList.canvas}`));
    this.createThoughtsList(getExistentElement(`.${HomePageClassList.thoughtContainer}`));
    console.log('create:', thoughtText);
    this.thoughtText = '';
    getExistentElement<HTMLInputElement>(`.${HomePageClassList.thoughtInput}`).value = this.thoughtText;
  }

  async createThoughtsList(thoughtContainer: HTMLElement) {
    thoughtContainer.innerHTML = '';
    const thoughtsArr: Thought[] = [];
    try {
      const thoughtsDataList = await Api.getThoughts();
      thoughtsDataList.forEach((thoughtDataEl: ThoughtsData) => {
        thoughtsArr.push(new Thought(this.goTo, this.editor, thoughtDataEl.title, thoughtDataEl._id));
      });

      for (let i = 0; i < thoughtsArr.length; i += 1) {
        const thoughtEl = thoughtsArr[i].draw(HomePageClassList.thoughtItem);
        thoughtContainer.append(thoughtEl);
      }
    } catch (error) {
      console.log(error);
      this.goTo(RoutsList.loginPage);
    }
  }

  private updateHeight() {
    const documentHeight = document.documentElement.clientHeight;
    client.height = documentHeight;
    client.planPosHeight = documentHeight / 2 - 15;
    client.clockPosHeight = documentHeight / 2 - 15;
  }

  private checkResize(canvas: HTMLCanvasElement) {
    canvas.height = client.height;
    this.createFlyingThought(canvas);
  }

  async createFlyingThought(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    const thoughtsArray: FlyingThought[] = [];
    try {
      if (this.thoughtsDataList === undefined) {
        this.thoughtsDataList = await Api.getThoughts();
      }

      if (this.thoughtsDataList === undefined) return;

      this.thoughtsDataList.forEach((thought: ThoughtsData) => {
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
    } catch {
      this.goTo(RoutsList.loginPage);
    }
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

      thoughtRemove.addEventListener('click', (e) => {
        this.deleteThought(this.thoughtText, e);
      });
      thoughtAdd.append(thoughtRemove);
    }

    let isEvent = false;

    window.addEventListener('resize', () => {
      if (!(window.location.pathname === Path.home)) return;
      if (!isEvent) {
        this.checkResize(getExistentElement(`.${HomePageClassList.canvas}`));
        isEvent = true;
        setTimeout(() => {
          isEvent = false;
        }, 1000);
      }
    });

    thoughtAdd.append(thoughtCreate, thoughtAddBtn);
    return thoughtAdd;
  }
}

export default Thought;
