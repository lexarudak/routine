import ErrorsList from '../../../base/enums/errorsList';
import InputType from '../../../base/enums/inputTypes';
import TextInput from './textInput';

class NameInput extends TextInput {
  maxValue: number;

  minValue: number;

  errorText: ErrorsList;

  constructor(placeholder: string) {
    super(InputType.text, placeholder);
    this.maxValue = 50;
    this.minValue = 2;
    this.errorText = ErrorsList.wrongName;
  }

  protected isValueValid(value: string): boolean {
    return value.length >= this.minValue && value.length <= this.maxValue;
  }

  protected getCorrectValue(value: string): string {
    return value.slice(0, this.maxValue);
  }
}

export default NameInput;
