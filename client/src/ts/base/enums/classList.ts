const enum BaseClassList {
  banner = 'banner',
  imgContainer = 'img-container',
  scaleNormal = 'scale-normal',
  title = 'title',
  subtitle = 'subtitle',
  section = 'section',
  canvas = 'canvas',
  chart = 'chart',
  none = 'none',
  open = 'open',
  blur = 'blur',
  show = 'show',
  popup = 'popup',
  popupShow = 'popup_show',
  sliderPopup = 'slider-popup',
}

const enum MainClassList {
  mainContainer = 'main__container',
  mainContainerHide = 'main__container_hide',
  mainContainerNoSelect = 'main__container_no-select',
}

const enum HeaderClassList {
  header = 'header',
  headerLogo = 'header__logo',
  headerName = 'header__name',
  headerInfo = 'header__info',
  nav = 'nav',
  navButton = 'nav__button',
  navButtonActive = 'nav__button_active',
}

const enum NotFoundPageClassList {
  page404 = 'page-404',
  page404text = 'page-404__text',
  page404title = 'page-404__title',
}

const enum LoginClassList {
  signForm = 'sign-form',
  signIn = 'sign-form_sign-in',
  signUp = 'sign-form_sign-up',
  signTitle = 'sign-form__title',
  signInput = 'sign-form__input',
  signInputBox = 'sign-form__input-box',
  signLabel = 'sign-form__label',
  signLabelText = 'sign-form__label-text',
  signPassword = 'sign-password',
  bigO = 'sign-form__big-o',
  smallO = 'sign-form__small-o',
  signLink = 'sign-form__link',
  signInButton = 'sign-form__button',
  signInButtonText = 'sign-form__button-text',
  signInView = 'sign-in-view',
  signUpView = 'sign-up-view',
  inputError = 'sign-form__input-error',
  inputErrorActive = 'sign-form__input-error_active',
}

const enum WeekPageClassList {
  planContainer = 'plan',
  weekLine = 'plan__week-line',
  infoTextContainer = 'plan__text-container',
  infoTextValue = 'plan__text-value',
  planBody = 'plan__body',
  planName = 'plan__name',
  planLeftColumn = 'plan__left-column',
  planButtons = 'plan__buttons',
  planAddButton = 'plan__button-add',
  planAddButtonDarg = 'plan__button-add_drag',
  planAddButtonValue = 'plan__button-add-value',
  planRemoveZone = 'plan__remove',
  planRemoveZoneDrag = 'plan__remove_drag',
  planRemoveZoneOver = 'plan__remove_over',
  planDaysContainer = 'plan__days',
  planDaysContainerDrag = 'plan__days_drag',
  planDay = 'plan__day',
  planDayOver = 'plan__day_over',
  planDayLine = 'plan__day-line',
  planDayName = 'plan__day-name',
  planDayHours = 'plan__day-hours',
  planField = 'plan__field',
  planAddButtonName = 'plan__button-add-name',
  weekFields = 'week-fields',
  weekFieldsBig = 'week-fields__big',
  weekFieldsSmall = 'week-fields__small',
}

const enum PlanRoundClassList {
  planRound = 'plan-round',
  planRoundBlur = 'plan-round__blur',
  planRoundVal = 'plan-round__value',
  planRoundDrag = 'plan-round_drag',
}

const enum EditorClassList {
  editor = 'editor',
  editorTools = 'editor__tools',
  editorTitle = 'editor__title',
  editorText = 'editor__text',
  editorButton = 'editor__button',
  editorColorPicker = 'editor__color-picker',
  editorColorBox = 'editor__color-box',
  editorColorBoxActive = 'editor__color-box_active',
  editorColorRound = 'editor__color-round',
  editorSaveIcon = 'editor__save-icon',
}

const enum TimeContainerClassList {
  timeContainer = 'time-container',
  timeContainerSlider = 'time-container__slider',
  timeContainerTimeInput = 'time-container__time-input',
  timeContainerTimeLabel = 'time-container__time-label',
  timeContainerPer = 'time-container__per',
  timeContainerPerVal = 'time-container__per-val',
}

