/* eslint-disable no-nested-ternary */
import { getExistentElement } from '../../../base/helpers';
import { HomePageClassList } from '../../../base/enums/classList';
import Path from '../../../base/enums/path';

class Clock {
  date: Date;

  hours: number;

  dayOfWeek: number;

  constructor() {
    this.hours = 0;
    this.date = new Date();
    this.dayOfWeek = 0;
  }

  setMorningSVG(color: string) {
    return `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style="stroke: ${color};"
      class="day-info__svg"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 2v8" />
      <path d="M5.2 11.2l1.4 1.4" />
      <path d="M2 18h2" />
      <path d="M20 18h2" />
      <path d="M17.4 12.6l1.4-1.4" />
      <path d="M22 22H2" />
      <path d="M8 6l4-4 4 4" />
      <path d="M16 18a4 4 0 00-8 0" />
    </svg>`;
  }

  setDaySVG(color: string) {
    return `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style="stroke: ${color};"
      class="day-info__svg"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="M5 5l1.5 1.5" />
      <path d="M17.5 17.5L19 19" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="M5 19l1.5-1.5" />
      <path d="M17.5 6.5L19 5" />
    </svg>`;
  }

  setEveningSVG(color: string) {
    return `<?xml version="1.0" encoding="utf-8"?><!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style="stroke: ${color};"
      class="day-info__svg"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M12 10V2" />
      <path d="M5.2 11.2l1.4 1.4" />
      <path d="M2 18h2" />
      <path d="M20 18h2" />
      <path d="M17.4 12.6l1.4-1.4" />
      <path d="M22 22H2" />
      <path d="M16 6l-4 4-4-4" />
      <path d="M16 18a4 4 0 00-8 0" />
    </svg>`;
  }

  setNightSVG(color: string) {
    return `<?xml version="1.0" encoding="utf-8"?>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      style="stroke: ${color};"
      class="day-info__svg"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>`;
  }

  showDayInfo(color: string) {
    const dayIcon = this.setIcon(color);
    const dayData = this.setDay(this.date);
    return `${dayIcon}\n${dayData}`;
  }

  setIcon(color: string) {
    return this.hours >= 6 && this.hours < 12
      ? this.setMorningSVG(color)
      : this.hours >= 12 && this.hours < 18
      ? this.setDaySVG(color)
      : this.hours >= 18 && this.hours < 24
      ? this.setEveningSVG(color)
      : this.setNightSVG(color);
  }

  setDay(date: Date) {
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

  private showTime(deg: number, hourDeg: number, hourCount: number, hr: HTMLElement, min: HTMLElement) {
    if (!(window.location.pathname === Path.home) || !document.querySelector(`.${HomePageClassList.clock}`)) return;
    const date = new Date();
    const hours = date.getHours() * hourDeg;
    const minutes = date.getMinutes() * deg;

    hr.style.transform = `rotateZ(${hours + minutes / hourCount}deg)`;
    min.style.transform = `rotateZ(${minutes}deg)`;
  }

  getTime() {
    const deg = 6;
    const hourDeg = 30;
    const hourCount = 12;

    const hr = getExistentElement(`.${HomePageClassList.hourCircle}`);
    const min = getExistentElement(`.${HomePageClassList.minutesCircle}`);

    this.showTime(deg, hourDeg, hourCount, hr, min);
    setInterval(() => {
      this.showTime(deg, hourDeg, hourCount, hr, min);
    }, 1000);
  }
}

export default Clock;
