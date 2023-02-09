import ClassList from '../base/enums/classList';
import ErrorsList from '../base/enums/errorsList';
import InnerText from '../base/enums/innerText';
import Values from '../base/enums/values';
import { getHours, getMinutes, makeElement } from '../base/helpers';

class TimeSlider {
  minTime;

  maxTime;

  constructor() {
    this.minTime = Values.minPlanDuration;
    this.maxTime = Values.minPlanDuration;
  }

  public setTimer(minTime: number, maxTime: number) {
    this.minTime = minTime;
    this.maxTime = maxTime;
  }

  private makeSlider(value?: number) {
    const slider = document.createElement('input');
    slider.classList.add(ClassList.timeContainerSlider);
    slider.type = 'range';
    slider.id = Values.timeSliderId;
    slider.min = this.minTime.toString();
    slider.max = this.maxTime.toString();
    slider.value = (value || this.minTime).toString();
    return slider;
  }

  private makeHoursInput(id: string) {
    const input = document.createElement('input');
    input.id = id;
    input.classList.add(ClassList.timeContainerTimeInput);
    input.type = 'number';
    return input;
  }

  private addListeners(emptyHours: HTMLInputElement, emptyMinutes: HTMLInputElement, emptySlider: HTMLInputElement) {
    const hours = emptyHours;
    const minutes = emptyMinutes;
    const slider = emptySlider;

    hours.value = getHours(Number(slider.value)).toString();
    minutes.value = getMinutes(Number(slider.value)).toString();

    slider.addEventListener('input', (e) => {
      const { target } = e;
      if (!(target instanceof HTMLInputElement)) throw new Error(ErrorsList.elementIsNotInput);
      hours.value = getHours(Number(slider.value)).toString();
      minutes.value = getMinutes(Number(slider.value)).toString();
    });

    hours.addEventListener('input', (e) => {
      const { target } = e;
      if (!(target instanceof HTMLInputElement)) throw new Error(ErrorsList.elementIsNotInput);
      const time = Number(hours.value) * 60 + Number(minutes.value);
      hours.value = hours.value.replace(/\D+/g, '');
      if (hours.value.length > 1 && hours.value[0] === '0') hours.value = hours.value.substring(1);
      if (time > this.maxTime) {
        hours.value = getHours(Number(this.maxTime)).toString();
        minutes.value = getMinutes(Number(this.maxTime)).toString();
      }
      if (time < this.minTime) {
        hours.value = getHours(Number(this.minTime)).toString();
        minutes.value = getMinutes(Number(this.minTime)).toString();
      }
      slider.value = (Number(hours.value) * 60 + Number(minutes.value)).toString();
    });

    minutes.addEventListener('input', (e) => {
      const { target } = e;
      if (!(target instanceof HTMLInputElement)) throw new Error(ErrorsList.elementIsNotInput);
      const time = Number(hours.value) * 60 + Number(minutes.value);
      minutes.value = minutes.value.replace(/\D+/g, '');
      minutes.value = minutes.value.slice(0, 2);
      if (Number(minutes.value) > 59) minutes.value = '59';
      if (time > this.maxTime) {
        hours.value = getHours(Number(this.maxTime)).toString();
        minutes.value = getMinutes(Number(this.maxTime)).toString();
      }
      if (time < this.minTime) {
        hours.value = getHours(Number(this.minTime)).toString();
        minutes.value = getMinutes(Number(this.minTime)).toString();
      }
      slider.value = (Number(hours.value) * 60 + Number(minutes.value)).toString();
    });

    hours.addEventListener('blur', (e) => {
      const { target } = e;
      if (!(target instanceof HTMLInputElement)) throw new Error(ErrorsList.elementIsNotInput);
      if (hours.value === '') hours.value = '0';
    });

    minutes.addEventListener('blur', (e) => {
      const { target } = e;
      if (!(target instanceof HTMLInputElement)) throw new Error(ErrorsList.elementIsNotInput);
      minutes.value = minutes.value.padStart(2, '0');
    });
    return { hours, minutes, slider };
  }

  private makeLabel(name: string, id: string) {
    const label = document.createElement('label');
    label.classList.add(ClassList.timeContainerTimeLabel);
    label.htmlFor = id;
    label.innerText = name;
    return label;
  }

  public draw() {
    const container = makeElement(ClassList.timeContainer);
    const { hours, minutes, slider } = this.addListeners(
      this.makeHoursInput(InnerText.hoursText),
      this.makeHoursInput(InnerText.minutesText),
      this.makeSlider()
    );

    container.append(
      hours,
      this.makeLabel(InnerText.hoursText, Values.hoursInputId),
      minutes,
      this.makeLabel(InnerText.minutesText, Values.minutesInputId),
      slider
    );
    return container;
  }
}

export default TimeSlider;
