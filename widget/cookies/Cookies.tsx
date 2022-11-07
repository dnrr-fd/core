// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { getNormalizedLocale } from "@dnrr_fd/util/locale";

import { getWidgetTheme, ariaDisable, getFocusableElements } from '@dnrr_fd/util/web'
import { Cookie, CookiesVM } from '../class/_Cookie';

// Import Assets
import * as css from './assets/css/cookies.module.css'

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'

var t9n = t9n_en;

const css_esri = {
  esri_widget: 'esri-widget',
  esri_widget_anchor: 'esri-widget__anchor',
  esri_icon_close: 'esri-icon-close',
  esri_button: 'esri-button',
  esri_button_tertiary: 'esri-button--tertiary',
  esri_button_disabled: 'esri-button--disabled',
};

const elementIDs = {
  esriThemeID: "esriThemeID",

  // Main Elements
  cookiesMain_modalID: "cookiesMain_modalID",
  cookiesMain_contentID: "cookiesMain_contentID",
  cookiesMain_closeButtonID: "cookiesMain_closeButtonID",
  cookiesMain_closeSpanID: "cookiesMain_closeSpanID",
  cookiesMain_manageButtonID: "cookiesMain_manageButtonID",
  cookiesMain_acceptAllButtonID: "cookiesMain_acceptAllButtonID",
  cookiesMain_rejectAllButtonID: "cookiesMain_rejectAllButtonID",

  // Settings Elements
  cookiesSettings_modalID: "settings_modalID",
  cookiesSettings_contentID: "settings_contentID",
  cookiesSettings_closeButtonID: "settings_closeButtonID",
  cookiesSettings_closeSpanID: "settings_closeSpanID",
  cookiesSettings_privacyPolicyButtonID: "settings_privacyPolicyButtonID",
  cookiesSettings_privacyPolicyTextID: "settings_privacyPolicyTextID",
  cookiesSettings_contactUsButtonID: "settings_contactUsButtonID",
  cookiesSettings_contactUsTextID: "settings_contactUsTextID",
  cookiesSettings_acceptAllButtonID: "settings_acceptAllButtonID",
  cookiesSettings_rejectAllButtonID: "settings_rejectAllButtonID",
  cookiesSettings_saveButtonID: "settings_saveButtonID",
  cookiesSettings_switchPostfixID: "_switchID"
};

var switches: tsx.JSX.Element;

interface CookiesParams extends __esri.WidgetProperties {
  afterHideFocusElement?: string|HTMLElement;

  position?: "bottom"|"top";

  cookies?: Array<Cookie>;

  privacyPolicy?: {
    type: "url",
    value: string
  };

  contactUs?: {
    type: "url"|"email",
    value: string
  };

}

@subclass("dnrr.forestry.widgets.cookies")
class Cookies extends Widget {

  constructor(params?: CookiesParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  afterHideFocusElement!: string|HTMLElement;

  @property()
  position: "bottom"|"top" = 'bottom';

  @property()
  cookies!: Array<Cookie>;

  @property()
  privacyPolicy!: {
    type: "url",
    value: string
  };

  @property()
  contactUs!: {
    type: "url"|"email",
    value: string
  };

  @property()
  cookiesVM!: Array<CookiesVM>;

  @property()
  theme!: 'light'|'dark';

  @property()
  acceptionchange!: boolean;

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------
  async postInitialize(): Promise<void> {
    var self = this;
    var _locale = getNormalizedLocale();
    // console.log(`_LOCALE: ${_locale}`);
    if (_locale === "en") {
      t9n = t9n_en;
    } else {
      t9n = t9n_fr;
    }

    this.label = t9n.title;
    this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme) as 'light'|'dark';
    this.acceptionchange = false;

    intl.onLocaleChange(function(locale) {
      t9n = (locale === 'fr' ? t9n_fr : t9n_en);
    });

    try {
      // Create and set/retreive the cookies
      if (!this.cookiesVM) {
        await this.initCookies();
      }
    } catch (error) {
      console.error(`Error initializing cookies widget: ${error}`);
      throw 'Killing Cookies Widget.';
    }

    // Dynamically create switches for the cookies.
    switches = this.cookiesVM.map(cookie =>
      <div key={`${cookie.id}_key`} class={css.default.widget_cookies_all_switch__holder}>
        <div class={css.default.widget_cookies_all_switch__label}>
          <span>{cookie.label}</span>
        </div>
        <div class={css.default.widget_cookies_all_switch__toggle}>
          <input type='checkbox' checked={cookie.accepted} name={cookie.id} value={cookie.id} id={cookie.id + elementIDs.cookiesSettings_switchPostfixID} onchange={this._switchToggle_change.bind(this, `${cookie.id}${elementIDs.cookiesSettings_switchPostfixID}`)}/>
          <label for={cookie.id + elementIDs.cookiesSettings_switchPostfixID} aria-label={cookie.label} title={cookie.label}></label>
        </div>
      </div>
    );

  }

