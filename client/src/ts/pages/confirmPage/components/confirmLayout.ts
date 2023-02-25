import Layout from '../../../components/layout';

import { BaseClassList, ButtonClassList, ConfirmPageClassList, BannerClassList } from '../../../base/enums/classList';

import { Plan } from '../../../base/interface';
import { createNewElement, cutStringLine, getColors, minToHour } from '../../../base/helpers';
import Days from '../../../base/enums/days';

class ConfirmLayout extends Layout {
  public makeHeader() {
    const container = document.createElement('div');
    container.classList.add(ConfirmPageClassList.confirmHeader);
    container.innerHTML = `
      <h1 class="
        ${BaseClassList.title} 
        ${ConfirmPageClassList.confirmHeaderGreeting}">Confirm day</h1>
      <p class="${ConfirmPageClassList.confirmHeaderInfo}">Drag the edge to change the time</p>`;

    return container;
  }

  public makeConfirmContent(dayPlans: Plan[], dayOfWeek: number) {
    const container = document.createElement('div');
    container.classList.add(ConfirmPageClassList.confirmContent);

    const title = createNewElement('h2', BaseClassList.subtitle);
    title.innerHTML = Days[dayOfWeek];

    container.append(title, this.makeConfirmPlans(dayPlans), this.makeConfirmButton());

    return container;
  }

  private makeConfirmPlans(dayPlans: Plan[]) {
    const container = document.createElement('div');
    container.classList.add(ConfirmPageClassList.confirmPlans);

    dayPlans.forEach((plan) => container.append(this.makeConfirmPlan(plan)));

    return container;
  }

  private makeConfirmPlan(plan: Plan) {
    const container = document.createElement('div');
    container.classList.add(ConfirmPageClassList.confirmPlan);
    container.dataset.id = plan._id;

    const title = cutStringLine(plan.title, 20);
    const [bgColor] = getColors(plan.color);

    container.innerHTML = `
      <span class="${ConfirmPageClassList.confirmPlanLabel}">${title}</span>
      <div class="
        ${ConfirmPageClassList.planSquare}
        ${ConfirmPageClassList.confirmPlanLine}" style="background-color: ${bgColor};">
        <div class="${ConfirmPageClassList.confirmPlanArrows}">
          <img class="
            ${ConfirmPageClassList.confirmPlanArrow}
            ${ConfirmPageClassList.confirmPlanArrowLeft}" src="./assets/svg/arrow-left.svg" alt="Left">
          <img class="
            ${ConfirmPageClassList.confirmPlanArrow}
            ${ConfirmPageClassList.confirmPlanArrowRight}" src="./assets/svg/arrow-right.svg" alt="Right">
        </div>
      </div>
      <span class="${ConfirmPageClassList.confirmPlanTime}">${minToHour(plan.duration)}</span>`;

    return container;
  }

  private makeConfirmButton() {
    const container = createNewElement('button', ButtonClassList.button);
    container.classList.add(ConfirmPageClassList.confirmMainButton);
    container.innerHTML = 'Confirm!';

    return container;
  }

  public makeConfirmationBanner(yes: () => void, cancel: () => void) {
    const uiBanner = document.createElement('div');
    uiBanner.classList.add(BaseClassList.banner, 'banner_warning');

    const uiQuestion = document.createElement('h2');
    uiQuestion.classList.add(BannerClassList.bannerTitle);
    uiQuestion.innerText = 'This day is confirmed\nConfirm it again?';
    uiBanner.append(uiQuestion);

    const uiButtons = document.createElement('div');
    uiButtons.classList.add(BannerClassList.bannerButtons);

    const uiYes = document.createElement('button');
    uiYes.classList.add(ButtonClassList.button, BannerClassList.bannerButton);
    uiYes.innerHTML = 'Yes';
    uiYes.addEventListener('click', () => yes());
    uiButtons.append(uiYes);

    const uiCancel = document.createElement('button');
    uiCancel.classList.add(ButtonClassList.button, BannerClassList.bannerButton);
    uiCancel.innerHTML = 'Cancel';
    uiCancel.addEventListener('click', () => cancel());
    uiButtons.append(uiCancel);

    uiBanner.append(uiButtons);
    return uiBanner;
  }
}

export default ConfirmLayout;
