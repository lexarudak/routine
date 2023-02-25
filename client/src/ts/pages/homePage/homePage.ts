import PageList from '../../base/enums/pageList';
import { HomePageClassList, BaseClassList, ThoughtsClassList, MainClassList } from '../../base/enums/classList';
import { GoToFn } from '../../base/types';
import Page from '../page';
import Api from '../../api';
import { createNewElement, getCurrentDayNum, getExistentElementByClass } from '../../base/helpers';
import { client } from './data/data';
import ClockChart from './components/clockChart';
import Thought from './components/thought';
import RoutsList from '../../base/enums/routsList';
import Path from '../../base/enums/path';
import InnerText from '../../base/enums/innerText';
import Values from '../../base/enums/values';
import Popup from '../../components/popup';
import { Plan, ThoughtsData, ConfirmationDay } from '../../base/interface';
import ConfirmationDays from '../../base/enums/confirmationDays';
import PlanEditor from '../../components/planEditor';

class HomePage extends Page {
  clockChartInst: ClockChart;
  userName: string;
  confirmDayInfo: boolean;
  confirmDay: number;
  confirmationTime: number;
  confirmDayPlans: Plan[];
  daysInApp: number;
  commonPopup: Popup;

  constructor(goTo: GoToFn, editor: PlanEditor, commonPopup: Popup) {
    super(PageList.homePage, goTo, editor);
    this.clockChartInst = new ClockChart(this.goTo);
    this.userName = '';
    this.confirmDayInfo = false;
    this.confirmDay = 0;
    this.confirmationTime = 660;
    this.confirmDayPlans = [];
    this.daysInApp = 1;
    this.commonPopup = commonPopup;
  }

  private createCanvas() {
    const canvas = createNewElement<HTMLCanvasElement>('canvas', BaseClassList.canvas);
    canvas.width = client.width;
    canvas.height = client.height;
    return canvas;
  }

  private async createThought(canvas: HTMLCanvasElement) {
    const thought = createNewElement('div', ThoughtsClassList.thought);
    const thoughtContainer = createNewElement('div', ThoughtsClassList.thoughtContainer);
    const thoughtTitle = createNewElement('h3', ThoughtsClassList.thoughtTitle);
    thoughtTitle.textContent = InnerText.thoughtText;
    const [thoughtsDataList, allPlans]: [ThoughtsData[], Plan[]] = await Promise.all([
      Api.getThoughts(),
      Api.getAllPlans(),
    ]);

    const fillWeekTime = allPlans.reduce((acc, plan) => {
      return acc + plan.duration;
    }, 0);

    const thoughtAddInst = new Thought(this.goTo, this.editor, this.commonPopup, fillWeekTime, '');
    const thoughtAdd = thoughtAddInst.draw(ThoughtsClassList.thoughtAdd);
    thoughtAdd.classList.remove(BaseClassList.none);
    thought.append(thoughtTitle, thoughtAdd, thoughtContainer);

    thoughtAddInst.createThoughtsList(thoughtContainer, thoughtsDataList);
    thoughtAddInst.createFlyingThought(canvas, thoughtsDataList);

    const oldPopup = document.querySelector(`.${BaseClassList.blur}`);
    if (oldPopup instanceof HTMLElement) {
      thoughtTitle.addEventListener('click', () => thoughtAddInst.openCloseThoughtList(thoughtAdd, oldPopup));
    } else {
      const popup = createNewElement('div', BaseClassList.blur);
      popup.classList.add(BaseClassList.none);
      document.body.append(popup);
      thoughtTitle.addEventListener('click', () => thoughtAddInst.openCloseThoughtList(thoughtAdd, popup));
      popup.addEventListener('click', () => thoughtAddInst.openCloseThoughtList(thoughtAdd, popup));
    }

    return thought;
  }

  private async setUserInfo() {
    const userInfo = await Promise.all([Api.getUserProfile(), Api.getConfirmDayInfo(), Api.getWeekDistribution()]);
    const [userProfile, confirmDayInfo, weekDistribution] = userInfo;
    this.userName = userProfile.name;
    this.confirmDayInfo = confirmDayInfo;
    this.confirmDay = this.getDayOfWeekByConfirmationDay(userProfile.confirmationDay);
    this.confirmationTime = userProfile.confirmationTime;
    this.confirmDayPlans = weekDistribution[this.confirmDay];
    this.daysInApp = this.getDaysInApp(new Date(userProfile.createdAt));
  }

  private getDayOfWeekByConfirmationDay(confirmationDay: ConfirmationDay) {
    const dayOfWeek = this.getPreviousDayOfWeek(new Date().getDay());
    return confirmationDay === ConfirmationDays.today ? dayOfWeek : this.getPreviousDayOfWeek(dayOfWeek);
  }

  private getPreviousDayOfWeek(dayOfWeek: number) {
    return dayOfWeek - 1 < 0 ? 6 : dayOfWeek - 1;
  }

  private isValidDay() {
    return !(this.confirmDay === new Date().getDay() - 2 && this.daysInApp === 1);
  }

  private getDaysInApp(startDate: Date) {
    return Math.ceil((Date.now() - startDate.getTime()) / 1000 / 3600 / 24);
  }

  private async checkConfirmTime(confirmDay: HTMLElement) {
    this.isValidDay();
    const chartInterval = setInterval(() => {
      if (!(window.location.pathname === Path.home)) clearTimeout(chartInterval);
      if (
        this.clockChartInst.minutes >= this.confirmationTime &&
        this.confirmDayInfo === false &&
        this.confirmDayPlans.length &&
        this.isValidDay()
      ) {
        confirmDay.classList.add(BaseClassList.show);
      } else if (this.confirmDayInfo === true) {
        confirmDay.classList.remove(BaseClassList.show);
      }
      if (this.clockChartInst.seconds === Values.startDayTime) this.getNewDayData();
    }, 1000);
  }

  private async getNewDayData() {
    const currentDayNum = getCurrentDayNum();
    const dayPlans = await Api.getDayDistribution((currentDayNum + 2).toString());
    this.clockChartInst.showNewDay(dayPlans.distributedPlans, currentDayNum);
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    const page = document.createElement(BaseClassList.section);
    const currentDayNum = getCurrentDayNum();
    const canvas = this.createCanvas();
    const [, thought, dayPlans] = await Promise.all([
      this.setUserInfo(),
      this.createThought(canvas),
      Api.getDayDistribution(currentDayNum.toString()),
    ]);

    const confirmDay = createNewElement('div', HomePageClassList.confirmDay);
    confirmDay.addEventListener('click', () => this.goTo(RoutsList.confirmPage));
    this.checkConfirmTime(confirmDay);

    const plan = createNewElement('div', HomePageClassList.plan);
    plan.textContent = InnerText.weekText;
    plan.addEventListener('click', () => this.goTo(RoutsList.planPage));

    const profile = createNewElement('div', HomePageClassList.profile);
    profile.addEventListener('click', () => this.goTo(RoutsList.profilePage));

    profile.textContent = this.userName;

    const clock = this.clockChartInst.draw(dayPlans.distributedPlans, currentDayNum);

    page.append(canvas, thought, profile, plan, confirmDay, clock);

    return page;
  }

  public async draw() {
    const container = getExistentElementByClass(MainClassList.mainContainer);
    try {
      await this.animatedFilledPageAppend(container);
      this.clockChartInst.getTime();
    } catch {
      this.goTo(RoutsList.loginPage);
    }
  }
}

export default HomePage;
