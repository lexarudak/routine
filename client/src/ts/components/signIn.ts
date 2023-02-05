import ButtonClasses from '../base/enums/buttonClasses';
import ClassList from '../base/enums/classList';
import InnerText from '../base/enums/innerText';
import Values from '../base/enums/values';
import { getExistentElementByClass } from '../base/helpers';
import EmailInput from './emailInput';
import FirstPasswordInput from './firstPasswordInput';
import NameInput from './nameInput';
import SecondPasswordInput from './secondPasswordInput';

class SignIn {
  status: InnerText.signIn | InnerText.signUp;

  nameInput: NameInput;

  firstPasswordInput: FirstPasswordInput;

  secondPasswordInput: SecondPasswordInput;

  emailInput: EmailInput;

  checkbox: HTMLInputElement;

  constructor() {
    this.status = InnerText.signIn;
    this.nameInput = new NameInput(Values.namePlaceholder);
    this.firstPasswordInput = new FirstPasswordInput(Values.passwordPlaceholder);
    this.secondPasswordInput = new SecondPasswordInput(Values.secondPasswordPlaceholder, this.firstPasswordInput);
    this.emailInput = new EmailInput(Values.emailPlaceholder);

    this.checkbox = this.makeCheckbox();
  }

  private checkForm() {
    const email = this.emailInput.blurCheck();
    const password = this.firstPasswordInput.blurCheck();
    if (this.status === InnerText.signIn) {
      if (email && password) this.sendSignInForm();
    } else {
      const name = this.nameInput.blurCheck();
      const password2 = this.secondPasswordInput.blurCheck();
      if (email && password && name && password2) this.sendSignUpForm();
    }
  }

  private sendSignInForm() {
    console.log('Email:', this.emailInput.input.value);
    console.log('Pass:', this.firstPasswordInput.input.value);
    console.log('Remember:', this.checkbox.checked);
  }

  private sendSignUpForm() {
    console.log('Name:', this.nameInput.input.value);
    console.log('Email:', this.emailInput.input.value);
    console.log('Pass:', this.firstPasswordInput.input.value);
  }

  private toggleFormClass() {
    const form = getExistentElementByClass(ClassList.signForm);
    form.classList.toggle(ClassList.signUp);
    form.classList.toggle(ClassList.signIn);
  }

  private toggleStatus(): void {
    switch (this.status) {
      case InnerText.signIn:
        this.status = InnerText.signUp;
        break;
      case InnerText.signUp:
        this.status = InnerText.signIn;
        break;
      default:
        break;
    }
  }

  private makeEmptyForm(): HTMLElement {
    const form = document.createElement('div');
    form.classList.add(ClassList.signForm, ClassList.signIn);
    return form;
  }

  private makeTitle(text: InnerText, className: ClassList) {
    const title = document.createElement('h1');
    title.classList.add(ClassList.signTitle, className);
    title.innerHTML = text;
    return title;
  }

  private makeCheckbox() {
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = Values.rememberMeId;
    return checkBox;
  }

  private makeLabel() {
    const label = document.createElement('label');
    label.setAttribute('for', Values.rememberMeId);
    label.classList.add(ClassList.signLabel, ClassList.signInView);
    const bigO = document.createElement('div');
    bigO.classList.add(ClassList.bigO);
    const smallO = document.createElement('div');
    smallO.classList.add(ClassList.smallO);
    bigO.append(smallO);
    const text = document.createElement('span');
    text.innerHTML = InnerText.rememberMe;
    label.append(bigO, text);
    return label;
  }

  private makeLink(text: string, className: ClassList) {
    const span = document.createElement('span');
    span.innerText = text;
    span.addEventListener('click', () => {
      this.toggleStatus();
      this.toggleFormClass();
    });
    span.classList.add(ClassList.signLink, className);
    return span;
  }

  private makeButton() {
    const signInBtn = document.createElement('button');
    signInBtn.classList.add(ButtonClasses.button, ButtonClasses.signIn, ClassList.signInButton);
    const signInText = document.createElement('span');
    signInText.classList.add(ClassList.signInButtonText, ClassList.signInView);
    signInText.innerText = InnerText.signIn;
    const signUpText = document.createElement('span');
    signUpText.classList.add(ClassList.signInButtonText, ClassList.signUpView);
    signUpText.innerText = InnerText.signUp;
    signInBtn.append(signInText, signUpText);

    signInBtn.addEventListener('click', () => this.checkForm());
    return signInBtn;
  }

  private makeForm(): HTMLElement {
    const form = this.makeEmptyForm();
    form.append(
      this.makeTitle(InnerText.signIn, ClassList.signInView),
      this.makeTitle(InnerText.signUp, ClassList.signUpView),
      this.nameInput.draw(ClassList.signUpView),
      this.emailInput.draw(),
      this.firstPasswordInput.draw(ClassList.signPassword),
      this.secondPasswordInput.draw(ClassList.signUpView, ClassList.signPassword),
      this.checkbox,
      this.makeLabel(),
      this.makeLink(InnerText.newAccount, ClassList.signInView),
      this.makeLink(InnerText.iHaveAccount, ClassList.signUpView),
      this.makeButton()
    );
    return form;
  }

  public draw(): void {
    const popup = getExistentElementByClass(ClassList.popup);
    popup.append(this.makeForm());
    setTimeout(() => {
      popup.classList.add(ClassList.popupShow);
    }, 0);
  }
}

export default SignIn;
