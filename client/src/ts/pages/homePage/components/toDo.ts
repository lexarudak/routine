import { createNewElement } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';
import InnerText from '../../../base/enums/innerText';
import { DistDayPlan, ChartData } from '../../../base/interface';
import Api from '../../../api';

class ToDo {
  async updateToDoText(distDayPlans: DistDayPlan[], chartPlan: ChartData, toDoText: string) {
    const plan = distDayPlans.find((pl) => pl._id === chartPlan._id);
    if (plan) {
      plan.text = toDoText;
      chartPlan.text = toDoText;
      await Api.editPlan(plan);
    }
  }

  draw(plan: ChartData, distributedPlans: DistDayPlan[]) {
    const toDoWrap = createNewElement('div', HomePageClassList.toDoWrap);
    const toDoTitle = createNewElement('h2', HomePageClassList.toDoTitle);

    if (plan) {
      toDoTitle.textContent = plan.title;
      toDoWrap.append(toDoTitle);

      if (plan.text) {
        const toDoTextarea = createNewElement<HTMLTextAreaElement>('textarea', HomePageClassList.toDoTextarea);
        toDoTextarea.textContent = plan.text;
        toDoTextarea.spellcheck = false;
        toDoWrap.append(toDoTextarea);
        toDoTextarea.addEventListener('blur', () => this.updateToDoText(distributedPlans, plan, toDoTextarea.value));
      } else {
        const toDoText = createNewElement('div', HomePageClassList.toDoText);
        toDoText.textContent = InnerText.emptyPlanText;
        toDoWrap.append(toDoText);
      }
    }

    return toDoWrap;
  }
}

export default ToDo;
