import { createNewElement, getExistentElement } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';
import { Attributes } from '../../../base/enums/attributes';
import Values from '../../../base/enums/values';
import Colors from '../../../base/enums/colors';
import InnerText from '../../../base/enums/innerText';
import { ChartData } from '../../../base/interfaces';
import Api from '../../../api';
import Clock from './clock';
import Chart from './chart';
import ToDo from './toDo';
import { chartData, emptyData } from '../data/chartData';

class ClockChart extends Clock {
  toDoInst: ToDo;

  chartInst: Chart;

  chartData: ChartData[];

  minutes: number;

  currPlanNum: number;

  currColor: string;

  constructor() {
    super();
    this.toDoInst = new ToDo();
    this.chartInst = new Chart();
    this.chartData = emptyData;
    this.minutes = 0;
    this.currPlanNum = 0;
    this.currColor = this.chartData[0].color;
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
      const space = Values.clockHours - sum;
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

    const [hours] = this.getCurrTime();
    const currData = hours < Values.clockHours ? AMData : PMData;
    this.chartData = currData;

    return currData;
  }

  getCurrTime() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = hours * 60 + date.getMinutes();
    this.minutes = minutes;
    return [hours, minutes];
  }

  updateDataByTime() {
    const currPlan = this.chartData.filter((el) => this.minutes >= el.from && this.minutes <= el.to);
    this.currPlanNum = currPlan[0].id;
    this.currColor = currPlan[0].color;
    return currPlan;
  }

  returnDataObj(counter: number, i: number) {
    return {
      id: counter,
      hours: (chartData[i].to - chartData[i].from) / 60,
      from: chartData[i].from,
      to: chartData[i].to,
      color: chartData[i].color,
      title: chartData[i].title,
      text: chartData[i].text,
    };
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
            color: Colors.mediumGrey,
            title: InnerText.emptyText,
            text: '',
          };
          data.push(plan);
          counter += 1;
        }
      }
      if (i !== chartData.length - 1) {
        const plan2: ChartData = this.returnDataObj(counter, i);
        data.push(plan2);
        counter += 1;
        if (chartData[i].to !== chartData[i + 1].from) {
          const plan3: ChartData = {
            id: counter,
            hours: (chartData[i + 1].from - chartData[i].to) / 60,
            from: chartData[i].to,
            to: chartData[i + 1].from,
            color: Colors.mediumGrey,
            title: InnerText.emptyText,
            text: '',
          };
          data.push(plan3);
          counter += 1;
        }
      } else {
        const plan4: ChartData = this.returnDataObj(counter, i);
        data.push(plan4);
        counter += 1;
        if (chartData[chartData.length - 1].to !== Values.allDayMinutes) {
          const plan5: ChartData = {
            id: counter,
            hours: (Values.allDayMinutes - chartData[i].to) / 60,
            from: chartData[i].to,
            to: +Values.allDayMinutes,
            color: Colors.mediumGrey,
            title: InnerText.emptyText,
            text: '',
          };
          data.push(plan5);
          counter += 1;
        }
      }
    });
    return this.splitData(data);
  }

  private showToDo(e: Event) {
    if (!(e.target instanceof SVGCircleElement) || !e.target.id) return;
    const toDo = getExistentElement(`.${HomePageClassList.toDo}`);
    const color = e.target.getAttribute(Attributes.stroke);
    if (color) toDo.style.backgroundColor = color;
    toDo.innerHTML = '';

    const toDoList = this.toDoInst.draw(+e.target.id, this.chartData);
    toDo.append(toDoList);
  }

  private showCurrToDo(e: Event) {
    if (!(e.target instanceof SVGCircleElement) || !e.target.id) return;

    const toDo = getExistentElement(`.${HomePageClassList.toDo}`);
    toDo.style.backgroundColor = this.currColor;
    toDo.innerHTML = '';
    const toDoList = this.toDoInst.draw(this.currPlanNum, this.chartData);
    toDo.append(toDoList);
  }

  async draw() {
    const ChartDataArr: ChartData[] = this.transformData();
    this.getCurrTime();
    this.updateDataByTime();
    const clock = createNewElement('div', HomePageClassList.clock);
    const hour = createNewElement('div', HomePageClassList.hour);
    const hr = createNewElement('div', HomePageClassList.hourCircle);
    const minutes = createNewElement('div', HomePageClassList.minutes);
    const min = createNewElement('div', HomePageClassList.minutesCircle);
    hour.append(hr);
    minutes.append(min);

    // await this.setDayInfo();

    const chart = createNewElement('div', HomePageClassList.chart);
    this.chartInst.createChart(chart, ChartDataArr, { strokeWidth: 14, radius: 285 });
    chart.append(hour, minutes);

    const toDo = createNewElement('div', HomePageClassList.toDo);
    toDo.style.backgroundColor = this.currColor;
    const toDoWrap = this.toDoInst.draw(this.currPlanNum, ChartDataArr);
    toDo.append(toDoWrap);
    chart.append(toDo);
    clock.append(chart);

    chart.addEventListener('mouseover', (e) => this.showToDo(e));
    chart.addEventListener('mouseout', (e) => this.showCurrToDo(e));

    return clock;
  }
}

export default ClockChart;
