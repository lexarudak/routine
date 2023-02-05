import ErrorsList from '../../../base/enums/errorsList';
import InputType from '../../../base/enums/inputTypes';
import TextInput from './textInput';

class FirstPasswordInput extends TextInput {
  minValue: number;

  constructor(placeholder: string) {
    super(InputType.password, placeholder);

    this.errorText = ErrorsList.wrong1Pass;
    this.minValue = 4;
  }

  protected isValueValid(value: string): boolean {
    return value.length >= this.minValue;
  }
}

export default FirstPasswordInput;
