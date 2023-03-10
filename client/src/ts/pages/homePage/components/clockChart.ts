import { createNewElement, getColors, getExistentElement } from '../../../base/helpers';
import { BaseClassList, HomePageClassList } from '../../../base/enums/classList';
import Values from '../../../base/enums/values';
import InnerText from '../../../base/enums/innerText';
import { DistDayPlan, ChartData } from '../../../base/interface';
import Clock from './clock';
import Chart from './chart';
import ToDo from './toDo';
import { emptyData } from '../data/data';
import Path from '../../../base/enums/path';
import { GoToFn } from '../../../base/types';
import Days from '../../../base/enums/days';
import { GetAttribute } from '../../../base/enums/attributes';

class ClockChart extends Clock {
  protected goTo: GoToFn;

  toDoInst: ToDo;

  chartInst: Chart;

  distributedPlans: DistDayPlan[];

  dayData: ChartData[][];

  chartData: ChartData[];

  halfOfDay: string;

  minutes: number;

  seconds: number;

  currPlan: ChartData;

  currPlanNum: number;

  currColor: string;

  currFontColor: string;

  dayOfWeek: number;

  constructor(goTo: GoToFn) {
    super();
    this.goTo = goTo;
    this.toDoInst = new ToDo();
    this.chartInst = new Chart();
    this.distributedPlans = [];
    this.dayData = [emptyData, emptyData];
    this.chartData = emptyData;
    this.halfOfDay = InnerText.timeOfDayAM;
    this.minutes = 0;
    this.seconds = 1;
    [this.currPlan] = emptyData;
    this.currPlanNum = 0;
    [this.currColor, this.currFontColor] = getColors(this.chartData[0].color);
    this.dayOfWeek = 0;
  }

  setDistributedPlans(distributedPlans: DistDayPlan[], dayNum: number) {
    this.dayOfWeek = dayNum;
    this.distributedPlans = distributedPlans;
  }

