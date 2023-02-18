import PageList from '../../base/enums/pageList';
import { HomePageClassList } from '../../base/enums/classList';
import { GoToFn } from '../../base/types';
import Page from '../page';
import Api from '../../api';
import { createElement, createNewElement, getExistentElement, client } from '../../base/helpers';
import ClockChart from './components/clockChart';
import Thought from './components/thought';
import RoutsList from '../../base/enums/routsList';
import Path from '../../base/enums/path';
import InnerText from '../../base/enums/innerText';
import PlanEditor from '../planPage/components/planEditor';

class HomePage extends Page {
  clockChartInst: ClockChart;

  constructor(goTo: GoToFn, editor: PlanEditor) {
    super(PageList.homePage, goTo, editor);
    this.clockChartInst = new ClockChart();
    this.clockChartInst = new ClockChart();
  }

  private createCanvas() {
    const canvas = createNewElement<HTMLCanvasElement>('canvas', HomePageClassList.canvas);
    canvas.width = client.width;
    canvas.height = client.height;
    return canvas;
  }

  private createThought(canvas: HTMLCanvasElement) {
    const thought = createElement('div', HomePageClassList.thought);
    const thoughtContainer = createElement('div', HomePageClassList.thoughtContainer);
    const thoughtTitle = createElement('h3', HomePageClassList.thoughtTitle);
    thoughtTitle.textContent = InnerText.thoughtText;

    const thoughtAddInst = new Thought(this.goTo, '');
    const thoughtAdd = thoughtAddInst.draw(HomePageClassList.thoughtAdd);
    thoughtAdd.classList.remove(HomePageClassList.none);
    thought.append(thoughtTitle, thoughtAdd, thoughtContainer);

    thoughtAddInst.createThoughtsList(thoughtContainer);
    thoughtAddInst.createFlyingThought(canvas);

    const popup = createNewElement('div', HomePageClassList.blur);
    popup.classList.add(HomePageClassList.none);
    document.body.append(popup);

    thoughtTitle.addEventListener('click', () => {
      getExistentElement(`.${HomePageClassList.canvas}`).classList.toggle(HomePageClassList.none);
      thoughtAdd.classList.toggle(HomePageClassList.none);
      popup.classList.toggle(HomePageClassList.none);

      document.querySelectorAll(`.${HomePageClassList.thoughtItem}`).forEach((el) => {
        if (thoughtAdd.classList.contains('none')) {
          el.classList.add(HomePageClassList.open);
          thoughtAdd.classList.remove(HomePageClassList.open);
        }
        el.classList.toggle(HomePageClassList.none);
      });
    });
    return thought;
  }

  private async checkConfirmTime(confirmDay: HTMLElement) {
    try {
      const confirmTime = (await Api.getUserProfile()).confirmationTime;
      console.log('confirmTime', confirmTime);
      setInterval(() => {
        if (!(window.location.pathname === Path.home)) return;
        if (this.clockChartInst.minutes >= confirmTime) {
          confirmDay.style.visibility = 'visible';
        } else {
          confirmDay.style.visibility = '';
        }
      }, 1000);
    } catch (error) {
      console.log(error);
      this.goTo(RoutsList.loginPage);
    }
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    const page = document.createElement(HomePageClassList.section);
    try {
      const canvas = this.createCanvas();

      const thought = this.createThought(canvas);

      const plan = createElement('div', HomePageClassList.plan);
      plan.textContent = InnerText.planText;
      plan.addEventListener('click', () => this.goTo(RoutsList.planPage));

      const confirmDay = createElement('div', HomePageClassList.confirmDay);
      confirmDay.addEventListener('click', () => this.goTo(RoutsList.confirmPage));
      this.checkConfirmTime(confirmDay);

      const signIn = createElement('div', HomePageClassList.signIn);
      signIn.addEventListener('click', () => this.goTo(RoutsList.profilePage));

      const userName = await Api.getUserProfile();
      signIn.textContent = userName.name;

      const clock = await this.clockChartInst.draw();

      page.append(canvas, thought, signIn, plan, confirmDay, clock);

      setTimeout(() => this.clockChartInst.getTime());
    } catch (error) {
      console.log(error);
      this.goTo(RoutsList.loginPage);
    }
    return page;
  }
}

export default HomePage;
