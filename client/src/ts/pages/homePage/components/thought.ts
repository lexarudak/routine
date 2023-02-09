import { createElement, createNewElement, isHTMLElement, getExistentElement } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';

class Thought {
  thoughtText: string;

  constructor() {
    this.thoughtText = '';
  }

  createThought(thoughtText: string, e: Event) {
    if (!thoughtText) return;
    if (!isHTMLElement(e.target)) return;
    if (e.target.closest('.thought__main')) {
      const newThought = this.draw(thoughtText);
      getExistentElement('.thought').append(newThought);
    }
    console.log(thoughtText);
  }

  draw(title = '') {
    const thoughtAdd = createElement('div', HomePageClassList.thoughtAdd);
    const thoughtAddBtn = createElement('div', HomePageClassList.thoughtAddBtn);

    const thoughtInput = createNewElement<HTMLInputElement>('input', HomePageClassList.thoughtInput);
    thoughtInput.value = title;
    thoughtInput.addEventListener('blur', () => {
      if (!thoughtInput.value) return;
      this.thoughtText = thoughtInput.value;
    });

    const thoughtCreate = createNewElement('div', HomePageClassList.thoughtCreateBtn);
    thoughtCreate.addEventListener('click', (e) => {
      this.createThought(this.thoughtText, e);
      thoughtInput.value = '';
    });

    thoughtAdd.append(thoughtInput, thoughtCreate, thoughtAddBtn);
    const popup = createNewElement('div', 'blur');

    thoughtAddBtn.addEventListener('click', (e) => {
      if (!isHTMLElement(e.target)) return;
      if (e.target.closest('.open')) {
        thoughtAdd.classList.remove('open');
        // if (!document.querySelector('.open'))
        document.body.removeChild(popup);
      } else {
        thoughtAdd.classList.add('open');
        // if (!document.querySelector('.blur'))
        document.body.append(popup);
      }
    });

    return thoughtAdd;
  }
}

export default Thought;
