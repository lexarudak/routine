import { createNewElement, getExistentElement } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';
import { Attributes } from '../../../base/enums/attributes';
import Values from '../../../base/enums/values';
import Colors from '../../../base/enums/colors';
import InnerText from '../../../base/enums/innerText';
import { ChartData } from '../../../base/interfaces';
import { DistDayPlan } from '../../../base/interface';
import Api from '../../../api';
import Clock from './clock';
import Chart from './chart';
import ToDo from './toDo';
import { chartData, emptyData } from '../data/chartData';
import Path from '../../../base/enums/path';

class ClockChart extends Clock {
  toDoInst: ToDo;

  chartInst: Chart;

  distributedPlans: DistDayPlan[];

  dayData: ChartData[][];

  chartData: ChartData[];

  minutes: number;

  currPlanNum: number;

  currColor: string;

  dayOfWeek: number;

  constructor() {
    super();
    this.toDoInst = new ToDo();
    this.chartInst = new Chart();
    this.distributedPlans = [];
    this.dayData = [emptyData, emptyData];
    this.chartData = emptyData;
    this.minutes = 0;
    this.currPlanNum = 0;
    this.currColor = this.chartData[0].color;
    this.dayOfWeek = 0;
  }

  async getDistributedPlans() {
    const date = new Date();
    this.dayOfWeek = date.getDay() - 1;
    const plans = await Api.getDayDistribution(this.dayOfWeek.toString());
    this.distributedPlans = plans.distributedPlans;
  }

  transformData() {
    const data: ChartData[] = [];
    let counter = 0;
    this.distributedPlans.forEach((_, i) => {
      if (i === 0) {
        if (this.distributedPlans[i].from !== 0) {
          const plan: ChartData = {
            id: counter,
            _id: '',
            hours: (this.distributedPlans[i].from - 0) / 60,
            from: 0,
            to: this.distributedPlans[i].from,
            color: Colors.mediumGrey,
            title: InnerText.emptyTitle,
            text: InnerText.emptyText,
          };
          data.push(plan);
          counter += 1;
        }
      }
      if (i !== this.distributedPlans.length - 1) {
        const plan2: ChartData = this.returnDataObj(counter, i);
        data.push(plan2);
        counter += 1;
        if (this.distributedPlans[i].to !== this.distributedPlans[i + 1].from) {
          const plan3: ChartData = {
            id: counter,
            _id: '',
            hours: (this.distributedPlans[i + 1].from - this.distributedPlans[i].to) / 60,
            from: this.distributedPlans[i].to,
            to: this.distributedPlans[i + 1].from,
            color: Colors.mediumGrey,
            title: InnerText.emptyTitle,
            text: InnerText.emptyText,
          };
          data.push(plan3);
          counter += 1;
        }
      } else {
        const plan4: ChartData = this.returnDataObj(counter, i);
        data.push(plan4);
        counter += 1;
        if (this.distributedPlans[chartData.length - 1].to !== Values.allDayMinutes) {
          const plan5: ChartData = {
            id: counter,
            _id: '',
            hours: (Values.allDayMinutes - this.distributedPlans[i].to) / 60,
            from: this.distributedPlans[i].to,
            to: +Values.allDayMinutes,
            color: Colors.mediumGrey,
            title: InnerText.emptyTitle,
            text: InnerText.emptyText,
          };
          data.push(plan5);
          counter += 1;
        }
      }
    });
    this.splitData(data);
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

    this.dayData = [AMData, PMData];
    this.getCurrData();
  }

  getCurrData() {
    const [hours] = this.getCurrTime();
    // const [hours, , s] = this.getCurrTime();
    // if (s === 0) {
    //   console.log('Запрос', s);
    //   this.getDistributedPlans();
    //   this.transformData();
    // }

    const currData = hours < Values.clockHours ? this.dayData[0] : this.dayData[1];
    this.chartData = currData;
    return currData;
  }

  getCurrTime() {
    const date = new Date();
    const day = date.getDay() - 1;
    const hours = date.getHours();
    const minutes = hours * 60 + date.getMinutes();
    const s = date.getSeconds() + minutes * 60;
    this.dayOfWeek = day;
    this.hours = hours;
    this.minutes = minutes;
    return [hours, minutes, s];
  }

  updateDataByTime() {
    this.getCurrData();
    this.setDataByTime();
    setInterval(() => {
      if (!(window.location.pathname === Path.home) || !document.querySelector(`.${HomePageClassList.clock}`)) return;
      this.getCurrData();
      const sector = this.chartData.findIndex((el) => el.id === this.currPlanNum);
      console.log('updData', this.minutes, this.chartData[sector].to);
      if (this.minutes === this.chartData[sector].to) {
        this.setDataByTime();
        const toDo = getExistentElement(`.${HomePageClassList.toDo}`);
        toDo.style.backgroundColor = this.currColor;
        toDo.innerHTML = '';
        const toDoList = this.toDoInst.draw(this.currPlanNum, this.chartData, this.distributedPlans);
        toDo.append(toDoList);
      }
      // if (this.minutes === Values.allDayMinutes) {
      //   this.transformData();
      // }
      this.checkTodo();
    }, 1000);
  }

