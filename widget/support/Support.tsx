// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import SupportViewModel from "./SupportViewModel";
import { getFocusableElements, getWidgetTheme } from '@dnrr_fd/util/web';
import { getNormalizedLocale } from "@dnrr_fd/util/locale";

// Import Assets
import * as css from './assets/css/support.module.css';

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'

var t9n = t9n_en;

const css_esri = {
  esri_widget: 'esri-widget',
  esri_widget_anchor: 'esri-widget__anchor',
  esri_icon_close: 'esri-icon-close',
  esri_input: 'esri-input',
  esri_button: 'esri-button',
  esri_button_tertiary: 'esri-button--tertiary',
  esri_button_disabled: 'esri-button--disabled',
};

const elementIDs = {
  esriThemeID: "esriThemeID",
  supportID: "supportID",
  supportModalID: "supportModalID",
  supportContentID: "supportContentID",
  supportFormID: "supportFormID",
  supportCloseButtonID: "supportCloseButtonID",
  supportCloseSpanID: "supportCloseSpanID",
  supportNameTextID: "supportNameTextID",
  supportNameErrorSmallID: "supportNameErrorSmallID",
  supportEmailTextID: "supportEmailTextID",
  supportEmailErrorSmallID: "supportEmailErrorSmallID",
  supportPhoneTextID: "supportPhoneTextID",
  supportPhoneErrorSmallID: "supportPhoneErrorSmallID",
  supportMessageTextAreaID: "supportMessageTextAreaID",
  supportMessageErrorSmallID: "supportMessageErrorSmallID",
  supportCancelButtonID: "supportCancelButtonID",
  supportSubmitButtonID: "supportSubmitButtonID"
};

var supportVM = new SupportViewModel();

interface SupportParams extends __esri.WidgetProperties {
  afterCloseFocusElement?: string|HTMLElement;
  serviceURL: string;
  privateKey: string;
}

@subclass("esri.widgets.support")
class Support extends Widget {

  constructor(params?: SupportParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  afterCloseFocusElement!: string|HTMLElement;

  @property()
  serviceURL!: string;

  @property()
  privateKey!: string;

  @property()
  name!: string;

  @property()
  email!: string;

  @property()
  phone!: string;

  @property()
  message!: string;

  @property()
  theme!: 'light'|'dark';


  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------
  postInitialize(): void {
    var _locale = getNormalizedLocale();
    // console.log(`_LOCALE: ${_locale}`);
    if (_locale === "en") {
      t9n = t9n_en;
    } else {
      t9n = t9n_fr;
    }

    var supportWidget = this;
    this.label = t9n.headerText;
    this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme) as 'light'|'dark';
    elementIDs.supportID = this.id;

    intl.onLocaleChange(function(locale) {
      t9n = (locale === 'fr' ? t9n_fr : t9n_en);
    });

    this.watch("visible", async function(visible_new: boolean, visible_old: boolean){
      // console.log(`Support Form Visible: ${visible_new}`);
      // Render now to add or remove the widget then set the element focus.
      supportWidget.renderNow();
      if (visible_new === false) {
        if (supportWidget.afterCloseFocusElement) {
          if (typeof supportWidget.afterCloseFocusElement === "string") {
            getFocusableElements(document.getElementById(supportWidget.afterCloseFocusElement)!);
          } else {
            getFocusableElements(supportWidget.afterCloseFocusElement);
          }
        }
      } else {
        getFocusableElements(document.getElementById(elementIDs.supportContentID)!);
      }
    });
  }

  render() {
    const modal_node = this._createModalNode();

    return (
      <div id={elementIDs.supportID} afterCreate={this.setElementFocus} bind={this}>
        {modal_node}
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //  Private Methods
  //--------------------------------------------------------------------------
  private async setElementFocus () {
    const main_containerNode = document.getElementById(elementIDs.supportContentID) as HTMLDivElement;
    // Add all the elements inside modal which you want to make focusable
    getFocusableElements(main_containerNode);
    // await getFocusableElements(main_containerNode).then(function () {
    //   documentFocusTabEventSetup(main_containerNode);
    // });
  }

  private _submitForm_click(e: MouseEvent) {
    e.preventDefault();
    this._validateForm();
  }

  private _submitForm_keypress(e: KeyboardEvent) {
    let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      e.preventDefault();  // Prevent the default keypress action, i.e. space = scroll
      this._validateForm();
    }
  }

  private _closeButton_click (e: MouseEvent) {
    e.preventDefault();
    this._closeForm();
  }
  
  private _closeButton_keypress(e: KeyboardEvent) {
    let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      e.preventDefault();
      this._closeForm();
    }
  }

  private _cancelButton_click(e: MouseEvent) {
    e.preventDefault();
    this._closeForm();
  }

