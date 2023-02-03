import PageList from '../../base/enums/pageList';
import { HomePageClassList } from '../../base/enums/classList';
import Attributes from '../../base/enums/attributes';
import { GoToFn } from '../../base/types';
import Page from '../page';
import { createElement, getExistentElement } from '../../base/helpers';
import createChart from './chart';
import ToDo from './toDo';
import chartData from './data/chartData';

class HomePage extends Page {
  toDoList: ToDo;

  constructor(goTo: GoToFn) {
    super(PageList.homePage, goTo);
    this.toDoList = new ToDo();
  }

  showToDo(e: Event) {
    if (!(e.target instanceof SVGCircleElement) || !e.target.id) return;
    const toDo = getExistentElement('.to-do');
    const color = e.target.getAttribute(Attributes.stroke);
    if (color) toDo.style.backgroundColor = color;
    toDo.innerHTML = '';
    const toDoList = this.toDoList.draw(+e.target.id - 1);
    toDo.append(toDoList);
  }

  showCurrToDo(e: Event) {
    if (!(e.target instanceof SVGCircleElement) || !e.target.id) return;

    const toDo = getExistentElement('.to-do');
    toDo.style.backgroundColor = '';
    toDo.innerHTML = '';
    const toDoList = this.toDoList.draw(0);
    toDo.append(toDoList);
  }

  protected getFilledPage(): HTMLElement {
    const page = document.createElement(HomePageClassList.section);

    const thought = createElement('h3', HomePageClassList.thought);
    const thoughtTitle = createElement('h3', HomePageClassList.thoughtTitle);
    thought.textContent = 'Thought';
    const thoughtAdd = createElement('h3', HomePageClassList.thoughtAdd);
    thought.append(thoughtTitle, thoughtAdd);

    const plan = createElement('div', HomePageClassList.plan);
    plan.textContent = 'Plan';

    const signIn = createElement('div', HomePageClassList.signIn);

    const chart = createElement('div', HomePageClassList.chart);
    createChart(chart, chartData, { strokeWidth: 14, radius: 350 });

    const toDo = createElement('div', HomePageClassList.toDo);
    const toDoList = this.toDoList.draw(0);
    toDo.append(toDoList);
    chart.append(toDo);

    page.append(thought, signIn, plan, chart);

    chart.addEventListener('mouseover', (e) => this.showToDo(e));
    chart.addEventListener('mouseout', (e) => this.showCurrToDo(e));
    return page;
  }
}

export default HomePage;
