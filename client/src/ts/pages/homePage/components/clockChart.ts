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

  chartData: ChartData[];

  constructor() {
    super();
    this.toDoInst = new ToDo();
    this.chartInst = new Chart();
    this.chartData = [];
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

    const hours = this.checkDayHours();
    console.log(hours);
    // const currData = hours >= 12 ? AMData : PMData;
    const currData = AMData;
    this.chartData = currData;

    return currData;
  }

  checkDayHours() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    console.log(hours * 60 + minutes);
    return date.getHours();
  }

  transformData() {
    const data: ChartData[] = [];
    let counter = 0;
    chartData.forEach((_, i) => {
      if (i === 0) {
        if (chartData[i].from !== 0) {
          const plan: ChartData = {
            id: counter,
            hours: (chartData[i].from - 0) / 60,
            from: 0,
            to: chartData[i].from,
            color: '#afafaf',
            title: 'Empty',
            text: 'Empty',
          };
          data.push(plan);
          counter += 1;
        }
      }
      if (i !== chartData.length - 1) {
        const plan2: ChartData = {
          id: counter,
          hours: (chartData[i].to - chartData[i].from) / 60,
          from: chartData[i].from,
          to: chartData[i].to,
          color: chartData[i].color,
          title: chartData[i].title,
          text: chartData[i].text,
        };
        data.push(plan2);
        counter += 1;
        if (chartData[i].to !== chartData[i + 1].from) {
          const plan3: ChartData = {
            id: counter,
            hours: (chartData[i + 1].from - chartData[i].to) / 60,
            from: chartData[i].to,
            to: chartData[i + 1].from,
            color: '#afafaf',
            title: 'Empty',
            text: 'Empty',
          };
          data.push(plan3);
          counter += 1;
        }
      } else {
        const plan4: ChartData = {
          id: counter,
          hours: (chartData[i].to - chartData[i].from) / 60,
          from: chartData[i].from,
          to: chartData[i].to,
          color: chartData[i].color,
          title: chartData[i].title,
          text: chartData[i].text,
        };
        data.push(plan4);
        counter += 1;
        if (chartData[chartData.length - 1].to !== 1440) {
          const plan5: ChartData = {
            id: counter,
            hours: (1440 - chartData[i].to) / 60,
            from: chartData[i].to,
            to: 1440,
            color: '#afafaf',
            title: 'Empty',
            text: 'Empty',
          };
          data.push(plan5);
          counter += 1;
        }
      }
    });
    console.log(data);
    return this.splitData(data);
  }

  private showToDo(e: Event) {
    if (!(e.target instanceof SVGCircleElement) || !e.target.id) return;
    const toDo = getExistentElement('.to-do');
    const color = e.target.getAttribute(Attributes.stroke);
    if (color) toDo.style.backgroundColor = color;
    toDo.innerHTML = '';

    const toDoList = this.toDoInst.draw(+e.target.id, this.chartData);
    toDo.append(toDoList);
  }

  private showCurrToDo(e: Event) {
    if (!(e.target instanceof SVGCircleElement) || !e.target.id) return;

    const toDo = getExistentElement('.to-do');
    toDo.style.backgroundColor = '';
    toDo.innerHTML = '';
    const toDoList = this.toDoInst.draw(this.chartData[1].id, this.chartData);
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

    const ChartDataArr: ChartData[] = this.transformData();
    // await this.setDayInfo();

    const chart = createNewElement('div', HomePageClassList.chart);
    this.chartInst.createChart(chart, ChartDataArr, { strokeWidth: 14, radius: 285 });
    chart.append(hour, minutes);

    const toDo = createNewElement('div', HomePageClassList.toDo);
    const toDoWrap = this.toDoInst.draw(1, ChartDataArr);
    toDo.append(toDoWrap);
    chart.append(toDo);
    clock.append(chart);

    chart.addEventListener('mouseover', (e) => this.showToDo(e));
    chart.addEventListener('mouseout', (e) => this.showCurrToDo(e));

    return clock;
  }
}

export default ClockChart;
