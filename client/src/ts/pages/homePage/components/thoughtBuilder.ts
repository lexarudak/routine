import { getExistentElement } from '../../../base/helpers';
import thoughtData from '../data/thoughtData';
import Thought from './thought';
import { HomePageClassList } from '../../../base/enums/classList';

class ThoughtBuilder extends Thought {
  thoughtText: string;

  constructor(text: string) {
    super(text);

    this.thoughtText = text;
  }

  createThought(thoughtText: string) {
    if (!thoughtText) return;
    thoughtData.push({
      id: '63dab20a1bad4d34504b5c10',
      title: thoughtText,
    });

    this.createThoughtsList(getExistentElement(`.${HomePageClassList.thoughtContainer}`));
    console.log('create:', thoughtText);
    this.thoughtText = '';
    getExistentElement<HTMLInputElement>(`.${HomePageClassList.thoughtInput}`).value = this.thoughtText;
  }

  createThoughtsList(thoughtContainer: HTMLElement) {
    const container = thoughtContainer;
    container.innerHTML = '';
    const thoughtsArr: Thought[] = [];
    thoughtData.forEach((thoughtDataEl) => {
      thoughtsArr.push(new Thought(thoughtDataEl.title));
    });

    for (let i = 0; i < thoughtsArr.length; i += 1) {
      const thoughtEl = thoughtsArr[i].draw(HomePageClassList.thoughtItem);
      container.append(thoughtEl);
    }
  }
}

export default ThoughtBuilder;
