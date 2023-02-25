import { TimeContainerClassList } from '../base/enums/classList';
import EditorMode from '../base/enums/editorMode';
import InnerText from '../base/enums/innerText';
import Values from '../base/enums/values';
import { createNewElement, getHours, getMinutes, minToHour } from '../base/helpers';

class TimeSlider {
  minTime: number;

  maxTime: number;

  currentTime: number;

  constructor() {
    this.minTime = Values.minPlanDuration;
    this.maxTime = Values.minPlanDuration;
    this.currentTime = Values.minPlanDuration;
  }

  public setTimer(minTime: number, maxTime: number, currentTime?: number) {
    this.minTime = minTime > Values.minPlanDuration ? minTime : Values.minPlanDuration;
    this.maxTime = maxTime;
    this.currentTime = currentTime || (maxTime > 60 ? 60 : this.minTime);
  }

  private makeSlider() {
    const slider: HTMLInputElement = createNewElement('input', TimeContainerClassList.timeContainerSlider);
    slider.type = 'range';
    slider.min = this.minTime.toString();
    slider.max = this.maxTime.toString();
    slider.value = this.currentTime.toString();
    return slider;
  }

  private makeHoursInput(id: string) {
    const input: HTMLInputElement = createNewElement('input', TimeContainerClassList.timeContainerTimeInput);
    input.id = id;
    input.type = 'number';
    return input;
  }

  private setTimeInterval(hours: HTMLInputElement, minutes: HTMLInputElement, time: string | Values) {
    hours.value = getHours(Number(time)).toString();
    minutes.value = getMinutes(Number(time)).toString();
    this.currentTime = Number(time);
  }

  private setCorrectTimeInterval(hours: HTMLInputElement, minutes: HTMLInputElement) {
    const time = Number(hours.value) * 60 + Number(minutes.value);
    console.log(time);
    if (time > this.maxTime) this.setTimeInterval(hours, minutes, this.maxTime);
    if (time < this.minTime) this.setTimeInterval(hours, minutes, this.minTime);
  }

  private setSlider(slider: HTMLInputElement, hours: HTMLInputElement, minutes: HTMLInputElement) {
    const currentTime = Number(hours.value) * 60 + Number(minutes.value);
    slider.value = currentTime.toString();
    this.currentTime = currentTime;
  }

  private addListeners(hours: HTMLInputElement, minutes: HTMLInputElement, slider: HTMLInputElement) {
    this.setTimeInterval(hours, minutes, slider.value);

    slider.addEventListener('input', () => this.setTimeInterval(hours, minutes, slider.value));

    hours.addEventListener('input', () => {
      hours.value = hours.value.replace(/\D+/g, '');
      if (hours.value.length > 1 && hours.value[0] === '0') hours.value = hours.value.substring(1);
      this.setSlider(slider, hours, minutes);
    });

    minutes.addEventListener('input', () => {
      minutes.value = minutes.value.replace(/\D+/g, '');
      minutes.value = minutes.value.slice(0, 2);
      if (Number(minutes.value) > 59) minutes.value = '59';
      this.setSlider(slider, hours, minutes);
    });

    hours.addEventListener('blur', () => {
      this.setCorrectTimeInterval(hours, minutes);
      if (hours.value === '') hours.value = '0';
    });

    minutes.addEventListener('blur', () => {
      minutes.value = minutes.value.padStart(2, '0');
      this.setCorrectTimeInterval(hours, minutes);
    });
    return { hours, minutes, slider };
  }

  private makeLabel(name: string) {
    const label: HTMLLabelElement = createNewElement('label', TimeContainerClassList.timeContainerTimeLabel);
    label.innerText = name;
    return label;
  }

  private weekHoursToDay() {
    return minToHour(Math.floor(this.currentTime / 7));
  }

  private makePerSection(
    hours: HTMLInputElement,
    minutes: HTMLInputElement,
    slider: HTMLInputElement,
    mode?: EditorMode
  ) {
    const perContainer = createNewElement('span', TimeContainerClassList.timeContainerPer);

    if (mode === EditorMode.newPlanFromWeek || mode === EditorMode.editWeekPlan) {
      const perVal = createNewElement('span', TimeContainerClassList.timeContainerPerVal);

      minutes.addEventListener('blur', () => {
        perVal.innerHTML = this.weekHoursToDay();
      });
      hours.addEventListener('blur', () => {
        perVal.innerHTML = this.weekHoursToDay();
      });
      slider.addEventListener('input', () => {
        perVal.innerHTML = this.weekHoursToDay();
      });

      perVal.innerHTML = this.weekHoursToDay();
      perContainer.append('( ~ ', perVal, '/day)');
    }
    // if (mode === EditorMode.newPlanDay || mode === EditorMode.day) perContainer.innerHTML = InnerText.perDay;
    return perContainer;
  }

  public draw(mode?: EditorMode) {
    const container = createNewElement('div', TimeContainerClassList.timeContainer);
    const { hours, minutes, slider } = this.addListeners(
      this.makeHoursInput(InnerText.hoursText),
      this.makeHoursInput(InnerText.minutesText),
      this.makeSlider()
    );

    container.append(
      hours,
      this.makeLabel(InnerText.hoursText),
      minutes,
      this.makeLabel(InnerText.minutesText),
      this.makePerSection(hours, minutes, slider, mode),
      slider
    );
    return container;
  }
}

export default TimeSlider;