  render() {
    // Set the main cookies dialog position
    var cookiesMain_content_position: string;
    if (this.position === 'top') {
      cookiesMain_content_position = css.default.widget_cookies_main_content__top;
    } else {
      cookiesMain_content_position = css.default.widget_cookies_main_content__bottom;
    }


    return (
      <div afterCreate={this.setElementFocus} bind={this} class={this.classes(css.default.widget_cookies_all)}>
        {/* Main Dialog */}
        <div id={elementIDs.cookiesMain_modalID} class={this.classes(css.default.widget_cookies_main_modal)}>
          <div id={elementIDs.cookiesMain_contentID} class={this.classes(css_esri.esri_widget, cookiesMain_content_position, css.default.widget_cookies_main_content, css.default.widget_cookies_all_transition)}>
            <div class={css.default.widget_cookies_all_header}>
              <div class={css.default.widget_cookies_all_header__div}>
                <div class={css.default.widget_cookies_all_header_close__div}>
                  <button id={elementIDs.cookiesMain_closeButtonID} type="button" class={this.classes(css_esri.esri_button_tertiary, css.default.widget_cookies_all_header_close__button)} ariaLabel={t9n.closeButtonLabel_mainDialog} title={t9n.closeButtonLabel_mainDialog} onclick={this._main_closeButton_click.bind(this)} tabindex="0">
                    <span id={elementIDs.cookiesMain_closeSpanID} aria-hidden='true' class={css_esri.esri_icon_close} />
                  </button>
                </div>
                <div class={css.default.widget_cookies_all_header_heading__div}>
                  <h1 role='heading' ariaLevel='1'>{t9n.title_mainDialog}</h1>
                </div>
              </div>
            </div>
            <div class={css.default.widget_cookies_main_subcontent__div}>
              <div class={css.default.widget_cookies_all_content_message__div}>
                <p>
                  {t9n.message_mainDialog}
                  <button id={elementIDs.cookiesMain_manageButtonID} type="button" class={this.classes(css_esri.esri_widget_anchor, css.default.widget_cookies_all_links__button)} aria-label={t9n.manageButtonText_mainDialog} title={t9n.manageButtonText_mainDialog} onclick={this._main_manageButton_click.bind(this)} tabindex="0">
                    {t9n.manageButtonText_mainDialog}
                  </button>
                </p>
              </div>
              <div class={css.default.widget_cookies_main_buttons__div}>
                <button id={elementIDs.cookiesMain_acceptAllButtonID} type="button" class={this.classes(css_esri.esri_button, css.default.widget_cookies_main_buttons_accept__button)} aria-label={t9n.agreeButtonText_allDialogs} title={t9n.agreeButtonText_allDialogs} onclick={this._acceptAllButton_click.bind(this)} tabindex="0">
                  {t9n.agreeButtonText_allDialogs}
                </button>
                <button id={elementIDs.cookiesMain_rejectAllButtonID} type="button" class={css_esri.esri_button} aria-label={t9n.rejectButtonText_allDialogs} title={t9n.rejectButtonText_allDialogs} onclick={this._rejectAllButton_click.bind(this)} tabindex="0">
                  {t9n.rejectButtonText_allDialogs}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Dialog */}
        <div id={elementIDs.cookiesSettings_modalID} class={this.classes(css.default.widget_cookies_settings_modal, css.default.widget_cookies_all_visible__none)}>
          <div id={elementIDs.cookiesSettings_contentID} class={this.classes(css_esri.esri_widget, css.default.widget_cookies_settings_content, css.default.widget_cookies_settings_content)}>
            <div class={css.default.widget_cookies_all_header}>
              <div class={css.default.widget_cookies_all_header__div}>
                <div class={css.default.widget_cookies_all_header_close__div}>
                  <button id={elementIDs.cookiesSettings_closeButtonID} type="button" class={this.classes(css_esri.esri_button_tertiary, css.default.widget_cookies_all_header_close__button)} ariaLabel={t9n.closeButtonLabel_settingsDialog} title={t9n.closeButtonLabel_settingsDialog} onclick={this._settings_closeButton_click.bind(this)} tabindex="0">
                    <span id={elementIDs.cookiesSettings_closeSpanID} aria-hidden='true' class={css_esri.esri_icon_close} />
                  </button>
                </div>
                <div class={css.default.widget_cookies_all_header_heading__div}>
                  <h1 role='heading' ariaLevel='1'>
                    {t9n.header_settingsDialog}
                  </h1>
                </div>
              </div>
            </div>
            <div class={css.default.widget_cookies_settings_subcontent}>
              <div class={css.default.widget_cookies_settings_content__div}>
                <div class={css.default.widget_cookies_settings_subcontent_title}>
                  <h2 role='heading' ariaLevel='2'>
                    {t9n.title_settingsDialog}
                  </h2>
                </div>
                <div class={css.default.widget_cookies_all_content_message__div}>
                  <p>
                    {t9n.message_settingsDialog}
                    {this._getPrivacyPolicyButton()}
                  </p>
                  <div id={elementIDs.cookiesSettings_privacyPolicyTextID} class={this.classes(css.default.widget_cookies_all_visible__none, css.default.widget_cookies_settings_content_privacy__div)}>
                    <h3 role='heading' ariaLevel='3'>
                      {t9n.privacyPolicyButtonText_settingsDialog}:
                    </h3>
                    <p>
                      {t9n.privacyPolicyText_settingsDialog}
                    </p>
                  </div>
                </div>
              </div>
              <div class={css.default.widget_cookies_all_switch__container}>
                {switches}
              </div>
              <div class={css.default.widget_cookies_settings_subcontent__div}>
                <div class={css.default.widget_cookies_settings_subcontent_title}>
                  <h2 role='heading' ariaLevel='2'>
                    {t9n.subtitle_settingsDialog}
                  </h2>
                </div>
                <div class={css.default.widget_cookies_all_content_message__div}>
                  <p>
                    {t9n.submessage_settingsDialog}
                    {this._getContactUsButton()}
                  </p>
                  <div id={elementIDs.cookiesSettings_contactUsTextID} class={this.classes(css.default.widget_cookies_all_visible__none, css.default.widget_cookies_settings_buttons)}>
                    <h3 role='heading' ariaLevel='3'>
                      {t9n.contactUsButtonText_settingsDialog}:
                    </h3>
                    <p>
                      {t9n.contactUsText_settingsDialog}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class={css.default.widget_cookies_settings_buttons}>
              <div class={css.default.widget_cookies_settings_buttons__div}>
                <div class={css.default.widget_cookies_settings_buttons_accept__div}>
                  <button id={elementIDs.cookiesSettings_acceptAllButtonID} type="button" class={this.classes(css_esri.esri_button)} aria-label={t9n.agreeButtonText_allDialogs} title={t9n.agreeButtonText_allDialogs} onclick={this._acceptAllButton_click.bind(this)} tabindex="0">
                    {t9n.agreeButtonText_allDialogs}
                  </button>
                </div>
                <div class={css.default.widget_cookies_settings_buttons_reject__div}>
                  <button id={elementIDs.cookiesSettings_rejectAllButtonID} type="button" class={this.classes(css_esri.esri_button)} aria-label={t9n.rejectButtonText_allDialogs} title={t9n.rejectButtonText_allDialogs} onclick={this._rejectAllButton_click.bind(this)} tabindex="0">
                    {t9n.rejectButtonText_allDialogs}
                  </button>
                </div>
                <div class={css.default.widget_cookies_settings_buttons_save__div}>
                  <button id={elementIDs.cookiesSettings_saveButtonID} type="button" class={this.classes(css.default.widget_cookies_all_buttons__disabled, css_esri.esri_button, css_esri.esri_button_disabled)} aria-disabled='true' aria-label={t9n.saveButtonText_allDialogs} title={t9n.saveButtonText_allDialogs} onclick={this._settings_saveButton_click.bind(this)} tabindex="0">
                    {t9n.saveButtonText_allDialogs}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //  Private Methods
  //--------------------------------------------------------------------------
  private async setElementFocus () {
    const cookiesMain_containerNode = document.getElementById(elementIDs.cookiesMain_contentID) as HTMLDivElement;
    // console.log("Cookies AfterCreate");
    // Add all the elements inside modal which you want to make focusable
    // Since there is no modal behind cookies, the main tab event must come from the main screen.
    getFocusableElements(cookiesMain_containerNode);
    // await getFocusableElements(cookiesMain_containerNode).then(function () {
    //   documentFocusTabEventSetup(cookiesMain_containerNode);
    // });
  }

  private _main_closeButton_click () {
    this.visible = false;
    if (this.afterHideFocusElement) {
      if (typeof this.afterHideFocusElement === "string") {
        getFocusableElements(document.getElementById(this.afterHideFocusElement)!);
      } else {
        getFocusableElements(this.afterHideFocusElement);
      }
    }
  }

  private _main_manageButton_click () {
    // Hide the main dialog in case we need it...
    const cookiesMain_modalNode = document.getElementById(elementIDs.cookiesMain_modalID) as HTMLDivElement;
    const cookiesSettings_modalNode = document.getElementById(elementIDs.cookiesSettings_modalID) as HTMLDivElement;
    this._toggleElementListDisplay([cookiesMain_modalNode], false);
    this._toggleElementListDisplay([cookiesSettings_modalNode], true);
    this._setCookieSwitch();
    getFocusableElements(cookiesSettings_modalNode);
  }

  private _settings_closeButton_click () {
    const cookiesMain_modalNode = document.getElementById(elementIDs.cookiesMain_modalID) as HTMLDivElement;
    const cookiesSettings_modalNode = document.getElementById(elementIDs.cookiesSettings_modalID) as HTMLDivElement;
    this._toggleElementListDisplay([cookiesSettings_modalNode], false);
    this._toggleElementListDisplay([cookiesMain_modalNode], true);
    getFocusableElements(cookiesMain_modalNode);
  }

  private _settings_saveButton_click (e: MouseEvent) {
    const cookiesSettings_saveButtonNode = document.getElementById(elementIDs.cookiesSettings_saveButtonID) as HTMLInputElement;
    
    if (cookiesSettings_saveButtonNode.ariaDisabled === "true") {
      e.preventDefault();
    } else {
      this._saveButtonAction(t9n.cookieAccepted_settingsDialog, t9n.cookieRejected_settingsDialog);
    }
  }

  private _getPrivacyPolicyButton(): tsx.JSX.Element {
    var privacyPolicyButton: tsx.JSX.Element =
      <button
        type="button"
        id={elementIDs.cookiesSettings_privacyPolicyButtonID}
        class={this.classes(css_esri.esri_widget_anchor, css.default.widget_cookies_all_links__button)}
        aria-label={t9n.privacyPolicyButtonText_settingsDialog}
        title={t9n.privacyPolicyButtonText_settingsDialog}
        onclick={this._settings_privacyButton_click.bind(this)}
        tabindex="0">
        {t9n.privacyPolicyButtonText_settingsDialog}
      </button>;


    // Validate Privacy Policy button
    if (this.privacyPolicy) {
      if (this.privacyPolicy.type != 'url' || !this.privacyPolicy.value || this.privacyPolicy.value.toLowerCase().indexOf("http") === -1) {
        privacyPolicyButton = <div></div>;
      }
    } else {
      if (!t9n.privacyPolicyText_settingsDialog || t9n.privacyPolicyText_settingsDialog === "") {
        privacyPolicyButton = <div></div>;
      }
    }

    return privacyPolicyButton
  }

  private _getContactUsButton(): tsx.JSX.Element {
    var contactUsButton: tsx.JSX.Element =
      <button
        type="button"
        id={elementIDs.cookiesSettings_contactUsButtonID}
        class={this.classes(css_esri.esri_widget_anchor, css.default.widget_cookies_all_links__button)}
        aria-label={t9n.contactUsButtonText_settingsDialog}
        title={t9n.contactUsButtonText_settingsDialog}
        onclick={this._settings_contactButton_click.bind(this)}
        tabindex="0">
          {t9n.contactUsButtonText_settingsDialog}
      </button>


    // Validate Contact Us button
    if (this.contactUs) {
      if ((this.contactUs.type != 'url' && this.contactUs.type != 'email') || !this.contactUs.value || (this.contactUs.type === 'url' && this.contactUs.value.toLowerCase().indexOf("http") === -1) || (this.contactUs.type === 'email' && !this.contactUs.value.match(new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')))) {
        contactUsButton = <div></div>;
      }
    } else {
      if (!t9n.privacyPolicyText_settingsDialog || t9n.privacyPolicyText_settingsDialog === "") {
        contactUsButton = <div></div>;
      }
    }

    return contactUsButton
  }

  private _settings_privacyButton_click () {
    const cookiesSettings_privacyPolicyTextNode = document.getElementById(elementIDs.cookiesSettings_privacyPolicyTextID) as HTMLElement;
    if (this.privacyPolicy) {
      if (this.privacyPolicy.type === 'url') {
        window.open(this.privacyPolicy.value, "_blank", "noreferrer");
      }
    } else {
      if (cookiesSettings_privacyPolicyTextNode.classList.contains(css.default.widget_cookies_all_visible__none)) {
        this._toggleElementListDisplay([cookiesSettings_privacyPolicyTextNode], true);

      } else {
        this._toggleElementListDisplay([cookiesSettings_privacyPolicyTextNode], false);
      }
    }
  }

  private _settings_contactButton_click () {
    const cookiesSettings_contactUsTextNode = document.getElementById(elementIDs.cookiesSettings_contactUsTextID) as HTMLElement;
    if (this.contactUs) {
      if (this.contactUs.type === 'url') {
        window.open(this.contactUs.value, "_blank", "noreferrer");
      }
      if (this.contactUs.type === 'email') {
        window.open(`mailto:${this.contactUs.value}?subject=Info Re: ${this.label}`, "_blank", "noreferrer");
      }
    } else {
      if (cookiesSettings_contactUsTextNode.classList.contains(css.default.widget_cookies_all_visible__none)) {
        this._toggleElementListDisplay([cookiesSettings_contactUsTextNode], true);

      } else {
        this._toggleElementListDisplay([cookiesSettings_contactUsTextNode], false);
      }
    }
  }

  private _acceptAllButton_click () {
    this._setCookies();
    this._setCookieSwitch();
    this.visible = false;
    if (this.afterHideFocusElement) {
      if (typeof this.afterHideFocusElement === "string") {
        getFocusableElements(document.getElementById(this.afterHideFocusElement)!);
      } else {
        getFocusableElements(this.afterHideFocusElement);
      }
    }
    this.acceptionchange = true;
  }

  private _rejectAllButton_click () {
    this._deleteCookies();
    this._setCookieSwitch();
    this.visible = false;
    if (this.afterHideFocusElement) {
      if (typeof this.afterHideFocusElement === "string") {
        getFocusableElements(document.getElementById(this.afterHideFocusElement)!);
      } else {
        getFocusableElements(this.afterHideFocusElement);
      }
    }
    this.acceptionchange = true;
  }

  private _switchToggle_change(switchID: string) {
    const cookiesSettings_saveButtonNode = document.getElementById(elementIDs.cookiesSettings_saveButtonID) as HTMLInputElement;
    const cookiesSettings_switchNode = document.getElementById(switchID) as HTMLInputElement;
    if (cookiesSettings_saveButtonNode) {
      ariaDisable(cookiesSettings_saveButtonNode, [css.default.widget_cookies_all_buttons__disabled, css_esri.esri_button_disabled], false);

      if (cookiesSettings_switchNode.checked) {
          // cookieset._options.cookies[this.value].accepted = true;
          console.log(`Cookie: ${cookiesSettings_switchNode.value} has been accepted.`);
      } else {
          // cookieset.deleteCookie(this.value);
          console.log(`Cookie: ${cookiesSettings_switchNode.value} has been rejected.`);
      }
    }
  }

  private _saveButtonAction(acceptMessage: string, rejectMessage: string) {
    const cookiesSettings_saveButtonNode = document.getElementById(elementIDs.cookiesSettings_saveButtonID) as HTMLInputElement;
    
    var resultObj = [];
    for (var cookie of this.cookiesVM) {
      var switchToggleCheckbox = document.getElementById(`${cookie.id}${elementIDs.cookiesSettings_switchPostfixID}`) as HTMLInputElement;
      let _message: string;
      if (switchToggleCheckbox.checked === true) {
        cookie.setCookie();
        _message = acceptMessage;
      } else {
        cookie.deleteCookie();
        _message = rejectMessage;
      }

      let messageObj = {
        label: cookie.id,
        message: _message
      };
      resultObj.push(messageObj);
    }
    ariaDisable(cookiesSettings_saveButtonNode, [css.default.widget_cookies_all_buttons__disabled, css_esri.esri_button_disabled], true);

    // Build the alert message
    var alertMessage = "The following cookies were set:\n";
    for (let result of resultObj) {
      alertMessage += `\n     ${result.label}: ${result.message}.`;
    }
    alert(alertMessage);
    this.visible = false;
    if (this.afterHideFocusElement) {
      if (typeof this.afterHideFocusElement === "string") {
        getFocusableElements(document.getElementById(this.afterHideFocusElement)!);
      } else {
        getFocusableElements(this.afterHideFocusElement);
      }
    }
    this.acceptionchange = true;
  }

  private _setCookies() {
    for (var cookie of this.cookiesVM) {
      cookie.setCookie();
    }
  }

  private _deleteCookies() {
    for (var cookie of this.cookiesVM) {
      cookie.deleteCookie();
    }
  }

  private _setCookieSwitch() {
    for (var cookie of this.cookiesVM) {
      var switchToggleCheckbox = document.getElementById(`${cookie.id}${elementIDs.cookiesSettings_switchPostfixID}`) as HTMLInputElement;
      if (cookie.accepted === true) {
        switchToggleCheckbox.checked = true;
      } else {
        switchToggleCheckbox.checked = false;
      }
    }
  }

  async initCookies() {
    var _cookiesVM = new Array<CookiesVM>();
    // Build the cookie object.
    for (let conf_cookie of this.cookies) {
      var _cookie = new CookiesVM();
      _cookie.id = conf_cookie.id;
      _cookie.label = conf_cookie.label;
      _cookie.accepted = false;

      if (conf_cookie.expiry) {
        _cookie.expiry = conf_cookie.expiry;
      }

      if (conf_cookie.value) {
        _cookie.value = conf_cookie.value;
        // console.log(`Cookie value set for ID: ${_cookie.id} (${conf_cookie.value})`)
      } else {
        // Populate the values from the client if it exists
        await _cookie.getCookie().then(result => {
          if (result === true) {
            console.log(`Cookie returned for ID: ${_cookie.id} (${_cookie.value})`)
          } else {
            console.log(`Cookie value does not exist for ID: ${_cookie.id} (${result})`)
          }
        });
      }

      // Add the cookie to the array.
      _cookiesVM.push(_cookie);
    }

    if (!_cookiesVM.length) {
      throw "Please check cookie configuration. Cookies are not set up or found!";
    }

    this.cookiesVM = _cookiesVM;
  }

  private _toggleElementListDisplay(element_list: Array<HTMLElement>, visible=true as boolean, elementID_focus=null as string|null) {
    var elementToFocus = null;
    element_list.forEach(function(element) {
        if (visible === true) {
            element.classList.remove(css.default.widget_cookies_all_visible__none)
        } else {
            element.classList.add(css.default.widget_cookies_all_visible__none)
        }
    });
    if (elementID_focus) {
        elementToFocus = document.getElementById(elementID_focus);
        elementToFocus!.focus();
    }
    return elementToFocus;    
  }

  getCookieAcceptance(name: string) {
    this.cookiesVM.forEach(cookieVM => {
      if (cookieVM.id.toLowerCase() === name.toLowerCase()) {
        return cookieVM.accepted;
      }
    });
    return false;
  }
  
}
export default Cookies;