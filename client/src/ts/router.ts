import RoutsList from './base/enums/routsList';
import HomePage from './pages/homePage/homePage';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import Page from './pages/page';
import PlanPage from './pages/planPage/planPage';

class Router {
  static homePage: Page;

  static planPage: Page;

  static notFoundPage: Page;

  // static accountPage: Page;

  // static mondayPage: Page;

  // static tuesdayPage: Page;

  // static fridayPage: Page;

  // static saturdayPage: Page;

  // static sundayPage: Page;

  constructor() {
    Router.homePage = new HomePage();
    Router.planPage = new PlanPage();
    Router.notFoundPage = new NotFoundPage();
  }

  private static render(pathname: string) {
    // console.log('render:', pathname);
    switch (pathname) {
      case RoutsList.planPage:
        Router.planPage.draw();
        break;
      case RoutsList.homePage:
        Router.homePage.draw();
        break;
      default:
        Router.notFoundPage.draw();
        break;
    }
  }

  public static goTo(pageId: RoutsList) {
    window.history.pushState({ pageId }, pageId, pageId);
    Router.render(pageId);
    window.scrollTo(0, 0);
  }

  public startRouter() {
    window.addEventListener('popstate', () => {
      Router.render(new URL(window.location.href).pathname);
    });
    const page = new URL(window.location.href).pathname;
    Router.render(page);
  }
}

export default Router;
