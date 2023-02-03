import PagesList from '../../base/enums/pageList';
import { GoToFn } from '../../base/types';
import Page from '../page';

class PlanPage extends Page {
  constructor(goTo: GoToFn) {
    super(PagesList.planPage, goTo);
  }
}

export default PlanPage;
