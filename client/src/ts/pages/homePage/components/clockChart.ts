import { createNewElement, getExistentElement } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';
import { Attributes } from '../../../base/enums/attributes';
import Api from '../../../api';
import Clock from './clock';
import Chart from './chart';
import ToDo from './toDo';
import chartData from '../data/chartData';

class ClockChart extends Clock {
  toDoInst: ToDo;

  chartInst: Chart;

  constructor() {
    super();
    this.toDoInst = new ToDo();
    this.chartInst = new Chart();
  }

  async setDayInfo() {
    const dayInfo = await Api.getDayDistribution(this.dayOfWeek.toString());
    console.log(dayInfo);
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

  async draw() {
    const clock = createNewElement('div', HomePageClassList.clock);
    const hour = createNewElement('div', HomePageClassList.hour);
    const hr = createNewElement('div', HomePageClassList.hourCircle);
    const minutes = createNewElement('div', HomePageClassList.minutes);
    const min = createNewElement('div', HomePageClassList.minutesCircle);
    hour.append(hr);
    minutes.append(min);
    await this.setDayInfo();

    const chart = createNewElement('div', HomePageClassList.chart);
    this.chartInst.createChart(chart, chartData, { strokeWidth: 14, radius: 285 });
    chart.append(hour, minutes);

    const toDo = createNewElement('div', HomePageClassList.toDo);
    const toDoWrap = this.toDoInst.draw(0);
    toDo.append(toDoWrap);
    chart.append(toDo);
    clock.append(chart);

    chart.addEventListener('mouseover', (e) => this.showToDo(e));
    chart.addEventListener('mouseout', (e) => this.showCurrToDo(e));

    return clock;
  }
}

export default ClockChart;
