import { createElement } from '../../../base/helpers';
import toDoData from '../data/toDoData';
import { HomePageClassList } from '../../../base/enums/classList';

class ToDo {
  draw(currSector: number) {
    const toDoTitle = createElement('div', HomePageClassList.toDoTitle);
    toDoTitle.textContent = toDoData[currSector].title;

    const toDoTextarea = createElement('textarea', HomePageClassList.toDoTextarea);
    toDoTextarea.textContent = toDoData[currSector].text;
    toDoTitle.append(toDoTextarea);

    return toDoTitle;
  }
}

export default ToDo;
