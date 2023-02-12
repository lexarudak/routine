import { createElement, createNewElement, isHTMLElement } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';

class Thought {
  thoughtText: string;

  constructor(text: string) {
    this.thoughtText = text;
  }

  createThought(thoughtText: string, e: Event) {
    console.log(thoughtText, e);
  }

  openCloseThought(e: Event, thoughtAdd: HTMLElement) {
    if (!isHTMLElement(e.target)) return;
    if (e.target.closest('.open')) {
      thoughtAdd.classList.remove('open');
    } else {
      thoughtAdd.classList.add('open');
    }
  }

  draw(elClass: string) {
    const thoughtAdd = createElement('div', elClass);
    const thoughtAddBtn = createElement('div', HomePageClassList.thoughtAddBtn);
    thoughtAdd.classList.add('none');

    const thoughtInput = createNewElement<HTMLInputElement>('input', HomePageClassList.thoughtInput);
    thoughtInput.value = this.thoughtText;
    thoughtInput.addEventListener('blur', () => {
      if (!thoughtInput.value) return;
      this.thoughtText = thoughtInput.value;
    });

    const thoughtCreate = createNewElement('div', HomePageClassList.thoughtCreateBtn);

    thoughtCreate.addEventListener('click', (e) => {
      this.createThought(this.thoughtText, e);
    });

    thoughtAddBtn.addEventListener('click', (e) => this.openCloseThought(e, thoughtAdd));

    thoughtAdd.append(thoughtInput, thoughtCreate, thoughtAddBtn);
    return thoughtAdd;
  }
}

export default Thought;
