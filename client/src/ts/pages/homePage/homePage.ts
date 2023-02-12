import PageList from '../../base/enums/pageList';
import { HomePageClassList } from '../../base/enums/classList';
import Attributes from '../../base/enums/attributes';
import { GoToFn } from '../../base/types';
// import { ThoughtData } from '../../base/interfaces';
import Page from '../page';
import { createElement, createNewElement, getExistentElement, client } from '../../base/helpers';
import Chart from './components/chart';
import ToDo from './components/toDo';
import chartData from './data/chartData';
import thoughtData from './data/thoughtData';
import Clock from './components/clock';
import FlyingThought from './components/flyingThought';
import Thought from './components/thought';
import ThoughtBuilder from './components/thoughtBuilder';
import RoutsList from '../../base/enums/routsList';

class HomePage extends Page {
  toDoInst: ToDo;

  clockInst: Clock;

  chartInst: Chart;

  constructor(goTo: GoToFn) {
    super(PageList.homePage, goTo);
    this.toDoInst = new ToDo();
    this.clockInst = new Clock();
    this.chartInst = new Chart();
  }

  private showToDo(e: Event) {
    if (!(e.target instanceof SVGCircleElement) || !e.target.id) return;
    const toDo = getExistentElement('.to-do');
    const color = e.target.getAttribute(Attributes.stroke);
    if (color) toDo.style.backgroundColor = color;
    toDo.innerHTML = '';
    const toDoList = this.toDoInst.draw(+e.target.id - 1);
    toDo.append(toDoList);
  }

  private showCurrToDo(e: Event) {
    if (!(e.target instanceof SVGCircleElement) || !e.target.id) return;

    const toDo = getExistentElement('.to-do');
    toDo.style.backgroundColor = '';
    toDo.innerHTML = '';
    const toDoList = this.toDoInst.draw(0);
    toDo.append(toDoList);
  }

  private createFlyingThought() {
    const canvas = createNewElement<HTMLCanvasElement>('canvas', HomePageClassList.canvas);
    const ctx = canvas.getContext('2d');
    canvas.width = client.width;
    canvas.height = client.height;

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
      };
      animate();
    }
    canvas.addEventListener('click', () => console.log(client.width, client.height));
    return canvas;
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

  private createClockChart() {
    const clock = createElement('div', HomePageClassList.clock);
    const hour = createElement('div', HomePageClassList.hour);
    const hr = createElement('div', HomePageClassList.hourCircle);
    const minutes = createElement('div', HomePageClassList.minutes);
    const min = createElement('div', HomePageClassList.minutesCircle);
    hour.append(hr);
    minutes.append(min);

    const chart = createElement('div', HomePageClassList.chart);
    this.chartInst.createChart(chart, chartData, { strokeWidth: 14, radius: 320 });
    chart.append(hour, minutes);

    const toDo = createElement('div', HomePageClassList.toDo);
    const toDoList = this.toDoInst.draw(0);
    toDo.append(toDoList);
    chart.append(toDo);
    clock.append(chart);

    chart.addEventListener('mouseover', (e) => this.showToDo(e));
    chart.addEventListener('mouseout', (e) => this.showCurrToDo(e));

    return clock;
  }

  protected getFilledPage(): HTMLElement {
    const page = document.createElement(HomePageClassList.section);
    const flyingThought = this.createFlyingThought();
    const thought = this.createThought();

    const plan = createElement('div', HomePageClassList.plan);
    plan.textContent = 'Plan';
    plan.addEventListener('click', () => this.goTo(RoutsList.planPage));

    const signIn = createElement('div', HomePageClassList.signIn);
    signIn.textContent = 'User';

    const clock = this.createClockChart();

    page.append(flyingThought, thought, signIn, plan, clock);

    setTimeout(() => this.clockInst.getTime());
    return page;
  }
}

export default HomePage;
