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

export { isHTMLElement, getExistentElement, getExistentInputElement, getExistentElementByClass };
