import { getExistentElement } from '../../../base/helpers';
import { ThoughtsData } from '../../../base/interface';
// import thoughtData from '../data/thoughtData';
import Thought from './thought';
import Api from '../../../api';
import { HomePageClassList } from '../../../base/enums/classList';

class ThoughtBuilder extends Thought {
  thoughtText: string;

  constructor(text: string) {
    super(text);

    this.thoughtText = text;
  }

  async createThought(thoughtText: string) {
    // console.log('data', await Api.getThoughts());
    if (!thoughtText) return;

    await Api.createThoughts({ title: thoughtText });

    this.createThoughtsList(getExistentElement(`.${HomePageClassList.thoughtContainer}`));
    console.log('create:', thoughtText);
    this.thoughtText = '';
    getExistentElement<HTMLInputElement>(`.${HomePageClassList.thoughtInput}`).value = this.thoughtText;
  }

  async createThoughtsList(thoughtContainer: HTMLElement) {
    const container = thoughtContainer;
    container.innerHTML = '';
    const thoughtsArr: Thought[] = [];
    const thoughtsDataList = await Api.getThoughts();
    thoughtsDataList.forEach((thoughtDataEl: ThoughtsData) => {
      // eslint-disable-next-line no-underscore-dangle
      thoughtsArr.push(new Thought(thoughtDataEl.title, thoughtDataEl._id));
    });

    for (let i = 0; i < thoughtsArr.length; i += 1) {
      const thoughtEl = thoughtsArr[i].draw(HomePageClassList.thoughtItem);
      container.append(thoughtEl);
    }
  }
}

export default ThoughtBuilder;
