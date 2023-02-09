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

export { isHTMLElement, getExistentElement, getExistentElementByClass, createElement, createNewElement };
