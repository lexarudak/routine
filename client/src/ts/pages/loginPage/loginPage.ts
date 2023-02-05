import ClassList from '../../base/enums/classList';
import InnerText from '../../base/enums/innerText';
import PageList from '../../base/enums/pageList';
import Values from '../../base/enums/values';
import { buttonOff, buttonOn, getExistentElementByClass } from '../../base/helpers';
import { GoToFn } from '../../base/types';
import EmailInput from './components/emailInput';
import Page from '../page';
import NameInput from './components/nameInput';
import FirstPasswordInput from './components/firstPasswordInput';
import SecondPasswordInput from './components/secondPasswordInput';
import RoutsList from '../../base/enums/routsList';
import LoginLayout from './components/loginLayout';

class LoginPage extends Page {
  status: InnerText.signIn | InnerText.signUp;

  nameInput: NameInput;

  firstPasswordInput: FirstPasswordInput;

  secondPasswordInput: SecondPasswordInput;

  emailInput: EmailInput;

  checkbox: HTMLInputElement;

  layout: LoginLayout;

  signButton: HTMLButtonElement;

  constructor(goTo: GoToFn) {
    super(PageList.loginPage, goTo);
    this.layout = new LoginLayout();
    this.status = InnerText.signIn;
    this.nameInput = new NameInput(Values.namePlaceholder);
    this.firstPasswordInput = new FirstPasswordInput(Values.passwordPlaceholder);
    this.secondPasswordInput = new SecondPasswordInput(Values.secondPasswordPlaceholder, this.firstPasswordInput);
    this.emailInput = new EmailInput(Values.emailPlaceholder);
    this.signButton = this.setLoginButton(this.layout.makeButton());
    this.checkbox = this.layout.makeCheckbox();
  }

  private isFormValid() {
    const email = this.emailInput.blurCheck();
    const password = this.firstPasswordInput.blurCheck();
    if (this.status === InnerText.signIn) return email && password;
    const name = this.nameInput.blurCheck();
    const password2 = this.secondPasswordInput.blurCheck();
    return email && password && name && password2;
  }

  private async sendForm() {
    return this.status === InnerText.signIn ? this.sendSignInForm() : this.sendSignUpForm();
  }

  private async sendSignInForm() {
    console.log('Email:', this.emailInput.input.value);
    console.log('Pass:', this.firstPasswordInput.input.value);
    console.log('Remember:', this.checkbox.checked); // данные для отправки

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('server Sign in resolve');
      }, 2000); // отправляем запрос на сервер и возвращаем ответ
    });
  }

  private async sendSignUpForm() {
    console.log('Name:', this.nameInput.input.value);
    console.log('Email:', this.emailInput.input.value);
    console.log('Pass:', this.firstPasswordInput.input.value); // данные для отправки

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve('server Sign Up resolve');
      }, 2000); // отправляем запрос на сервер и возвращаем ответ
    });
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

  private setLoginButton(signInBtn: HTMLButtonElement) {
    signInBtn.addEventListener('click', async () => {
      if (this.isFormValid()) {
        try {
          buttonOff(this.signButton);
          const res = await this.sendForm();
          console.log(res); // обрабатыаем положительный ответ
          this.cleanForm();
          this.status = InnerText.signIn;
          buttonOn(this.signButton);
          this.goTo(RoutsList.homePage);
        } catch {
          // обрабатываем ошибку
        }
      }
    });
    return signInBtn;
  }

  protected getFilledPage(): HTMLElement {
    const form = this.layout.makeEmptyForm();
    form.append(
      this.layout.makeTitle(InnerText.signIn, ClassList.signInView),
      this.layout.makeTitle(InnerText.signUp, ClassList.signUpView),
      this.nameInput.draw(ClassList.signUpView),
      this.emailInput.draw(),
      this.firstPasswordInput.draw(ClassList.signPassword),
      this.secondPasswordInput.draw(ClassList.signUpView, ClassList.signPassword),
      this.checkbox,
      this.layout.makeLabel(),
      this.makeLink(InnerText.newAccount, ClassList.signInView),
      this.makeLink(InnerText.iHaveAccount, ClassList.signUpView),
      this.signButton
    );
    return form;
  }

  private cleanForm() {
    this.nameInput.input.value = '';
    this.emailInput.input.value = '';
    this.firstPasswordInput.input.value = '';
    this.secondPasswordInput.input.value = '';
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
}

export default LoginPage;
