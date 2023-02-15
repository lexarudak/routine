import { createNewElement, getExistentElement } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';
import { Attributes } from '../../../base/enums/attributes';
import { ChartData } from '../../../base/interfaces';
import Api from '../../../api';
import Clock from './clock';
import Chart from './chart';
import ToDo from './toDo';
import { chartData } from '../data/chartData';

class ClockChart extends Clock {
  toDoInst: ToDo;

  chartInst: Chart;

  constructor() {
    super();
    this.toDoInst = new ToDo();
    this.chartInst = new Chart();
  }

  async getDayInfo() {
    const dayInfo = await Api.getDayDistribution(this.dayOfWeek.toString());
    console.log(dayInfo);
  }

  splitData(data: ChartData[]) {
    const AMData: ChartData[] = [];
    const PMData: ChartData[] = [];

    data.forEach((el) => {
      const sum = AMData.reduce((acc, dataEl) => acc + dataEl.hours, 0);
      const space = 12 - sum;
      if (el.hours <= space) {
        AMData.push(el);
      } else if (space !== 0) {
        const copy = { ...el };
        const copy2 = { ...el };
        copy.hours = space;
        AMData.push(copy);
        copy2.hours = el.hours - copy.hours;
        PMData.push(copy2);
      } else {
        PMData.push(el);
      }
    });

    return [AMData, PMData];
  }

  transformData() {
    const data: ChartData[] = [];
    chartData.forEach((_, i) => {
      if (i === 0) {
        if (chartData[i].from !== 0) {
          const plan: ChartData = {
            hours: (chartData[i].from - 0) / 60,
            color: '#afafaf',
          };
          data.push(plan);
        }
      }
      if (i !== chartData.length - 1) {
        const plan2: ChartData = {
          hours: (chartData[i].to - chartData[i].from) / 60,
          color: chartData[i].color,
        };
        data.push(plan2);
        if (chartData[i].to !== chartData[i + 1].from) {
          const plan3: ChartData = {
            hours: (chartData[i + 1].from - chartData[i].to) / 60,
            color: '#afafaf',
          };
          data.push(plan3);
        }
      } else {
        const plan4: ChartData = {
          hours: (chartData[i].to - chartData[i].from) / 60,
          color: chartData[i].color,
        };
        data.push(plan4);
        if (chartData[chartData.length - 1].to !== 1440) {
          const plan5: ChartData = {
            hours: (1440 - chartData[i].to) / 60,
            color: '#afafaf',
          };
          data.push(plan5);
        }
      }
    });

    return this.splitData(data);
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

    const ChartDataArr: ChartData[][] = this.transformData();
    // await this.setDayInfo();

    const chart = createNewElement('div', HomePageClassList.chart);
    this.chartInst.createChart(chart, ChartDataArr[0], { strokeWidth: 14, radius: 285 });
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
