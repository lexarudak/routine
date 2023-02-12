import ButtonClasses from '../../../base/enums/buttonClasses';
import { ClassList } from '../../../base/enums/classList';
import InnerText from '../../../base/enums/innerText';
import Values from '../../../base/enums/values';

class LoginLayout {
  public makeEmptyForm(): HTMLElement {
    const form = document.createElement('div');
    form.classList.add(ClassList.signForm, ClassList.signIn);
    return form;
  }

  public makeTitle(text: InnerText, className: ClassList) {
    const title = document.createElement('h1');
    title.classList.add(ClassList.signTitle, className);
    title.innerHTML = text;
    return title;
  }

  public makeButton() {
    const signInBtn = document.createElement('button');
    signInBtn.classList.add(ButtonClasses.button, ButtonClasses.signIn, ClassList.signInButton);
    const signInText = document.createElement('span');
    signInText.classList.add(ClassList.signInButtonText, ClassList.signInView);
    signInText.innerText = InnerText.signIn;
    const signUpText = document.createElement('span');
    signUpText.classList.add(ClassList.signInButtonText, ClassList.signUpView);
    signUpText.innerText = InnerText.signUp;
    signInBtn.append(signInText, signUpText);
    return signInBtn;
  }

  public makeCheckbox() {
    const checkBox = document.createElement('input');
    checkBox.type = 'checkbox';
    checkBox.id = Values.rememberMeId;
    return checkBox;
  }

  public makeLabel() {
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
}

export default LoginLayout;
