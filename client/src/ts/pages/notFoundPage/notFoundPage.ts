import PagesList from '../../base/enums/pageList';
import Page from '../page';

class NotFoundPage extends Page {
  constructor() {
    super(PagesList.notFound);
  }
}

export default NotFoundPage;
