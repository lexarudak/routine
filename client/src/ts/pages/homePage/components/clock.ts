import { getExistentElement, createElement } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';
import Links from '../../../base/enums/links';

class Clock {
  getIcon(date: Date) {
    const hours = date.getHours();
    console.log(hours);

    getExistentElement('.chart');
    if (hours >= 6 && hours < 12) return Links.morning;
    if (hours >= 12 && hours < 18) return Links.day;
    if (hours >= 18 && hours < 24) return Links.evening;
    return Links.night;
  }

  getDay(date: Date) {
    const formatter = new Intl.DateTimeFormat('en', {
      weekday: 'short',
      month: 'long',
      day: 'numeric',
    });

    const dayInfo = formatter.format(date).replace(',', '').split(' ');

    return `
    <div class="day-info__date">${dayInfo[2]}</div>
    <div class="day-info__wrapper">
      <div class="day-info__day">${dayInfo[0]}</div>
      <div class="day-info__month">${dayInfo[1]}</div>
    </div>`;
  }

  getTime() {
    const deg = 6;
    const hourDeg = 30;
    const hourCount = 12;

    const hr = getExistentElement('.hour__circle');
    const min = getExistentElement('.minutes__circle');
    const dayInfoHTML = createElement('div', HomePageClassList.dayInfo);
    const dayIcon = createElement('div', HomePageClassList.dayIcon);

    setInterval(() => {
      const date = new Date();
      const hours = date.getHours() * hourDeg;
      const minutes = date.getMinutes() * deg;
      dayInfoHTML.innerHTML = this.getDay(date);
      dayIcon.style.backgroundImage = this.getIcon(date);
      dayInfoHTML.prepend(dayIcon);
      getExistentElement('.chart').append(dayInfoHTML);

      hr.style.transform = `rotateZ(${hours + minutes / hourCount}deg)`;
      min.style.transform = `rotateZ(${minutes}deg)`;
      // console.log(hours / hourDeg, minutes / deg);
    }, 1000);
  }
}

export default Clock;
