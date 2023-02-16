import ButtonClasses from '../base/enums/buttonClasses';
import RoutsList from '../base/enums/routsList';

import { GoToFn } from '../base/types';
import { createNewElement, getExistentElementByClass } from '../base/helpers';

class Layout {
  public makeNavButton(name: string, routPath: RoutsList, callback: GoToFn) {
    const btn: HTMLButtonElement = createNewElement('button', ButtonClasses.navButton);
    btn.innerText = name;
    btn.addEventListener('click', () => callback(routPath));
    return btn;
  }

  public makeSaveButton(save: () => void) {
    if (!document.querySelector(`.${ButtonClasses.saveButton}`)) {
      const btn: HTMLButtonElement = createNewElement('button', ButtonClasses.saveButton);
      btn.innerText = 'Save';
      btn.addEventListener('click', () => save());

      btn.classList.add('save-button_visible');
      btn.addEventListener('animationend', () => btn.classList.remove('save-button_visible'), { once: true });

      const uiMain = getExistentElementByClass('main__container');
      uiMain.append(btn);
    }
  }

  public removeSaveButton() {
    const btn = getExistentElementByClass<HTMLButtonElement>(ButtonClasses.saveButton);
    btn.classList.add('save-button_hidden');
    btn.addEventListener('animationend', () => btn.remove());
  }
}

export default Layout;
