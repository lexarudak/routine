import { LoginClassList } from '../../base/enums/classList';
import InnerText from '../../base/enums/innerText';
import PageList from '../../base/enums/pageList';
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
import PlanEditor from '../../components/planEditor';

class LoginPage extends Page {
  status: InnerText.signIn | InnerText.signUp;

  nameInput: NameInput;

  firstPasswordInput: FirstPasswordInput;

  secondPasswordInput: SecondPasswordInput;

  emailInput: EmailInput;

  checkbox: HTMLInputElement;

  layout: LoginLayout;

  signButton: HTMLButtonElement;

  testButton: HTMLButtonElement;

  constructor(goTo: GoToFn, editor: PlanEditor) {
    super(PageList.loginPage, goTo, editor);
    this.layout = new LoginLayout();
    this.status = InnerText.signIn;
    this.nameInput = new NameInput(InnerText.namePlaceholder);
    this.firstPasswordInput = new FirstPasswordInput(InnerText.passwordPlaceholder);
    this.secondPasswordInput = new SecondPasswordInput(InnerText.secondPasswordPlaceholder, this.firstPasswordInput);
    this.emailInput = new EmailInput(InnerText.emailPlaceholder);
    this.signButton = this.setLoginButton(this.layout.makeButton());
    this.testButton = this.setTestButton(this.layout.makeTestButton());
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
    const form = getExistentElementByClass(LoginClassList.signForm);
    form.classList.toggle(LoginClassList.signUp);
    form.classList.toggle(LoginClassList.signIn);
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
          break;
      }
    } else {
      switch (error.message) {
        case ErrorsList.badRequest:
          this.emailInput.showError(ErrorsList.existUser);
          break;
        default:
          break;
      }
    }
  }

  private setLoginButton(signInBtn: HTMLButtonElement) {
    signInBtn.addEventListener('click', async () => {
      if (this.isFormValid()) {
        try {
          buttonOff(this.signButton, this.testButton);
          await this.sendForm();
          this.cleanForm();
          this.status = InnerText.signIn;
          buttonOn(this.signButton, this.testButton);
          this.goTo(RoutsList.homePage);
        } catch (error) {
          buttonOn(this.signButton, this.testButton);
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

  private setTestButton(signInBtn: HTMLButtonElement) {
    signInBtn.addEventListener('click', async () => {
      try {
        buttonOff(this.signButton, this.testButton);
        await Api.login({ email: 'student1@school.rs', password: 'student1', remember: true });
        this.cleanForm();
        this.status = InnerText.signIn;
        buttonOn(this.signButton, this.testButton);
        this.goTo(RoutsList.homePage);
      } catch (error) {
        buttonOn(this.signButton, this.testButton);
        if (error instanceof Error) {
          this.errorHandle(error);
        } else {
          throw error;
        }
      }
    });
    return signInBtn;
  }

  protected async getFilledPage(): Promise<HTMLElement> {
    const form = this.layout.makeEmptyForm();
    form.append(
      this.layout.makeTitle(InnerText.signIn, LoginClassList.signInView),
      this.layout.makeTitle(InnerText.signUp, LoginClassList.signUpView),
      this.nameInput.draw(LoginClassList.signUpView),
      this.emailInput.draw(),
      this.firstPasswordInput.draw(LoginClassList.signPassword),
      this.secondPasswordInput.draw(LoginClassList.signUpView, LoginClassList.signPassword),
      this.checkbox,
      this.layout.makeLabel(),
      this.makeLink(InnerText.newAccount, LoginClassList.signInView),
      this.makeLink(InnerText.iHaveAccount, LoginClassList.signUpView),
      this.signButton,
      this.testButton
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

  private makeLink(text: string, className: string) {
    const span = document.createElement('span');
    span.innerText = text;
    span.addEventListener('click', () => {
      this.toggleStatus();
      this.toggleFormClass();
      this.cleanErrors();
    });
    span.classList.add(LoginClassList.signLink, className);
    return span;
  }
}

export default LoginPage;
