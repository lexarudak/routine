import ClassList from '../base/enums/classList';
// import ErrorsList from '../base/enums/errorsList';
import { getEventTarget, getExistentElementByClass } from '../base/helpers';

class Popup {
  popup: HTMLElement;

  constructor() {
    this.popup = getExistentElementByClass(ClassList.popup);
  }

  public editorMode(callback: () => void) {
    const closeFn = (e: Event) => this.close(e, callback, closeFn);
    this.popup.addEventListener('click', closeFn);
    // this.popup.addEventListener('click', (e) => this.asyncClose(e, callback));
  }

  public newPlanMode(callback: () => void) {
    const closeFn = (e: Event) => this.close(e, callback, closeFn);
    this.popup.addEventListener('click', closeFn);
  }

  // private async asyncClose(e: Event, callback: () => Promise<void>) {
  //   const target = getEventTarget(e);
  //   try {
  //     await callback();
  //   } catch {
  //     throw new Error(ErrorsList.noLogin);
  //   } finally {
  //     this.clean(target);
  //   }
  // }

  public close(e: Event, callback: () => void, fnToDelete: (e: Event) => void) {
    const target = getEventTarget(e);
    if (target.classList.contains(ClassList.popup)) {
      callback();
      console.log('close works');
      this.clean(target);
      this.popup.removeEventListener('click', fnToDelete);
    }
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
