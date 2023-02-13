import { ClassList } from '../../../base/enums/classList';
import { createNewElement } from '../../../base/helpers';

class Timeline {
  public draw() {
    const container = createNewElement('div', ClassList.timeline);
    return container;
  }
}

export default Timeline;
