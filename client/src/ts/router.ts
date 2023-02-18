import RoutsList from './base/enums/routsList';
import { isDayOfWeek } from './base/helpers';
import Popup from './components/popup';
import DayPage from './pages/dayPage/dayPage';
import HomePage from './pages/homePage/homePage';
import LoginPage from './pages/loginPage/loginPage';
import NotFoundPage from './pages/notFoundPage/notFoundPage';
import PlanEditor from './pages/planPage/components/planEditor';
import PlanPage from './pages/planPage/planPage';
import ProfilePage from './pages/profilePage/profilePage';

class Router {
  private editor: PlanEditor;

  static homePage: HomePage;

  static planPage: PlanPage;

  static dayPage: DayPage;

  static notFoundPage: NotFoundPage;

  static loginPage: LoginPage;

  static profilePage: ProfilePage;

  constructor(popup: Popup) {
    this.editor = new PlanEditor(popup, this.goTo);
    Router.homePage = new HomePage(this.goTo, this.editor);
    Router.planPage = new PlanPage(this.goTo, popup, this.editor);
    Router.loginPage = new LoginPage(this.goTo, this.editor);
    Router.dayPage = new DayPage(this.goTo, popup, this.editor);
    Router.profilePage = new ProfilePage(this.goTo, this.editor);
    Router.notFoundPage = new NotFoundPage(this.goTo, this.editor);
  }

  private static async render(pathname: string) {
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
      case RoutsList.profilePage:
        await Router.profilePage.draw();
        break;
      default:
        if (isDayOfWeek(pathname)) {
          Router.dayPage.draw(isDayOfWeek(pathname));
        } else {
          Router.notFoundPage.draw();
        }

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
