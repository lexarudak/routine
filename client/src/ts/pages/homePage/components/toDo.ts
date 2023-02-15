import { createElement } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';
import { ChartData } from '../../../base/interfaces';

class ToDo {
  draw(currSector: number, data: ChartData[]) {
    const toDoWrap = createElement('div', HomePageClassList.toDoWrap);
    const toDoTitle = createElement('h2', HomePageClassList.toDoTitle);
    const toDoTextarea = createElement('textarea', HomePageClassList.toDoTextarea);
    toDoTitle.textContent = data[currSector].title;
    toDoTextarea.textContent = data[currSector].text;
    toDoWrap.append(toDoTitle, toDoTextarea);

    return toDoWrap;
  }
}

export default ToDo;
