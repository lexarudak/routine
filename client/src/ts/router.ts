import RoutsList from './base/enums/routsList';
import Popup from './components/popup';
import HomePage from './pages/homePage/homePage';
import LoginPage from './pages/loginPage/loginPage';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import Page from './pages/page';
import PlanEditor from './pages/planPage/components/planEditor';
import PlanPage from './pages/planPage/planPage';

class Router {
  static homePage: Page;

  static planPage: Page;

  static notFoundPage: Page;

  static loginPage: Page;

  // static accountPage: Page;

  // static mondayPage: Page;

  // static tuesdayPage: Page;

  // static fridayPage: Page;

  // static saturdayPage: Page;

  // static sundayPage: Page;

  constructor(popup: Popup, editor: PlanEditor) {
    Router.homePage = new HomePage(this.goTo);
    Router.planPage = new PlanPage(this.goTo, popup, editor);
    Router.loginPage = new LoginPage(this.goTo);
    Router.notFoundPage = new NotFoundPage(this.goTo);
  }

  private static async render(pathname: string) {
    // console.log('render:', pathname);
    switch (pathname) {
      case RoutsList.planPage:
        await Router.planPage.draw();
        break;
      case RoutsList.loginPage:
        await Router.loginPage.draw();
        break;
      case RoutsList.homePage:
        await Router.homePage.draw();
        break;
      default:
        Router.notFoundPage.draw();
        break;
    }
  }

  public goTo(pageName: RoutsList | string) {
    window.history.pushState({ pageName }, pageName, pageName);
    Router.render(pageName);
    window.scrollTo(0, 0);
  }

  public async startRouter() {
    window.addEventListener('popstate', () => {
      Router.render(new URL(window.location.href).pathname);
    });
    const page = new URL(window.location.href).pathname;
    await Router.render(page);
  }
}

export default Router;
