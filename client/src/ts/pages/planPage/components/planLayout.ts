import ButtonClasses from '../../../base/enums/buttonClasses';
import ButtonNames from '../../../base/enums/buttonNames';
import ClassList from '../../../base/enums/classList';
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
}

export default PlanLayout;
