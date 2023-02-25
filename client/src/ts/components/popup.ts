import { BaseClassList, EditorClassList } from '../base/enums/classList';
import { getExistentElementByClass } from '../base/helpers';

class Popup {
  popup: HTMLElement;
  protected opened = false;

  constructor() {
    this.popup = getExistentElementByClass(BaseClassList.popup);
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
      if (target.classList.contains(BaseClassList.popup)) {
        if (callback) callback();
        this.clean(target);
        this.popup.removeEventListener('click', fnToDelete);
      }
      if (target.closest(`.${EditorClassList.editorButton}`)) {
        this.popup.removeEventListener('click', fnToDelete);
      }
    }
    if (target instanceof SVGElement) {
      if (target.closest(`.${EditorClassList.editorButton}`)) this.popup.removeEventListener('click', fnToDelete);
    }
  }

  public easyClose() {
    this.clean(this.popup);
  }

  private clean(target: HTMLElement) {
    target.addEventListener(
      'transitionend',
      () => {
        this.opened = false;
        target.innerHTML = '';
      },
      { once: true }
    );
    target.classList.remove(BaseClassList.popupShow);
  }

  public open(inner: HTMLElement) {
    if (this.opened) {
      this.refresh(inner);
    } else {
      this.popup.append(inner);
      setTimeout(() => {
        this.opened = true;
        this.popup.classList.add(BaseClassList.popupShow);
      }, 0);
    }
  }

  public refresh(inner: HTMLElement) {
    this.popup.innerHTML = '';
    this.popup.append(inner);
  }

  public isOpen() {
    return this.opened;
  }
}

export default Popup;
