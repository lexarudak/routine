import { createNewElement } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';
import { ChartData } from '../../../base/interfaces';
import { DistDayPlan } from '../../../base/interface';
// import Api from '../../../api';

class ToDo {
  async updateToDoText(distDayPlans: DistDayPlan[], chartPlan: ChartData, toDoText: string) {
    console.log('!!!', distDayPlans, chartPlan._id, toDoText);
    const planIndex = distDayPlans.findIndex((pl) => pl._id === chartPlan._id);
    distDayPlans[planIndex].text = toDoText;
    chartPlan.text = toDoText;

    //  await Api.pushDayDistribution(distDayPlans);
  }

  draw(currSector: number, chartPlans: ChartData[], distributedPlans: DistDayPlan[]) {
    const toDoWrap = createNewElement('div', HomePageClassList.toDoWrap);
    const toDoTitle = createNewElement('h2', HomePageClassList.toDoTitle);
    try {
      const sector = chartPlans.findIndex((el) => el.id === currSector);

      toDoTitle.textContent = chartPlans[sector].title;
      toDoWrap.append(toDoTitle);

      if (chartPlans[sector].text) {
        const toDoTextarea = createNewElement<HTMLTextAreaElement>('textarea', HomePageClassList.toDoTextarea);
        toDoTextarea.textContent = chartPlans[sector].text;
        toDoTextarea.spellcheck = false;
        toDoWrap.append(toDoTextarea);
        toDoTextarea.addEventListener('blur', () =>
          this.updateToDoText(distributedPlans, chartPlans[sector], toDoTextarea.value)
        );
      } else {
        const toDoText = createNewElement('div', HomePageClassList.toDoText);
        toDoText.textContent = 'There are no plans at this time.';
        toDoWrap.append(toDoText);
      }
    } catch {
      console.log('fix');
    }

    return toDoWrap;
  }
}

export default ToDo;
