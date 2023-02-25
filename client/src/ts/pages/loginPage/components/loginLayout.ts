import { ButtonClassList, LoginClassList } from '../../../base/enums/classList';
import InnerText from '../../../base/enums/innerText';

class LoginLayout {
  public makeEmptyForm(): HTMLElement {
    const form = document.createElement('div');
    form.classList.add(LoginClassList.signForm, LoginClassList.signIn);
    return form;
  }

  public makeTitle(text: InnerText, className: string) {
    const title = document.createElement('h1');
    title.classList.add(LoginClassList.signTitle, className);
    title.innerHTML = text;
    return title;
  }

  public makeButton() {
    const signInBtn = document.createElement('button');
    signInBtn.classList.add(ButtonClassList.button, ButtonClassList.signIn, LoginClassList.signInButton);
    const signInText = document.createElement('span');
    signInText.classList.add(LoginClassList.signInButtonText, LoginClassList.signInView);
    signInText.innerText = InnerText.signIn;
    const signUpText = document.createElement('span');
    signUpText.classList.add(LoginClassList.signInButtonText, LoginClassList.signUpView);
    signUpText.innerText = InnerText.signUp;
    signInBtn.append(signInText, signUpText);
    return signInBtn;
  }

  public makeCheckbox() {
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = InnerText.rememberMeId;
    checkBox.checked = true;
    return checkBox;
  }

  public makeLabel() {
    const label = document.createElement('label');
    label.setAttribute('for', InnerText.rememberMeId);
    label.classList.add(LoginClassList.signLabel, LoginClassList.signInView);
    const bigO = document.createElement('div');
    bigO.classList.add(LoginClassList.bigO);
    const smallO = document.createElement('div');
    smallO.classList.add(LoginClassList.smallO);
    bigO.append(smallO);
    const text = document.createElement('span');
    text.innerHTML = InnerText.rememberMe;
    label.append(bigO, text);
    return label;
  }
}

export default LoginLayout;
