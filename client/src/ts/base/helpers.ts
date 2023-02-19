import PlanRoundConfig from '../components/planRoundConfig';
import { ClassList } from './enums/classList';
import Days from './enums/days';
import ErrorsList from './enums/errorsList';
import RoutsList from './enums/routsList';
import Values from './enums/values';
import { DistDayPlan, Plan } from './interface';
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

const container = 1380;

const client = {
  width: document.documentElement.clientWidth,
  height: document.documentElement.clientHeight,
  planPosWidth: document.documentElement.clientWidth / 2 - container / 2 + 250,
  planPosHeight: document.documentElement.clientHeight / 2 - 15,
  clockPosWidth: document.documentElement.clientWidth / 2 + container / 2 - 330,
  clockPosHeight: document.documentElement.clientHeight / 2 - 15,
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

function sortAllPlans(plansArr: Plan[]) {
  return plansArr.sort((a, b) => (a.duration > b.duration ? -1 : 1));
}

function sortDistPlans(plansArr: DistDayPlan[]) {
  return plansArr.sort((a, b) => (a.from < b.from ? -1 : 1));
}

function minToHour(min: number) {
  if (min < 60 && min >= 0) return `${min} min`;
  if (min >= 60) {
    if (min % 60 === 0) return `${Math.floor(min / 60)} h`;
    return `${Math.floor(min / 60)}:${(min % 60).toString().padStart(2, '0')} h`;
  }
  throw new Error(ErrorsList.minToHourError);
}

function minToHourTimeline(min: number) {
  if (min >= 0) {
    return `${Math.floor(min / 60)
      .toString()
      .padStart(2, '0')}:${(min % 60).toString().padStart(2, '0')}`;
  }
  throw new Error(ErrorsList.minToHourError);
}

function getHours(min: number) {
  return Math.floor(min / 60);
}

function getMinutes(min: number) {
  return (min % 60).toString().padStart(2, '0');
}

function timeToMin(time: string) {
  return +time.slice(0, 2) * 60 + +time.slice(3);
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

function loginRedirect(error: unknown, goTo: GoToFn) {
  console.log(error instanceof Error);
  if (error instanceof Error) {
    if (error.message === ErrorsList.needLogin) {
      goTo(RoutsList.loginPage);
    }
  }
}

function isDayOfWeek(path: string) {
  for (let i = 0; i < 7; i += 1) {
    const dayId = i.toString();
    if (Days[i] === path.substring(1)) return dayId;
  }
  return '';
}

function pxToMin(containerWidthPx: number, px: number) {
  return Math.floor((px / containerWidthPx) * Values.allDayMinutes);
}

function minToPx(containerWidthPx: number, minutes: number) {
  return (containerWidthPx / Values.allDayMinutes) * minutes;
}

function makeRoundIcon(round: HTMLElement) {
  const width = round.clientWidth;
  const icon = round.cloneNode(true);
  let center = 0;
  if (icon instanceof HTMLElement) {
    getExistentElementByClass(ClassList.imgContainer).append(icon);
    icon.style.transform = Values.scaleNormal;
    icon.style.boxShadow = 'none';
    center = width / 2;
    const newBlur = icon.childNodes.item(1);
    if (newBlur instanceof HTMLElement) newBlur.style.display = `none`;
    if (width > 100) {
      icon.style.width = `${PlanRoundConfig.iconRoundSize}px`;
      icon.style.height = icon.style.width;
      if (icon.firstChild instanceof HTMLElement) icon.firstChild.style.fontSize = '14px';
      center = PlanRoundConfig.iconRoundSize / 2;
    }
    if (icon.lastChild instanceof HTMLElement) icon.lastChild.style.display = 'none';
  }
  if (!(icon instanceof HTMLElement)) throw new Error(ErrorsList.elementNotFound);
  return { icon, center };
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
  getHours,
  getMinutes,
  timeToMin,
  getEventTarget,
  loginRedirect,
  createElement,
  createNewElement,
  client,
  isDayOfWeek,
  sortAllPlans,
  makeRoundIcon,
  minToHourTimeline,
  sortDistPlans,
  pxToMin,
  minToPx,
};
