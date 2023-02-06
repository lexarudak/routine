import RoutsList from './base/enums/routsList';
import HomePage from './pages/homePage/homePage';
import LoginPage from './pages/loginPage/loginPage';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import Page from './pages/page';
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

  constructor() {
    Router.homePage = new HomePage(this.goTo);
    Router.planPage = new PlanPage(this.goTo);
    Router.loginPage = new LoginPage(this.goTo);
    Router.notFoundPage = new NotFoundPage(this.goTo);
  }

  private static async render(pathname: string) {
    // console.log('render:', pathname);
    switch (pathname) {
      case RoutsList.planPage:
        Router.planPage.draw();
        break;
      case RoutsList.loginPage:
        Router.loginPage.draw();
        break;
      case RoutsList.homePage:
        Router.homePage.draw();
        break;
      default:
        Router.notFoundPage.draw();
        break;
    }
  }

  public goTo(pageName: RoutsList) {
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
    this.goTo(RoutsList.planPage);
  }
}

export default Router;
