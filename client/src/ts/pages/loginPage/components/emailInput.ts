import ErrorsList from '../../../base/enums/errorsList';
import InputType from '../../../base/enums/inputTypes';
import TextInput from './textInput';

class EmailInput extends TextInput {
  constructor(placeholder: string) {
    super(InputType.email, placeholder);

    this.errorText = ErrorsList.wrongEmail;
  }

  protected isValueValid(value: string): boolean {
    const temp = /^[\w-.]+@[\w-]+\.[a-z]{2,4}$/i;
    return temp.test(value);
  }

  protected getCorrectValue(value: string): string {
    return value.slice(0, 200);
  }
}

export default EmailInput;
