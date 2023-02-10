import ClassList from '../../../base/enums/classList';
import InnerText from '../../../base/enums/innerText';
import Values from '../../../base/enums/values';
import { getHours, getMinutes, makeElement } from '../../../base/helpers';

class TimeSlider {
  minTime;

  maxTime;

  currentTime: number | undefined;

  constructor() {
    this.minTime = Values.minPlanDuration;
    this.maxTime = Values.minPlanDuration;
  }

  public setTimer(minTime: number, maxTime: number, currentTime?: number) {
    this.minTime = minTime > Values.minPlanDuration ? minTime : Values.minPlanDuration;
    this.maxTime = maxTime;
    this.currentTime = currentTime;
  }

  private makeSlider() {
    const slider = document.createElement('input');
    slider.classList.add(ClassList.timeContainerSlider);
    slider.type = 'range';
    slider.id = Values.timeSliderId;
    slider.min = this.minTime.toString();
    slider.max = this.maxTime.toString();
    slider.value = (this.currentTime || this.minTime).toString();
    return slider;
  }

  private makeHoursInput(id: string) {
    const input = document.createElement('input');
    input.id = id;
    input.classList.add(ClassList.timeContainerTimeInput);
    input.type = 'number';
    return input;
  }

  private setTimeInterval(hours: HTMLInputElement, minutes: HTMLInputElement, time: string | Values) {
    hours.value = getHours(Number(time)).toString();
    minutes.value = getMinutes(Number(time)).toString();
  }

  private setCorrectTimeInterval(hours: HTMLInputElement, minutes: HTMLInputElement) {
    const time = Number(hours.value) * 60 + Number(minutes.value);
    console.log(time);
    if (time > this.maxTime) this.setTimeInterval(hours, minutes, this.maxTime);
    if (time < this.minTime) this.setTimeInterval(hours, minutes, this.minTime);
  }

  private setSlider(slider: HTMLInputElement, hours: HTMLInputElement, minutes: HTMLInputElement) {
    slider.value = (Number(hours.value) * 60 + Number(minutes.value)).toString();
  }

  private addListeners(hours: HTMLInputElement, minutes: HTMLInputElement, slider: HTMLInputElement) {
    this.setTimeInterval(hours, minutes, slider.value);

    slider.addEventListener('input', () => this.setTimeInterval(hours, minutes, slider.value));

    hours.addEventListener('input', () => {
      hours.value = hours.value.replace(/\D+/g, '');
      if (hours.value.length > 1 && hours.value[0] === '0') hours.value = hours.value.substring(1);
      this.setCorrectTimeInterval(hours, minutes);
      this.setSlider(slider, hours, minutes);
    });

    minutes.addEventListener('input', () => {
      minutes.value = minutes.value.replace(/\D+/g, '');
      minutes.value = minutes.value.slice(0, 2);
      if (Number(minutes.value) > 59) minutes.value = '59';
      this.setSlider(slider, hours, minutes);
    });

    hours.addEventListener('blur', () => {
      if (hours.value === '') hours.value = '0';
    });

    minutes.addEventListener('blur', () => {
      minutes.value = minutes.value.padStart(2, '0');
      this.setCorrectTimeInterval(hours, minutes);
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
