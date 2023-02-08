import PageList from '../../base/enums/pageList';
import { HomePageClassList } from '../../base/enums/classList';
import Attributes from '../../base/enums/attributes';
import { GoToFn } from '../../base/types';
import Page from '../page';
import { createElement, getExistentElement } from '../../base/helpers';
import Chart from './components/chart';
import ToDo from './components/toDo';
import chartData from './data/chartData';
import Clock from './components/clock';

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

  private createThought() {
    const thought = createElement('div', HomePageClassList.thought);
    const thoughtTitle = createElement('h3', HomePageClassList.thoughtTitle);
    thought.textContent = 'Thought';
    const thoughtAdd = createElement('div', HomePageClassList.thoughtAdd);
    thought.append(thoughtTitle, thoughtAdd);
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
    const thought = this.createThought();

    const plan = createElement('div', HomePageClassList.plan);
    plan.textContent = 'Plan';

    const signIn = createElement('div', HomePageClassList.signIn);
    signIn.textContent = 'User';

    const clock = this.createClockChart();

    page.append(thought, signIn, plan, clock);

    setTimeout(() => this.clockInst.getTime());
    return page;
  }
}

export default HomePage;
