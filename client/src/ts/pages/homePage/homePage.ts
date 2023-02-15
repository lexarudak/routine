import PageList from '../../base/enums/pageList';
import { HomePageClassList } from '../../base/enums/classList';
import { GoToFn } from '../../base/types';
import Page from '../page';
import { createElement, createNewElement, getExistentElement, client } from '../../base/helpers';
import thoughtData from './data/thoughtData';
import ClockChart from './components/clockChart';
import FlyingThought from './components/flyingThought';
import Thought from './components/thought';
import ThoughtBuilder from './components/thoughtBuilder';
import RoutsList from '../../base/enums/routsList';
import PlanEditor from '../planPage/components/planEditor';

class HomePage extends Page {
  clockChartInst: ClockChart;

  constructor(goTo: GoToFn, editor: PlanEditor) {
    super(PageList.homePage, goTo, editor);
    this.clockChartInst = new ClockChart();
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

  private createCanvas() {
    const canvas = createNewElement<HTMLCanvasElement>('canvas', HomePageClassList.canvas);
    canvas.width = client.width;
    canvas.height = client.height;
    window.addEventListener(`resize`, () => this.checkResize(canvas));
    this.createFlyingThought(canvas);
    return canvas;
  }

  private createFlyingThought(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext('2d');
    const thoughtsArray: FlyingThought[] = [];
    // for (let i = 0; i < 50; i += 1) { //test
    thoughtData.forEach((thought) => {
      const radius = 20;
      const { id } = thought;
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

  createThoughtsList(thoughtContainer: HTMLElement) {
    const thoughtsArr: Thought[] = [];
    thoughtData.forEach((thoughtDataEl) => {
      thoughtsArr.push(new Thought(thoughtDataEl.title));
    });

    for (let i = 0; i < thoughtsArr.length; i += 1) {
      const thoughtEl = thoughtsArr[i].draw(HomePageClassList.thoughtItem);
      thoughtContainer.append(thoughtEl);
    }
  }

  private createThought() {
    const thought = createElement('div', HomePageClassList.thought);
    const thoughtContainer = createElement('div', 'thought__container');
    const thoughtTitle = createElement('h3', HomePageClassList.thoughtTitle);
    thoughtTitle.textContent = 'Thought';

    const thoughtAddInst = new ThoughtBuilder('');
    const thoughtAdd = thoughtAddInst.draw(HomePageClassList.thoughtAdd);
    thoughtAdd.classList.remove('none');
    thought.append(thoughtTitle, thoughtAdd, thoughtContainer);

    this.createThoughtsList(thoughtContainer);

    const popup = createNewElement('div', 'blur');
    popup.classList.add('none');
    document.body.append(popup);

    thoughtTitle.addEventListener('click', () => {
      getExistentElement('.canvas').classList.toggle('none');
      thoughtAdd.classList.toggle('none');
      popup.classList.toggle(HomePageClassList.none);
      document.querySelectorAll('.thought__item').forEach((el) => {
        el.classList.toggle('open');
        el.classList.toggle('none');
      });
    });
    return thought;
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    const page = document.createElement(HomePageClassList.section);
    const flyingThought = this.createCanvas();
    console.log(flyingThought);
    const thought = this.createThought();
    const plan = createElement('div', HomePageClassList.plan);
    plan.textContent = 'Plan';
    plan.addEventListener('click', () => this.goTo(RoutsList.planPage));

    const signIn = createElement('div', HomePageClassList.signIn);
    signIn.textContent = 'User';

    const clock = await this.clockChartInst.draw();
    page.append(thought, signIn, plan, clock);
    // page.append(flyingThought, thought, signIn, plan, clock);
    setTimeout(() => this.clockChartInst.getTime());

    return page;
  }
}

export default HomePage;
