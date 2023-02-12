import ErrorsList from '../../../base/enums/errorsList';
import InputType from '../../../base/enums/inputTypes';
import FirstPasswordInput from './firstPasswordInput';
import TextInput from './textInput';

class SecondPasswordInput extends TextInput {
  firstPass: FirstPasswordInput;

  constructor(placeholder: string, firstPassword: FirstPasswordInput) {
    super(InputType.password, placeholder);
    this.firstPass = firstPassword;
    this.errorText = ErrorsList.wrong2Pass;
  }

  protected isValueValid(value: string): boolean {
    return value === this.firstPass.input.value;
  }
}

export default SecondPasswordInput;
