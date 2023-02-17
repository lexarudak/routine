import Layout from '../../layout';

import { User } from '../../../base/interface';

class ConfirmLayout extends Layout {
  public makeHeader(profile: User) {
    const container = document.createElement('div');

    container.classList.add('confirm-header');
    container.innerHTML = `
      <div class="confirm-header__greeting">Confirm day! ${profile.confirmationDay}</div>
      <div class="confirm-header__info">Drag the edge to change the time</div>`;

    return container;
  }
}

export default ConfirmLayout;
