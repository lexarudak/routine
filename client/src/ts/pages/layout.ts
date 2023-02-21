import ButtonClasses from '../base/enums/buttonClasses';
import RoutsList from '../base/enums/routsList';

import { GoToFn } from '../base/types';
import { ClassList } from '../base/enums/classList';
import { createNewElement, getExistentElementByClass } from '../base/helpers';

import * as enums from '../base/enums/enums';

class Layout {
  public makeNavButton(name: string, routPath: RoutsList, callback: GoToFn) {
    const btn: HTMLButtonElement = createNewElement('button', ButtonClasses.navButton);

    btn.innerText = name;
    btn.addEventListener('click', () => callback(routPath));

    return btn;
  }

  public makeBanner(type: enums.MessageType, text: string) {
    const uiBanner = document.createElement('div');
    uiBanner.classList.add(ClassList.banner, `banner_${type}`);

    const uiTitle = document.createElement('h2');
    uiTitle.classList.add('banner__title');
    uiTitle.innerText = text;
    uiBanner.append(uiTitle);

    return uiBanner;
  }

  public makeSaveButton(save: () => void) {
    if (!document.querySelector(`.${ButtonClasses.saveButton}`)) {
      const btn: HTMLButtonElement = createNewElement('button', ButtonClasses.saveButton);
      btn.innerText = 'Save';
      btn.addEventListener('click', save);

      btn.classList.add('save-button_visible');
      btn.addEventListener('animationend', () => btn.classList.remove('save-button_visible'), { once: true });

      const uiMain = getExistentElementByClass('main__container');
      uiMain.append(btn);
    }
  }

  public disableSaveButton() {
    const btn = getExistentElementByClass<HTMLButtonElement>(ButtonClasses.saveButton);
    btn.disabled = true;
  }

  public removeSaveButton() {
    const btn = getExistentElementByClass<HTMLButtonElement>(ButtonClasses.saveButton);
    btn.classList.add('save-button_hidden');
    btn.addEventListener('animationend', () => btn.remove());
  }
}

export default Layout;
