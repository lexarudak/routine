import PageList from '../../base/enums/pageList';
import { HomePageClassList } from '../../base/enums/classList';
import { GoToFn } from '../../base/types';
import Page from '../page';
import Api from '../../api';
import { createElement, createNewElement, client } from '../../base/helpers';
import ClockChart from './components/clockChart';
import Thought from './components/thought';
import RoutsList from '../../base/enums/routsList';
import Path from '../../base/enums/path';
import InnerText from '../../base/enums/innerText';
import PlanEditor from '../planPage/components/planEditor';
import Popup from '../../components/popup';
import { Plan, ThoughtsData } from '../../base/interface';

class HomePage extends Page {
  clockChartInst: ClockChart;
  userName: string;
  confirmDayInfo: boolean;
  confirmationTime: number;
  commonPopup: Popup;

  constructor(goTo: GoToFn, editor: PlanEditor, commonPopup: Popup) {
    super(PageList.homePage, goTo, editor);
    this.clockChartInst = new ClockChart();
    this.userName = '';
    this.confirmDayInfo = false;
    this.confirmationTime = 660;
    this.commonPopup = commonPopup;
  }

  private createCanvas() {
    const canvas = createNewElement<HTMLCanvasElement>('canvas', HomePageClassList.canvas);
    canvas.width = client.width;
    canvas.height = client.height;
    return canvas;
  }

  private async createThought(canvas: HTMLCanvasElement) {
    const thought = createElement('div', HomePageClassList.thought);
    const thoughtContainer = createElement('div', HomePageClassList.thoughtContainer);
    const thoughtTitle = createElement('h3', HomePageClassList.thoughtTitle);
    thoughtTitle.textContent = InnerText.thoughtText;
    const [thoughtsDataList, allPlans]: [ThoughtsData[], Plan[]] = await Promise.all([
      Api.getThoughts(),
      Api.getAllPlans(),
    ]);

    const fillWeekTime = allPlans.reduce((acc, plan) => {
      return acc + plan.duration;
    }, 0);

    const thoughtAddInst = new Thought(this.goTo, this.editor, this.commonPopup, fillWeekTime, '');
    const thoughtAdd = thoughtAddInst.draw(HomePageClassList.thoughtAdd);
    thoughtAdd.classList.remove(HomePageClassList.none);
    thought.append(thoughtTitle, thoughtAdd, thoughtContainer);

    thoughtAddInst.createThoughtsList(thoughtContainer, thoughtsDataList);
    thoughtAddInst.createFlyingThought(canvas, thoughtsDataList);

    const oldPopup = document.querySelector(`.${HomePageClassList.blur}`);
    if (oldPopup instanceof HTMLElement) {
      thoughtTitle.addEventListener('click', () => thoughtAddInst.openCloseThoughtList(thoughtAdd, oldPopup));
    } else {
      const popup = createNewElement('div', HomePageClassList.blur);
      popup.classList.add(HomePageClassList.none);
      document.body.append(popup);
      thoughtTitle.addEventListener('click', () => thoughtAddInst.openCloseThoughtList(thoughtAdd, popup));
      popup.addEventListener('click', () => thoughtAddInst.openCloseThoughtList(thoughtAdd, popup));
    }

    return thought;
  }

  private async setUserInfo() {
    try {
      console.log('setUserInfo');
      const userInfo = await Promise.all([Api.getUserProfile(), Api.getConfirmDayInfo()]);
      const [userProfile, confirmDayInfo] = userInfo;
      this.userName = userProfile.name;
      this.confirmDayInfo = confirmDayInfo;
      this.confirmationTime = userProfile.confirmationTime;
    } catch (error) {
      console.log(error);
    }
  }

  private async checkConfirmTime(confirmDay: HTMLElement) {
    setInterval(() => {
      if (!(window.location.pathname === Path.home)) return;
      if (this.clockChartInst.minutes >= this.confirmationTime && this.confirmDayInfo === false) {
        confirmDay.classList.add('show');
      } else if (this.confirmDayInfo === true) {
        confirmDay.classList.remove('show');
      }
    }, 1000);
  }

  private getCurrentDayNum() {
    const date = new Date();
    return date.getDay() - 1;
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    const page = document.createElement(HomePageClassList.section);
    try {
      const currentDayNum = this.getCurrentDayNum();
      const canvas = this.createCanvas();
      const [, thought, dayPlans] = await Promise.all([
        this.setUserInfo(),
        this.createThought(canvas),
        Api.getDayDistribution(currentDayNum.toString()),
      ]);
      const confirmDay = createElement('div', HomePageClassList.confirmDay);
      confirmDay.addEventListener('click', () => this.goTo(RoutsList.confirmPage));
      this.checkConfirmTime(confirmDay);

      const plan = createElement('div', HomePageClassList.plan);
      plan.textContent = InnerText.planText;
      plan.addEventListener('click', () => this.goTo(RoutsList.planPage));

      const profile = createElement('div', HomePageClassList.profile);
      profile.addEventListener('click', () => this.goTo(RoutsList.profilePage));

      profile.textContent = this.userName;

      const clock = await this.clockChartInst.draw(dayPlans.distributedPlans, currentDayNum);

      page.append(canvas, thought, profile, plan, confirmDay, clock);

      setTimeout(() => {
        this.clockChartInst.getTime();
      });
    } catch (error) {
      this.goTo(RoutsList.loginPage);
      console.log(error);
    }
    return page;
  }
}

export default HomePage;
