import { createElement } from '../../base/helpers';
import todoData from './data/toDoData';
import { HomePageClassList } from '../../base/enums/classList';

class ToDo {
  draw(currSector: number) {
    const toDoList = createElement('ul', HomePageClassList.toDoList);
    toDoList.textContent = todoData[currSector].title;

    todoData[currSector].list.forEach((listItem) => {
      const toDoListItem = createElement('li', HomePageClassList.toDoListItem);
      toDoListItem.textContent = listItem;
      toDoList.append(toDoListItem);
    });

    return toDoList;
  }
}

export default ToDo;