  checkTodo() {
    if (!document.querySelector(`.${HomePageClassList.toDoTitle}`)) {
      const toDo = getExistentElement(`.${HomePageClassList.toDo}`);
      toDo.style.backgroundColor = this.currColor;
      toDo.innerHTML = '';
      const toDoList = this.toDoInst.draw(this.currPlanNum, this.chartData, this.distributedPlans);
      toDo.append(toDoList);
    } // test
  }

  setDataByTime() {
    const currPlan = this.chartData.filter((el) => this.minutes >= el.from && this.minutes < el.to);
    this.currPlanNum = currPlan[0].id;
    this.currColor = currPlan[0].color;
  }

  returnDataObj(counter: number, i: number) {
    return {
      id: counter,
      _id: this.distributedPlans[i]._id,
      hours: (this.distributedPlans[i].to - this.distributedPlans[i].from) / 60,
      from: this.distributedPlans[i].from,
      to: this.distributedPlans[i].to,
      color: this.distributedPlans[i].color,
      title: this.distributedPlans[i].title,
      text: this.distributedPlans[i].text,
    };
  }

  private showToDo(e: Event) {
    if (!(e.target instanceof SVGCircleElement) || !e.target.id) return;
    const toDo = getExistentElement(`.${HomePageClassList.toDo}`);
    const color = e.target.getAttribute(Attributes.stroke);
    if (color) toDo.style.backgroundColor = color;
    toDo.innerHTML = '';
    const data =
      getExistentElement(`.${HomePageClassList.timeOfDay}`).textContent === InnerText.timeOfDayAM
        ? this.dayData[0]
        : this.dayData[1];
    const toDoList = this.toDoInst.draw(+e.target.id, data, this.distributedPlans);
    toDo.append(toDoList);
  }

  private showCurrToDo(e: Event) {
    if (!(e.target instanceof SVGCircleElement) || !e.target.id) return;

    const toDo = getExistentElement(`.${HomePageClassList.toDo}`);
    toDo.style.backgroundColor = this.currColor;
    toDo.innerHTML = '';
    const toDoList = this.toDoInst.draw(this.currPlanNum, this.chartData, this.distributedPlans);
    toDo.append(toDoList);
  }

  changeTimeOfDay(e: Event) {
    if (!(e.target instanceof HTMLElement)) return;
    if (e.target.textContent === InnerText.timeOfDayAM) {
      e.target.textContent = InnerText.timeOfDayPM;
      [, this.chartData] = this.dayData;
    } else {
      e.target.textContent = InnerText.timeOfDayAM;
      [this.chartData] = this.dayData;
    }
    const chart = getExistentElement(`.${HomePageClassList.chart}`);
    chart.innerHTML = '';
    this.chartInst.createChart(chart, this.chartData, { strokeWidth: 14, radius: 285 });
    getExistentElement(`.${HomePageClassList.clock}`).append(chart);
  }

  showCurrTimeOfDay() {
    getExistentElement(`.${HomePageClassList.timeOfDay}`).textContent = this.getTimeOfDay();
    this.chartData = this.getCurrData();
    const chart = getExistentElement(`.${HomePageClassList.chart}`);
    chart.innerHTML = '';
    this.chartInst.createChart(chart, this.chartData, { strokeWidth: 14, radius: 285 });
    getExistentElement(`.${HomePageClassList.clock}`).append(chart);
  }

  getTimeOfDay() {
    return this.hours < Values.clockHours ? InnerText.timeOfDayAM : InnerText.timeOfDayPM;
  }

  async draw() {
    await this.getDistributedPlans();
    this.transformData(); // login && data
    this.updateDataByTime();
    const clock = createNewElement('div', HomePageClassList.clock);
    const hour = createNewElement('div', HomePageClassList.hour);
    const hr = createNewElement('div', HomePageClassList.hourCircle);
    const minutes = createNewElement('div', HomePageClassList.minutes);
    const min = createNewElement('div', HomePageClassList.minutesCircle);
    hour.append(hr);
    minutes.append(min);

    const chart = createNewElement('div', HomePageClassList.chart);
    this.chartInst.createChart(chart, this.chartData, { strokeWidth: 14, radius: 285 });

    const toDo = createNewElement('div', HomePageClassList.toDo);
    toDo.style.backgroundColor = this.currColor;
    const toDoWrap = this.toDoInst.draw(this.currPlanNum, this.chartData, this.distributedPlans);

    const timeOfDay = createNewElement('div', HomePageClassList.timeOfDay);
    timeOfDay.innerText = this.getTimeOfDay();
    timeOfDay.addEventListener('click', (e) => this.changeTimeOfDay(e));
    toDo.append(toDoWrap);
    clock.append(hour, minutes, chart, toDo, timeOfDay);

    chart.addEventListener('mouseover', (e) => this.showToDo(e));
    chart.addEventListener('mouseout', (e) => this.showCurrToDo(e));
    clock.addEventListener('mouseleave', () => this.showCurrTimeOfDay());

    return clock;
  }
}

export default ClockChart;
