import Popup from './components/popup';
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
    this.popup.start();
  }
}

export default App;