  transformData() {
    const data: ChartData[] = [];
    let counter = 0;
    if (this.distributedPlans.length === 0) {
      data.push(emptyData[0]);
    } else {
      this.distributedPlans.forEach((_, i, arr) => {
        if (i === 0) {
          if (this.distributedPlans[i].from !== 0) {
            const plan: ChartData = {
              id: counter,
              _id: '',
              hours: (this.distributedPlans[i].from - 0) / 60,
              from: 0,
              to: this.distributedPlans[i].from,
              color: '0',
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
              color: '0',
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
          if (this.distributedPlans[arr.length - 1].to !== Values.allDayMinutes) {
            const plan5: ChartData = {
              id: counter,
              _id: '',
              hours: (Values.allDayMinutes - this.distributedPlans[i].to) / 60,
              from: this.distributedPlans[i].to,
              to: +Values.allDayMinutes,
              color: '0',
              title: InnerText.emptyTitle,
              text: InnerText.emptyText,
            };
            data.push(plan5);
            counter += 1;
          }
        }
      });
    }
    this.splitData(data);
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
  }

  setHalfOfDayData() {
    this.chartData = this.hours < Values.clockHours ? this.dayData[0] : this.dayData[1];
    this.halfOfDay = this.hours < Values.clockHours ? InnerText.timeOfDayAM : InnerText.timeOfDayPM;
  }

  setCurrTime() {
    const date = new Date();
    const day = date.getDay() - 1 < 0 ? 6 : date.getDay() - 1;
    const hours = date.getHours();
    const minutes = hours * 60 + date.getMinutes();
    this.seconds = minutes * 60 + date.getSeconds();
    this.date = date;
    this.dayOfWeek = day;
    this.hours = hours;
    this.minutes = minutes;
  }

  updateDataByTime() {
    setInterval(() => {
      if (!(window.location.pathname === Path.home) || !document.querySelector(`.${HomePageClassList.clock}`)) return;
      this.setCurrTime();
      this.setHalfOfDayData();
      this.setChartSector();
      this.updateDayInfo();
    }, 1000);
  }

  setChartSector() {
    if (this.minutes === this.currPlan.to) {
      this.setDataByTime();
      this.updateToDo();
    }
  }

  setDataByTime() {
    const currPlan = this.chartData.filter((el) => this.minutes >= el.from && this.minutes < el.to);
    [this.currPlan] = currPlan;
    this.currPlanNum = currPlan[0].id;
    this.setColor(currPlan[0].color);
  }

  setColor(color: string) {
    [this.currColor, this.currFontColor] = getColors(color);
  }

  // handlers

  private showToDo(e: Event) {
    if (!(e.target instanceof SVGCircleElement) || !e.target.id) return;
    const sector = +e.target.id;
    const toDo = getExistentElement(`.${HomePageClassList.toDo}`);
    const bgColor = e.target.getAttribute(GetAttribute.stroke);
    const color = e.target.getAttribute(GetAttribute.class);
    if (bgColor && color) {
      toDo.style.backgroundColor = bgColor;
      if (toDo.parentElement) toDo.parentElement.style.color = color;
      const svg = document.querySelector(`.${HomePageClassList.daySvg}`);
      if (svg instanceof SVGElement) svg.style.stroke = color;
    }
    toDo.innerHTML = '';
    const data =
      getExistentElement(`.${HomePageClassList.timeOfDay}`).textContent === InnerText.timeOfDayAM
        ? this.dayData[0]
        : this.dayData[1];
    let plan = data.find((el) => el.id === sector);
    if (!plan) plan = this.currPlan;
    const toDoList = this.toDoInst.draw(plan, this.distributedPlans);
    toDo.append(toDoList);
  }

  private showCurrToDo(e: Event) {
    if (!(e.target instanceof SVGCircleElement) || !e.target.id) return;

    const toDo = getExistentElement(`.${HomePageClassList.toDo}`);
    toDo.style.backgroundColor = this.currColor;
    if (toDo.parentElement) toDo.parentElement.style.color = this.currFontColor;
    const svg = document.querySelector(`.${HomePageClassList.daySvg}`);
    if (svg instanceof SVGElement) svg.style.stroke = this.currFontColor;
    toDo.innerHTML = '';
    const toDoList = this.toDoInst.draw(this.currPlan, this.distributedPlans);
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
    this.updateChart();
  }

  showCurrHalfOfDay() {
    getExistentElement(`.${HomePageClassList.timeOfDay}`).textContent = this.halfOfDay;
    this.setHalfOfDayData();
    this.updateChart();
  }

  // update

  updateToDo() {
    const toDo = getExistentElement(`.${HomePageClassList.toDo}`);
    toDo.style.backgroundColor = this.currColor;
    if (toDo.parentElement) toDo.parentElement.style.color = this.currFontColor;
    const svg = document.querySelector(`.${HomePageClassList.daySvg}`);
    if (svg instanceof SVGElement) svg.style.stroke = this.currFontColor;
    toDo.innerHTML = '';
    const toDoList = this.toDoInst.draw(this.currPlan, this.distributedPlans);
    toDo.append(toDoList);
  }

  updateChart() {
    const chart = getExistentElement(`.${BaseClassList.chart}`);
    chart.innerHTML = '';
    this.chartInst.createChart(chart, this.chartData, { strokeWidth: 14, radius: 285 });
    getExistentElement(`.${HomePageClassList.clock}`).append(chart);
  }

  updateDayInfo() {
    if (this.seconds === 6 * 3600 || this.seconds === 12 * 3600 || this.seconds === 18 * 3600 || this.seconds === 0) {
      getExistentElement(`.${HomePageClassList.dayInfo}`).innerHTML = this.showDayInfo(this.currFontColor);
    }
    if (this.seconds === 12 * 3600) {
      getExistentElement(`.${HomePageClassList.timeOfDay}`).textContent = this.halfOfDay;
      this.setHalfOfDayData();
      this.updateChart();
    }
  }

  showNewDay(distributedPlans: DistDayPlan[], dayNum: number) {
    this.setDistributedPlans(distributedPlans, dayNum);
    this.setValidChartData();
    this.updateToDo();
    this.updateChart();
    getExistentElement(`.${HomePageClassList.timeOfDay}`).innerHTML = this.halfOfDay;
  }

  setValidChartData() {
    this.transformData();
    this.setCurrTime();
    this.setHalfOfDayData();
    this.setDataByTime();
  }

  draw(distributedPlans: DistDayPlan[], dayNum: number) {
    this.setDistributedPlans(distributedPlans, dayNum);
    this.setValidChartData();
    this.updateDataByTime();

    const clock = createNewElement('div', HomePageClassList.clock);
    const hour = createNewElement('div', HomePageClassList.hour);
    const hr = createNewElement('div', HomePageClassList.hourCircle);
    const minutes = createNewElement('div', HomePageClassList.minutes);
    const min = createNewElement('div', HomePageClassList.minutesCircle);
    hour.append(hr);
    minutes.append(min);

    const chart = createNewElement('div', BaseClassList.chart);
    this.chartInst.createChart(chart, this.chartData, { strokeWidth: 14, radius: 285 });

    const dayInfoHTML = createNewElement('div', HomePageClassList.dayInfo);
    dayInfoHTML.innerHTML = this.showDayInfo(this.currFontColor);

    const toDo = createNewElement('div', HomePageClassList.toDo);
    toDo.style.backgroundColor = this.currColor;
    clock.style.color = this.currFontColor;

    const toDoWrap = this.toDoInst.draw(this.currPlan, this.distributedPlans);

    const timeOfDay = createNewElement('div', HomePageClassList.timeOfDay);
    timeOfDay.innerText = this.halfOfDay;

    toDo.append(toDoWrap);
    clock.append(hour, minutes, chart, toDo, dayInfoHTML, timeOfDay);

    dayInfoHTML.addEventListener('click', () => this.goTo(`/${Days[this.dayOfWeek]}`));
    timeOfDay.addEventListener('click', (e) => this.changeTimeOfDay(e));
    chart.addEventListener('mouseover', (e) => this.showToDo(e));
    chart.addEventListener('mouseout', (e) => this.showCurrToDo(e));
    clock.addEventListener('mouseleave', () => this.showCurrHalfOfDay());

    return clock;
  }
}

export default ClockChart;
