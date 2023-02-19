import { createElement } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';
import { ChartData } from '../../../base/interfaces';

class ToDo {
  draw(currSector: number, data: ChartData[]) {
    // console.log('sector', data, currSector);
    const sector = data.findIndex((el) => el.id === currSector);

    const toDoWrap = createElement('div', HomePageClassList.toDoWrap);
    const toDoTitle = createElement('h2', HomePageClassList.toDoTitle);
    toDoTitle.textContent = data[sector].title;

    toDoWrap.append(toDoTitle);
    if (data[sector].text) {
      const toDoTextarea = createElement('textarea', HomePageClassList.toDoTextarea);
      toDoTextarea.textContent = data[sector].text;
      toDoTextarea.spellcheck = false;
      toDoWrap.append(toDoTextarea);
    } else {
      const toDoText = createElement('div', HomePageClassList.toDoText);
      toDoText.textContent = 'There are no plans at this time.';
      toDoWrap.append(toDoText);
    }

    return toDoWrap;
  }
}

export default ToDo;
