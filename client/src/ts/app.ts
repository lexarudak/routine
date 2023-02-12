import { ClassList } from './base/enums/classList';
import { getExistentElementByClass, isHTMLElement } from './base/helpers';
import Router from './router';

class App {
  private router: Router;

  constructor() {
    this.router = new Router();
  }

  private static clearPopup(e: Event) {
    const { target } = e;
    if (isHTMLElement(target)) {
      if (target.classList.contains(ClassList.popup)) {
        target.addEventListener(
          'transitionend',
          function clearInner() {
            target.innerHTML = '';
          },
          { once: true }
        );
        target.classList.remove(ClassList.popupShow);
      }
    }
  }

  start() {
    this.router.startRouter();
    getExistentElementByClass(ClassList.popup).addEventListener('click', function s(e) {
      App.clearPopup(e);
    });
  }
}

export default App;
