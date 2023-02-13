import { createElement } from '../../../base/helpers';
import toDoData from '../data/toDoData';
import { HomePageClassList } from '../../../base/enums/classList';

class ToDo {
  draw(currSector: number) {
    const toDoWrap = createElement('div', HomePageClassList.toDoWrap);
    const toDoTitle = createElement('h2', HomePageClassList.toDoTitle);
    toDoTitle.textContent = toDoData[currSector].title;

    const toDoTextarea = createElement('textarea', HomePageClassList.toDoTextarea);
    toDoTextarea.textContent = toDoData[currSector].text;
    toDoWrap.append(toDoTitle, toDoTextarea);

    return toDoWrap;
  }
}

export default ToDo;
