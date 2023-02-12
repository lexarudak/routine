import ClassList from './enums/classList';
import ErrorsList from './enums/errorsList';
import RoutsList from './enums/routsList';
import { GoToFn } from './types';

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

const createElement = (tag: string, className: string): HTMLElement => {
  const element: HTMLElement = document.createElement(tag);
  element.classList.add(className);
  return element;
};

function createNewElement<T extends HTMLElement>(tag: string, className: string): T {
  const element = document.createElement(tag);
  element.classList.add(className);
  return <T>element;
}

const client = {
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
};

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
    return `${Math.floor(min / 60)}:${(min % 60).toString().padStart(2, '0')} h`;
  }
  throw new Error(ErrorsList.minToHourError);
}

function getHours(min: number) {
  return Math.floor(min / 60);
}

function getMinutes(min: number) {
  return (min % 60).toString().padStart(2, '0');
}

function getEventTarget(e: Event) {
  const { target } = e;
  if (!(target instanceof HTMLElement)) throw new Error(ErrorsList.elementNotFound);
  return target;
}

function makeColorTransparent(color: string, transPercent: number) {
  const percent = 256 * (transPercent / 100);
  return color + percent.toString(16);
}

function makeElement(classList: ClassList, element?: string) {
  const el = document.createElement(element || 'div');
  if (!el) throw new Error(ErrorsList.wrongElementName);
  el.classList.add(classList);
  return el;
}

function loginRedirect(error: unknown, goTo: GoToFn) {
  if (error instanceof Error) {
    if (error.message === ErrorsList.needLogin) {
      goTo(RoutsList.loginPage);
    }
  }
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
  makeElement,
  getHours,
  getMinutes,
  getEventTarget,
  loginRedirect,
  isHTMLElement,
  getExistentElement,
  getExistentElementByClass,
  createElement,
  createNewElement,
  client,
};
