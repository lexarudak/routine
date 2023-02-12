
import Popup from './components/popup';
import { ClassList } from './base/enums/classList';
import { getExistentElementByClass, isHTMLElement } from './base/helpers';
import Router from './router';

class App {
  private router: Router;

  private popup: Popup;

  constructor() {
    this.popup = new Popup();
    this.router = new Router(this.popup);
  }

  start() {
    this.router.startRouter();
  }
}

export default App;
