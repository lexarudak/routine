import ClassList from '../../../base/enums/classList';
import ErrorsList from '../../../base/enums/errorsList';
import InputType from '../../../base/enums/inputTypes';

class TextInput {
  private type: InputType;

  input: HTMLInputElement;

  private errorBlock: HTMLSpanElement;

  errorText: ErrorsList;

  constructor(type: InputType, placeholder: string) {
    this.type = type;
    this.input = this.createInput();
    this.errorBlock = this.createErrorBlock();
    this.input.setAttribute('placeholder', placeholder);
    this.errorText = ErrorsList.defaultInputError;
  }

  public blurCheck() {
    this.input.value = this.input.value.trim();
    const isValid = this.isValueValid(this.input.value);
    if (!isValid) this.showError();
    return isValid;
  }

  protected isValueValid(value: string): boolean {
    return !!value;
  }

  private inputCheck() {
    this.input.value = this.getCorrectValue(this.input.value);
    this.hideError();
  }

  protected getCorrectValue(value: string) {
    return value;
  }

  public showError(errorText?: ErrorsList) {
    this.errorBlock.innerHTML = this.errorText;
    if (errorText) this.errorBlock.innerHTML = errorText;
    this.errorBlock.classList.add(ClassList.inputErrorActive);
  }

  private hideError() {
    this.errorBlock.classList.remove(ClassList.inputErrorActive);
  }

  private createInput() {
    const input = document.createElement('input');
    input.type = this.type;
    input.addEventListener('blur', () => this.blurCheck());
    input.addEventListener('input', () => this.inputCheck());
    return input;
  }

  private createErrorBlock() {
    const block = document.createElement('span');
    block.classList.add(ClassList.inputError);
    return block;
  }

  public draw(containerClass?: ClassList, ...inputClasses: ClassList[]): HTMLElement {
    this.input.classList.add(ClassList.signInput);
    const container = document.createElement('div');
    container.classList.add(ClassList.signInputBox);
    if (containerClass) container.classList.add(containerClass);
    if (inputClasses.length > 0) {
      inputClasses.forEach((className) => {
        this.input.classList.add(className);
      });
    }
    container.append(this.input, this.errorBlock);
    return container;
  }
}

export default TextInput;
