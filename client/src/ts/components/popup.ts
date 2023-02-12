import ClassList from '../base/enums/classList';
import { getExistentElementByClass } from '../base/helpers';

class Popup {
  popup: HTMLElement;

  constructor() {
    this.popup = getExistentElementByClass(ClassList.popup);
  }

  public editorMode(callback?: () => void) {
    const closeFn = (e: Event) => this.close(e, closeFn, callback);
    this.popup.addEventListener('click', closeFn);
  }

  public editorModeOff(callback?: () => void) {
    const closeFn = (e: Event) => this.close(e, closeFn, callback);
    this.popup.removeEventListener('click', closeFn);
  }

  public close(e: Event, fnToDelete: (e: Event) => void, callback?: () => void) {
    const { target } = e;
    if (target instanceof HTMLElement) {
      if (target.classList.contains(ClassList.popup)) {
        if (callback) callback();
        this.clean(target);
        this.popup.removeEventListener('click', fnToDelete);
      }
      if (target.closest(`.${ClassList.editorButton}`)) {
        this.popup.removeEventListener('click', fnToDelete);
      }
    }
    if (target instanceof SVGElement) {
      if (target.closest(`.${ClassList.editorButton}`)) this.popup.removeEventListener('click', fnToDelete);
    }
  }

  public easyClose() {
    this.clean(this.popup);
  }

  private clean(target: HTMLElement) {
    target.addEventListener(
      'transitionend',
      function clearInner() {
        target.innerHTML = '';
      },
      { once: true }
    );
    target.classList.remove(ClassList.popupShow);
  }

  public open(inner: HTMLElement) {
    this.popup.append(inner);
    setTimeout(() => {
      this.popup.classList.add(ClassList.popupShow);
    }, 0);
  }
}

export default Popup;
