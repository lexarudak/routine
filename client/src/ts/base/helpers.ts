import ErrorsList from './enums/errorsList';

function isHTMLElement<T>(el: T | HTMLElement): el is HTMLElement {
  return el instanceof EventTarget;
}

function getExistentElement<T extends HTMLElement>(selector: string, node: Document | HTMLElement = document): T {
  const el = node.querySelector<T>(selector);
  if (el === null) throw new Error(ErrorsList.elementNotFound);
  return el;
}

function getExistentElementByClass<T extends HTMLElement>(
  selector: string,
  node: Document | HTMLElement = document
): T {
  return getExistentElement(`.${selector}`, node);
}

function getExistentInputElement<T extends HTMLElement>(
  selector: string,
  node: Document | HTMLElement = document
): HTMLInputElement {
  const el = node.querySelector<T>(selector);
  if (el === null) throw new Error(ErrorsList.elementNotFound);
  if (!(el instanceof HTMLInputElement)) throw new Error(ErrorsList.elementIsNotInput);
  return el;
}

function buttonOn(...buttons: HTMLButtonElement[]) {
  buttons.forEach((button) => {
    button.disabled = false;
  });
}

function buttonOff(...buttons: HTMLButtonElement[]) {
  buttons.forEach((button) => {
    button.disabled = true;
  });
}

function minToHour(min: number) {
  if (min < 60 && min >= 0) return `${min} min`;
  if (min >= 60) {
    if (min % 60 === 0) return `${Math.floor(min / 60)} h`;
    return `${Math.floor(min / 60)}:${min % 60} h`;
  }
  throw new Error(ErrorsList.minToHourError);
}

function makeColorTransparent(color: string, transPercent: number) {
  const percent = 256 * (transPercent / 100);
  return color + percent.toString(16);
}

export {
  isHTMLElement,
  getExistentElement,
  getExistentInputElement,
  getExistentElementByClass,
  buttonOn,
  buttonOff,
  minToHour,
  makeColorTransparent,
};
