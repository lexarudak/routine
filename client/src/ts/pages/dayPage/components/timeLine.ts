import { ClassList } from '../../../base/enums/classList';
import { createNewElement, getExistentElementByClass } from '../../../base/helpers';

class Timeline {
  timelineDiv: HTMLDivElement;

  constructor() {
    this.timelineDiv = this.makeTimelineDiv();
  }

  private makeTimelineDiv() {
    const timelineDiv: HTMLDivElement = createNewElement('div', ClassList.timeline);
    this.addListenerOver(timelineDiv);
    return timelineDiv;
  }

  private addListenerOver(timelineDiv: HTMLDivElement) {
    timelineDiv.addEventListener('dragover', (e) => {
      const round = getExistentElementByClass(ClassList.planRoundDrag);
      console.log(e, round);
    });
  }

  public draw() {
    return this.timelineDiv;
  }
}

export default Timeline;