  private _cancelButton__keypress(e: KeyboardEvent) {
    let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      e.preventDefault();
      this._closeForm();
    }
  }

  private _closeForm() {
    var messageNode = document.getElementById(elementIDs.supportMessageTextAreaID) as HTMLTextAreaElement;
    messageNode.value = "";
    this.visible = false;
    // this.destroy();
  }

  private _validateForm() {
    var succeeded = true as boolean;
    var nameNode = document.getElementById(elementIDs.supportNameTextID) as HTMLInputElement;
    var nameErrorNode = document.getElementById(elementIDs.supportNameErrorSmallID) as HTMLElement;
    var emailNode = document.getElementById(elementIDs.supportEmailTextID) as HTMLInputElement;
    var emailErrorNode = document.getElementById(elementIDs.supportEmailErrorSmallID) as HTMLElement;
    var phoneNode = document.getElementById(elementIDs.supportPhoneTextID) as HTMLInputElement;
    var phoneErrorNode = document.getElementById(elementIDs.supportPhoneErrorSmallID) as HTMLElement;
    var messageNode = document.getElementById(elementIDs.supportMessageTextAreaID) as HTMLTextAreaElement;
    var messageErrorNode = document.getElementById(elementIDs.supportMessageErrorSmallID) as HTMLElement;
    
    if ((!this.serviceURL || this.serviceURL === "") || (!this.privateKey || this.privateKey === "")) {
      var error = "The serviceURL and/or privateKey is not configured!";
      window.alert(error);
    }
    supportVM.serviceURL = this.serviceURL;
    supportVM.privateKey = this.privateKey;

    // Name Validation
    var nameRegex=new RegExp(/^[\p{L}'][ \p{L}'-]*[\p{L}]$/u);
    var nameResult = this._validateInput(nameNode, nameErrorNode, nameRegex, t9n.userNameError_error, t9n.userNameError_empty);
    if (nameResult.success === false){
      succeeded = false;
    }

    // Phone Validation
    var phoneRegex = new RegExp(/^(1-?)?[0-9]{3}([-]?)[0-9]{3}([-]?)[0-9]{4}$/gm)
    var phoneResult = this._validateInput(phoneNode, phoneErrorNode, phoneRegex, t9n.userPhoneError_error, t9n.userPhoneError_empty);
    if (phoneResult.success === false){
      succeeded = false;
    }

    // Email Validation
    var emailRegex = new RegExp(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/)
    var emailResult = this._validateInput(emailNode, emailErrorNode, emailRegex, t9n.userEmailError_error, t9n.userEmailError_empty);
    if (emailResult.success === false){
      succeeded = false;
    }

    // Message Validation
    var messageResult = this._validateInput(messageNode, messageErrorNode, null, t9n.userMessageError_error, t9n.userMessageError_empty);
    if (messageResult.success === false){
      succeeded = false;
    }

    if (succeeded === true) {
      supportVM.formData = {
        ContactName: nameResult.value,
        EmailAddress: emailResult.value,
        PhoneNumber: phoneResult.value,
        Comment: messageResult.value
      };
      
      if (supportVM._submitForm() === true) {
        messageNode.value = "";
        this.visible = false;
        // this.destroy();
      }
    }
  }

  private _validateInput(inputElement: HTMLInputElement|HTMLTextAreaElement, messageElement: HTMLElement, inputRegEX: RegExp|null, errorMessage: string, emptyMessage: string) {
    var inputValue = inputElement.value.trim() as string|null;

    if (inputElement.required === false && inputValue === "") {
      this._setElementMessage(inputElement, messageElement);

      return {
        success: true,
        value: null
      };
    }
    
    if (inputElement.required === true && inputValue === "") {
      this._setElementMessage(inputElement, messageElement, emptyMessage, true);
      return {
        success: false,
        value: null
      };
    }
    
    if (inputRegEX && inputRegEX.test(inputValue!) === false) {
      this._setElementMessage(inputElement, messageElement, errorMessage, true);

      return {
        success: false,
        value: null
      };
    } else {
      this._setElementMessage(inputElement, messageElement);

      return {
        success: true,
        value: inputValue
      };
    }
  }

  private _setElementMessage(inputElement: HTMLInputElement|HTMLTextAreaElement, messageElement: HTMLElement, message="" as string, isError=false as boolean, errorClass=css.default.widget_support_form_input__error as string) {
    messageElement.innerHTML = message;
    if (isError === true) {
      inputElement.classList.add(errorClass);
      messageElement.classList.add(errorClass);
    } else {
      inputElement.classList.remove(errorClass);
      messageElement.classList.remove(errorClass);
    }
    inputElement.setAttribute("aria-invalid", isError.toString());
  }

  private _createModalNode(): tsx.JSX.Element {
    return(
      <div class={css.default.widget_support}>
        <div id={elementIDs.supportModalID} class={this.classes(css.default.widget_support_modal)}>
          <div id={elementIDs.supportContentID} class={this.classes(css_esri.esri_widget, css.default.widget_support_content)}>
            <div class={css.default.widget_support_header}>
              <div class={css.default.widget_support_header__div}>
                <div class={css.default.widget_support_header_close__div}>
                  <button id={elementIDs.supportCloseButtonID} type="button" class={this.classes(css_esri.esri_button_tertiary, css.default.widget_support_header_close__button)} ariaLabel={t9n.closeButtonText} title={t9n.closeButtonText} onclick={this._closeButton_click.bind(this)} onkeypress={this._closeButton_keypress.bind(this)} tabindex="0">
                    <span id={elementIDs.supportCloseSpanID} aria-hidden='true' class={css_esri.esri_icon_close} />
                  </button>
                </div>
                <div class={css.default.widget_support_header_heading__div}>
                  <h1 role='heading' ariaLevel='1'>
                    {t9n.headerText}
                  </h1>
                </div>
              </div>
            </div>
            <div id={elementIDs.supportFormID} class={css.default.widget_support_form__div}>
              <div class={this.classes(css.default.widget_support_form_name__div, css.default.widget_support_display__table)}>
                <div class={css.default.widget_support_display__table_row}>
                  <div class={css.default.widget_support_display__table_cell}>
                    <label for={elementIDs.supportNameTextID} class={css.default.widget_support_form__label}>{t9n.userNameLabel}</label>
                  </div>
                  <div class={css.default.widget_support_display__table_cell}>
                    <input id={elementIDs.supportNameTextID} name={elementIDs.supportNameTextID} class={css_esri.esri_input} type='text' required aria-describedBy={elementIDs.supportNameErrorSmallID} alt={t9n.userNameLabel_alt} title={t9n.userNameLabel_alt} tabindex="0"></input>
                    <small id={elementIDs.supportNameErrorSmallID} class={css.default.widget_support_display__block}></small>
                  </div>
                </div>
                <div class={css.default.widget_support_display__table_row}>
                  <div class={css.default.widget_support_display__table_cell}>
                    <label for={elementIDs.supportEmailTextID} class={css.default.widget_support_form__label}>{t9n.userEmailLabel}</label>
                  </div>
                  <div class={css.default.widget_support_display__table_cell}>
                    <input id={elementIDs.supportEmailTextID} name={elementIDs.supportEmailTextID} class={css_esri.esri_input} type='text' required aria-describedBy={elementIDs.supportEmailErrorSmallID}alt={t9n.userEmailLabel_alt} title={t9n.userEmailLabel_alt} tabindex="0"></input>
                    <small id={elementIDs.supportEmailErrorSmallID} class={css.default.widget_support_display__block}></small>
                  </div>
                </div>
                <div class={css.default.widget_support_display__table_row}>
                  <div class={css.default.widget_support_display__table_cell}>
                    <label for={elementIDs.supportPhoneTextID} class={css.default.widget_support_form__label}>{t9n.userPhoneLabel}</label>
                  </div>
                  <div class={css.default.widget_support_display__table_cell}>
                    <input id={elementIDs.supportPhoneTextID} name={elementIDs.supportPhoneTextID} class={css_esri.esri_input} type='text' aria-describedBy={elementIDs.supportPhoneErrorSmallID} placeholder={t9n.optionalText} alt={t9n.userPhoneLabel_alt} title={t9n.userPhoneLabel_alt} tabindex="0"></input>
                    <small id={elementIDs.supportPhoneErrorSmallID} class={css.default.widget_support_display__block}></small>
                  </div>
                </div>
                <div class={css.default.widget_support_display__table_row}>
                  <div class={css.default.widget_support_display__table_cell}>
                    <label for={elementIDs.supportMessageTextAreaID} class={css.default.widget_support_form_textarea__label}>{t9n.userMessageLabel}</label>
                  </div>
                  <div class={css.default.widget_support_display__table_cell}>
                    <textarea id={elementIDs.supportMessageTextAreaID} name={elementIDs.supportMessageTextAreaID} class={this.classes(css_esri.esri_input, css.default.widget_support_form_textarea)} required aria-describedBy={elementIDs.supportMessageErrorSmallID} placeholder={t9n.userMessagePlaceholder} alt={t9n.userMessagePlaceholder} title={t9n.userMessagePlaceholder} tabindex="0"></textarea>
                    <small id={elementIDs.supportMessageErrorSmallID} class={css.default.widget_support_display__block}></small>
                  </div>
                </div>
              </div>
              <div class={css.default.widget_support_form_message__div}>
                <p>{t9n.disclaimerText}</p>
              </div>
              <div class={css.default.widget_support_buttons}>
                <div class={css.default.widget_support_buttons__div}>
                  <div class={css.default.widget_support_buttons_submit__div}>
                    <button id={elementIDs.supportSubmitButtonID} type="button" class={css_esri.esri_button} aria-label={t9n.submitButtonText} title={t9n.submitButtonText} onclick={this._submitForm_click.bind(this)} onkeypress={this._submitForm_keypress.bind(this)} tabindex="0">
                      {t9n.submitButtonText}
                    </button>
                  </div>
                  <div class={css.default.widget_support_buttons_cancel__div}>
                    <button id={elementIDs.supportCancelButtonID} type="button" class={css_esri.esri_button} aria-label={t9n.cancelButtonText} title={t9n.cancelButtonText} onclick={this._cancelButton_click.bind(this)} onkeypress={this._cancelButton__keypress.bind(this)} tabindex="0">
                      {t9n.cancelButtonText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Support;