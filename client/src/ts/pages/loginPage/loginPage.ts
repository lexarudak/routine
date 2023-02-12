import { ClassList } from '../../base/enums/classList';
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
import Api from '../../api';
import ErrorsList from '../../base/enums/errorsList';

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
    const name = this.nameInput.input.value;
    const email = this.emailInput.input.value;
    const password = this.firstPasswordInput.input.value;
    const remember = this.checkbox.checked;
    return this.status === InnerText.signIn
      ? Api.login({ email, password, remember })
      : Api.registration({ name, email, password });
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

  private errorHandle(error: Error) {
    if (this.status === InnerText.signIn) {
      switch (error.message) {
        case ErrorsList.notFound:
          this.emailInput.showError(ErrorsList.noUser);
          break;
        case ErrorsList.badRequest:
          this.firstPasswordInput.showError(ErrorsList.wrongPass);
          break;
        default:
          console.log(error.message);
          break;
      }
    } else {
      switch (error.message) {
        case ErrorsList.badRequest:
          this.emailInput.showError(ErrorsList.existUser);
          break;
        default:
          console.log(error.message);
          break;
      }
    }
  }

  private setLoginButton(signInBtn: HTMLButtonElement) {
    signInBtn.addEventListener('click', async () => {
      if (this.isFormValid()) {
        try {
          buttonOff(this.signButton);
          const resp = await this.sendForm();
          console.log(resp);
          this.cleanForm();
          this.status = InnerText.signIn;
          buttonOn(this.signButton);
          this.goTo(RoutsList.homePage);
        } catch (error) {
          buttonOn(this.signButton);
          if (error instanceof Error) {
            this.errorHandle(error);
          } else {
            throw error;
          }
        }
      }
    });
    return signInBtn;
  }

  protected async getFilledPage(): Promise<HTMLElement> {
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

  private cleanErrors() {
    this.nameInput.hideError();
    this.emailInput.hideError();
    this.firstPasswordInput.hideError();
    this.secondPasswordInput.hideError();
  }

  private makeLink(text: string, className: ClassList) {
    const span = document.createElement('span');
    span.innerText = text;
    span.addEventListener('click', () => {
      this.toggleStatus();
      this.toggleFormClass();
      this.cleanErrors();
    });
    span.classList.add(ClassList.signLink, className);
    return span;
  }
}

export default LoginPage;
