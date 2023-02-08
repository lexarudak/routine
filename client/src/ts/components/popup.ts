import ClassList from '../base/enums/classList';
import { getExistentElementByClass, isHTMLElement } from '../base/helpers';

class Popup {
  popup: HTMLElement;

  constructor() {
    this.popup = getExistentElementByClass(ClassList.popup);
  }

  private clean(e: Event) {
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

  public open(inner: HTMLElement) {
    this.popup.append(inner);
    setTimeout(() => {
      this.popup.classList.add(ClassList.popupShow);
    }, 0);
  }

  public start() {
    this.popup.addEventListener('click', (e) => this.clean(e));
  }
}

export default Popup;
