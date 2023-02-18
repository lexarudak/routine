import { createElement, createNewElement, isHTMLElement } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';
import Api from '../../../api';
import { SetAttribute, GetAttribute } from '../../../base/enums/attributes';

class Thought {
  thoughtText: string;

  thoughtId: string | undefined;

  constructor(text: string, id?: string) {
    this.thoughtText = text;
    this.thoughtId = id;
  }

  async createThought(thoughtText: string, e: Event) {
    console.log(thoughtText, e);
  }

  async removeThought(thoughtText: string, e: Event) {
    if (!isHTMLElement(e.target) || !e.target.parentElement) return;
    const thoughtId = e.target.parentElement.dataset[GetAttribute.thoughtId];

    if (thoughtId) await Api.deleteThoughts(thoughtId);
    console.log(thoughtText, thoughtId);
  }

  openCloseThought(e: Event, thoughtAdd: HTMLElement) {
    if (!isHTMLElement(e.target)) return;
    if (e.target.closest(`.${HomePageClassList.open}`)) {
      thoughtAdd.classList.remove(HomePageClassList.open);
    } else {
      thoughtAdd.classList.add(HomePageClassList.open);
    }
  }

  draw(elClass: string) {
    const thoughtAdd = createElement('div', elClass);
    const thoughtAddBtn = createElement('div', HomePageClassList.thoughtAddBtn);
    thoughtAdd.classList.add(HomePageClassList.none);

    const thoughtInput = createNewElement<HTMLInputElement>('input', HomePageClassList.thoughtInput);
    thoughtInput.value = this.thoughtText;
    if (this.thoughtId !== undefined) thoughtAdd.setAttribute(SetAttribute.thoughtId, this.thoughtId.toString());
    thoughtInput.addEventListener('blur', () => {
      if (!thoughtInput.value) return;
      this.thoughtText = thoughtInput.value;
    });

    const thoughtCreate = createNewElement('div', HomePageClassList.thoughtCreateBtn);

    thoughtCreate.addEventListener('click', (e) => {
      this.createThought(this.thoughtText, e);
    });
    thoughtAdd.append(thoughtInput);
    thoughtAddBtn.addEventListener('click', (e) => this.openCloseThought(e, thoughtAdd));

    if (elClass === HomePageClassList.thoughtItem) {
      const thoughtRemove = createNewElement('div', HomePageClassList.thoughtRemoveBtn);

      thoughtRemove.addEventListener('click', (e) => {
        this.removeThought(this.thoughtText, e);
      });
      thoughtAdd.append(thoughtRemove);
    }

    thoughtAdd.append(thoughtCreate, thoughtAddBtn);
    return thoughtAdd;
  }
}

export default Thought;
