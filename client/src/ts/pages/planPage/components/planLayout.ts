import ButtonClasses from '../../../base/enums/buttonClasses';
import ButtonNames from '../../../base/enums/buttonNames';
import { ClassList } from '../../../base/enums/classList';
import InnerText from '../../../base/enums/innerText';
import RoutsList from '../../../base/enums/routsList';
import { GoToFn } from '../../../base/types';

class PlanLayout {
  public makeHomeButton(callback: GoToFn) {
    const btn = document.createElement('button');
    btn.innerText = ButtonNames.home;
    btn.classList.add(ButtonClasses.navButton);
    btn.addEventListener('click', () => callback(RoutsList.homePage));
    return btn;
  }

  public makeWeekLine() {
    const weekLine = document.createElement('div');
    weekLine.classList.add(ClassList.weekLine);
    return weekLine;
  }

  public makeWeekText(hours: string) {
    const weekTextContainer = document.createElement('div');
    weekTextContainer.classList.add(ClassList.weekTextContainer);
    const weekTextValue = document.createElement('div');
    weekTextValue.innerText = hours;
    const weekText = document.createElement('div');
    weekText.innerText = InnerText.allWeekHours;
    weekTextContainer.append(weekTextValue, weekText);
    return weekTextContainer;
  }
}

export default PlanLayout;