const enum DayPageClassList {
  dayPageContainer = 'day-page__container',
  dayPageNavButtons = 'day-page__nav-buttons',
  dayPageBody = 'day-page__body',
  dayPageInfo = 'day-page__info',
  dayPageName = 'day-page__name',
  dayPageField = 'day-page__field',
  dayPageTools = 'day-page__tools',
  dayPageReturn = 'day-page__return',
  dayPageReturnOver = 'day-page__return_over',
  dayPagePlansZone = 'day-page__plans-zone',
  dayPagePlansZoneDrag = 'day-page__plans-zone_drag',
  planList = 'plan-list',
  planListItem = 'plan-list__item',
  planListColor = 'plan-list__color',
  planListName = 'plan-list__name',
  planListDur = 'plan-list__dur',
}

const enum TimelineClassList {
  timeline = 'timeline',
  timelineDrag = 'timeline_drag',
  timelineHeader = 'timeline-header',
  timelineDiv = 'timeline-div',
  timelineDivActive = 'timeline-div_active',
  timelineShow = 'timeline__show',
  timelineSensor = 'timeline__sensor',
  timelineSensorActive = 'timeline__sensor_active',
  timelineDivFake = 'timeline-div_fake',
  timelineDivHide = 'timeline-div_hide',
  timelineDivFrom = 'timeline-div__from',
  timelineDivTo = 'timeline-div__to',
  timelineDivLeft = 'timeline-div__left',
  timelineDivRight = 'timeline-div__right',
  timelineDivName = 'timeline-div__name',
  timelineDivBody = 'timeline-div__body',
}

const enum ThoughtsClassList {
  thought = 'thought',
  thoughtTitle = 'thought__title',
  thoughtContainer = 'thought__container',
  thoughtAdd = 'thought__add',
  thoughtAddHold = 'thought__add_hold',
  thoughtItem = 'thought__item',
  thoughtAddBtn = 'thought__add-btn',
  thoughtCreateBtn = 'thought__create-btn',
  thoughtRemoveBtn = 'thought__remove-btn',
  thoughtInput = 'thought__input',
}

const enum HomePageClassList {
  plan = 'plan-btn',
  profile = 'profile-btn',
  confirmDay = 'confirm-day',
  toDo = 'to-do',
  toDoWrap = 'to-do__wrapper',
  toDoTitle = 'to-do__title',
  toDoTextarea = 'to-do__textarea',
  toDoText = 'to-do__text',
  clock = 'clock',
  hour = 'hour',
  hourCircle = 'hour__circle',
  minutes = 'minutes',
  minutesCircle = 'minutes__circle',
  dayInfo = 'day-info',
  dayIcon = 'day-info__icon',
  daySvg = 'day-info__svg',
  timeOfDay = 'time-of-day',
}

const enum ProfilePageClassList {
  profile = 'profile',
  profileWrapper = 'profile-wrapper',
  button = 'button',
  settingsConfirmDay = 'settings__confirm-day',
  settingsConfirmTime = 'settings__confirm-time',
  settingsLogOut = 'settings__log-out',
  settingsLabel = 'settings__label',
  settingsInput = 'settings__input',
  settingsButton = 'settings__button',
  settingsButtonCapitalized = 'settings__button_capitalized',
  userData = 'user-data',
  statistics = 'statistics',
  greeting = 'greeting',
  greetingHello = 'greeting__hello',
  greetingUserName = 'greeting__user-name',
  greetingInfo = 'greeting__info',
  statisticsTank = 'statistics-tank',
  statisticsTankName = 'statistics-tank__name',
  statisticsTankContent = 'statistics-tank__content',
  planSquare = 'plan-square',
  planSquareName = 'plan-square__name',
  planSquareDeviation = 'plan-square__deviation',
}

const enum ConfirmPageClassList {
  confirm = 'confirm',
  confirmWrapper = 'confirm-wrapper',
}

const enum ButtonClassList {
  button = 'button',
  main = 'button_main',
  signIn = 'button_signIn',
  navButton = 'nav-button',
  navButtonActive = 'nav-button_active',
  saveButton = 'save-button',
}

export {
  BaseClassList,
  HomePageClassList,
  ProfilePageClassList,
  ConfirmPageClassList,
  ButtonClassList,
  MainClassList,
  HeaderClassList,
  NotFoundPageClassList,
  LoginClassList,
  WeekPageClassList,
  PlanRoundClassList,
  TimeContainerClassList,
  DayPageClassList,
  TimelineClassList,
  EditorClassList,
  ThoughtsClassList,
};
