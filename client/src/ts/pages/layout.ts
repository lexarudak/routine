import RoutsList from '../base/enums/routsList';

import { GoToFn } from '../base/types';
import { BaseClassList, ButtonClassList } from '../base/enums/classList';
import { createNewElement, getExistentElementByClass } from '../base/helpers';
import MessageType from '../base/enums/messageType';

class Layout {
  public makeNavButton(name: string, routPath: RoutsList | string, callback: GoToFn) {
    const btn: HTMLButtonElement = createNewElement('button', ButtonClassList.navButton);
    btn.classList.add(ButtonClassList.navButton);

    btn.innerText = name;
    btn.addEventListener('click', () => callback(routPath));

    return btn;
  }

  public makeBanner(type: MessageType, text: string) {
    const uiBanner = document.createElement('div');
    uiBanner.classList.add(BaseClassList.banner, `banner_${type}`);

    const uiTitle = document.createElement('h2');
    uiTitle.classList.add('banner__title');
    uiTitle.innerText = text;
    uiBanner.append(uiTitle);

    return uiBanner;
  }

  public makeSaveButton(save: () => void) {
    if (!document.querySelector(`.${ButtonClassList.saveButton}`)) {
      const btn: HTMLButtonElement = createNewElement('button', ButtonClassList.saveButton);
      btn.innerText = 'Save';
      btn.addEventListener('click', save);

      btn.classList.add('save-button_visible');
      btn.addEventListener('animationend', () => btn.classList.remove('save-button_visible'), { once: true });

      const uiMain = getExistentElementByClass('settings');
      uiMain.append(btn);
    }
  }

  public disableSaveButton() {
    const btn = getExistentElementByClass<HTMLButtonElement>(ButtonClassList.saveButton);
    btn.disabled = true;
  }

  public removeSaveButton() {
    const btn = getExistentElementByClass<HTMLButtonElement>(ButtonClassList.saveButton);
    btn.classList.add('save-button_hidden');
    btn.addEventListener('animationend', () => btn.remove());
  }
}

export default Layout;
