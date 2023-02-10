import Popup from './components/popup';
import PlanEditor from './pages/planPage/components/planEditor';
import Router from './router';

class App {
  private router: Router;

  private popup: Popup;

  private editor: PlanEditor;

  constructor() {
    this.popup = new Popup();
    this.editor = new PlanEditor(this.popup);
    this.router = new Router(this.popup, this.editor);
  }

  start() {
    this.router.startRouter();
  }
}

export default App;
