import { __decorate } from "tslib";
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
import { getWidgetTheme, ariaDisable, getFocusableElements } from '@dnrr_fd/util/web';
import { CookiesVM } from '../class/_Cookie';
// Import Assets
import * as css from './assets/css/cookies.module.css';
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
let t9n = t9n_en;
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
let switches;
let Cookies = class Cookies extends Widget {
    constructor(params) {
        super(params);
    }
    //----------------------------------
    //  Properties
    //----------------------------------
    afterHideFocusElement;
    position = 'bottom';
    cookies;
    privacyPolicy;
    contactUs;
    cookiesVM;
    theme;
    acceptionchange;
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    async postInitialize() {
        const _locale = getNormalizedLocale();
        // console.log(`_LOCALE: ${_locale}`);
        if (_locale === "en") {
            t9n = t9n_en;
        }
        else {
            t9n = t9n_fr;
        }
        this.label = t9n.title;
        this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme);
        this.acceptionchange = false;
        intl.onLocaleChange(function (locale) {
            t9n = (locale === 'fr' ? t9n_fr : t9n_en);
        });
        try {
            // Create and set/retreive the cookies
            if (!this.cookiesVM) {
                await this.initCookies();
            }
        }
        catch (error) {
            console.error(`Error initializing cookies widget: ${error}`);
            throw 'Killing Cookies Widget.';
        }
        // Dynamically create switches for the cookies.
        switches = this.cookiesVM.map(cookie => tsx("div", { key: `${cookie.id}_key`, className: css.default.widget_cookies_all_switch__holder },
            tsx("div", { className: css.default.widget_cookies_all_switch__label },
                tsx("span", null, cookie.label)),
            tsx("div", { className: css.default.widget_cookies_all_switch__toggle },
                tsx("input", { type: 'checkbox', checked: cookie.accepted, name: cookie.id, value: cookie.id, id: cookie.id + elementIDs.cookiesSettings_switchPostfixID, onChange: this._switchToggle_change.bind(this, `${cookie.id}${elementIDs.cookiesSettings_switchPostfixID}`) }),
                tsx("label", { htmlFor: cookie.id + elementIDs.cookiesSettings_switchPostfixID, "aria-label": cookie.label, title: cookie.label }))));
    }
    render() {
        // Set the main cookies dialog position
        let cookiesMain_content_position;
        if (this.position === 'top') {
            cookiesMain_content_position = css.default.widget_cookies_main_content__top;
        }
        else {
            cookiesMain_content_position = css.default.widget_cookies_main_content__bottom;
        }
        return (tsx("div", { afterCreate: this.setElementFocus, bind: this, className: this.classes(css.default.widget_cookies_all) },
            tsx("div", { id: elementIDs.cookiesMain_modalID, className: this.classes(css.default.widget_cookies_main_modal) },
                tsx("div", { id: elementIDs.cookiesMain_contentID, className: this.classes(css_esri.esri_widget, cookiesMain_content_position, css.default.widget_cookies_main_content, css.default.widget_cookies_all_transition) },
                    tsx("div", { className: css.default.widget_cookies_all_header },
                        tsx("div", { className: css.default.widget_cookies_all_header__div },
                            tsx("div", { className: css.default.widget_cookies_all_header_close__div },
                                tsx("button", { id: elementIDs.cookiesMain_closeButtonID, type: "button", className: this.classes(css_esri.esri_button_tertiary, css.default.widget_cookies_all_header_close__button), "aria-label": t9n.closeButtonLabel_mainDialog, title: t9n.closeButtonLabel_mainDialog, onClick: this._main_closeButton_click.bind(this), tabIndex: "0" },
                                    tsx("span", { id: elementIDs.cookiesMain_closeSpanID, "aria-hidden": 'true', className: css_esri.esri_icon_close }))),
                            tsx("div", { className: css.default.widget_cookies_all_header_heading__div },
                                tsx("h1", { role: 'heading', "aria-level": '1' }, t9n.title_mainDialog)))),
                    tsx("div", { className: css.default.widget_cookies_main_subcontent__div },
                        tsx("div", { className: css.default.widget_cookies_all_content_message__div },
                            tsx("p", null,
                                t9n.message_mainDialog,
                                tsx("button", { id: elementIDs.cookiesMain_manageButtonID, type: "button", className: this.classes(css_esri.esri_widget_anchor, css.default.widget_cookies_all_links__button), "aria-label": t9n.manageButtonText_mainDialog, title: t9n.manageButtonText_mainDialog, onClick: this._main_manageButton_click.bind(this), tabIndex: "0" }, t9n.manageButtonText_mainDialog))),
                        tsx("div", { className: css.default.widget_cookies_main_buttons__div },
                            tsx("button", { id: elementIDs.cookiesMain_acceptAllButtonID, type: "button", className: this.classes(css_esri.esri_button, css.default.widget_cookies_main_buttons_accept__button), "aria-label": t9n.agreeButtonText_allDialogs, title: t9n.agreeButtonText_allDialogs, onClick: this._acceptAllButton_click.bind(this), tabIndex: "0" }, t9n.agreeButtonText_allDialogs),
                            tsx("button", { id: elementIDs.cookiesMain_rejectAllButtonID, type: "button", className: css_esri.esri_button, "aria-label": t9n.rejectButtonText_allDialogs, title: t9n.rejectButtonText_allDialogs, onClick: this._rejectAllButton_click.bind(this), tabIndex: "0" }, t9n.rejectButtonText_allDialogs))))),
            tsx("div", { id: elementIDs.cookiesSettings_modalID, className: this.classes(css.default.widget_cookies_settings_modal, css.default.widget_cookies_all_visible__none) },
                tsx("div", { id: elementIDs.cookiesSettings_contentID, className: this.classes(css_esri.esri_widget, css.default.widget_cookies_settings_content, css.default.widget_cookies_settings_content) },
                    tsx("div", { className: css.default.widget_cookies_all_header },
                        tsx("div", { className: css.default.widget_cookies_all_header__div },
                            tsx("div", { className: css.default.widget_cookies_all_header_close__div },
                                tsx("button", { id: elementIDs.cookiesSettings_closeButtonID, type: "button", className: this.classes(css_esri.esri_button_tertiary, css.default.widget_cookies_all_header_close__button), "aria-label": t9n.closeButtonLabel_settingsDialog, title: t9n.closeButtonLabel_settingsDialog, onClick: this._settings_closeButton_click.bind(this), tabIndex: "0" },
                                    tsx("span", { id: elementIDs.cookiesSettings_closeSpanID, "aria-hidden": 'true', className: css_esri.esri_icon_close }))),
                            tsx("div", { className: css.default.widget_cookies_all_header_heading__div },
                                tsx("h1", { role: 'heading', "aria-level": '1' }, t9n.header_settingsDialog)))),
                    tsx("div", { className: css.default.widget_cookies_settings_subcontent },
                        tsx("div", { className: css.default.widget_cookies_settings_content__div },
                            tsx("div", { className: css.default.widget_cookies_settings_subcontent_title },
                                tsx("h2", { role: 'heading', "aria-level": '2' }, t9n.title_settingsDialog)),
                            tsx("div", { className: css.default.widget_cookies_all_content_message__div },
                                tsx("p", null,
                                    t9n.message_settingsDialog,
                                    this._getPrivacyPolicyButton()),
                                tsx("div", { id: elementIDs.cookiesSettings_privacyPolicyTextID, className: this.classes(css.default.widget_cookies_all_visible__none, css.default.widget_cookies_settings_content_privacy__div) },
                                    tsx("h3", { role: 'heading', "aria-level": '3' },
                                        t9n.privacyPolicyButtonText_settingsDialog,
                                        ":"),
                                    tsx("p", null, t9n.privacyPolicyText_settingsDialog)))),
                        tsx("div", { className: css.default.widget_cookies_all_switch__container }, switches),
                        tsx("div", { className: css.default.widget_cookies_settings_subcontent__div },
                            tsx("div", { className: css.default.widget_cookies_settings_subcontent_title },
                                tsx("h2", { role: 'heading', "aria-level": '2' }, t9n.subtitle_settingsDialog)),
                            tsx("div", { className: css.default.widget_cookies_all_content_message__div },
                                tsx("p", null,
                                    t9n.submessage_settingsDialog,
                                    this._getContactUsButton()),
                                tsx("div", { id: elementIDs.cookiesSettings_contactUsTextID, className: this.classes(css.default.widget_cookies_all_visible__none, css.default.widget_cookies_settings_buttons) },
                                    tsx("h3", { role: 'heading', "aria-level": '3' },
                                        t9n.contactUsButtonText_settingsDialog,
                                        ":"),
                                    tsx("p", null, t9n.contactUsText_settingsDialog))))),
                    tsx("div", { className: css.default.widget_cookies_settings_buttons },
                        tsx("div", { className: css.default.widget_cookies_settings_buttons__div },
                            tsx("div", { className: css.default.widget_cookies_settings_buttons_accept__div },
                                tsx("button", { id: elementIDs.cookiesSettings_acceptAllButtonID, type: "button", className: this.classes(css_esri.esri_button), "aria-label": t9n.agreeButtonText_allDialogs, title: t9n.agreeButtonText_allDialogs, onClick: this._acceptAllButton_click.bind(this), tabIndex: "0" }, t9n.agreeButtonText_allDialogs)),
                            tsx("div", { className: css.default.widget_cookies_settings_buttons_reject__div },
                                tsx("button", { id: elementIDs.cookiesSettings_rejectAllButtonID, type: "button", className: this.classes(css_esri.esri_button), "aria-label": t9n.rejectButtonText_allDialogs, title: t9n.rejectButtonText_allDialogs, onClick: this._rejectAllButton_click.bind(this), tabIndex: "0" }, t9n.rejectButtonText_allDialogs)),
                            tsx("div", { className: css.default.widget_cookies_settings_buttons_save__div },
                                tsx("button", { id: elementIDs.cookiesSettings_saveButtonID, type: "button", className: this.classes(css.default.widget_cookies_all_buttons__disabled, css_esri.esri_button, css_esri.esri_button_disabled), "aria-disabled": 'true', "aria-label": t9n.saveButtonText_allDialogs, title: t9n.saveButtonText_allDialogs, onClick: this._settings_saveButton_click.bind(this), tabIndex: "0" }, t9n.saveButtonText_allDialogs))))))));
    }
    //--------------------------------------------------------------------------
    //  Private Methods
    //--------------------------------------------------------------------------
    async setElementFocus() {
        const cookiesMain_containerNode = document.getElementById(elementIDs.cookiesMain_contentID);
        // console.log("Cookies AfterCreate");
        // Add all the elements inside modal which you want to make focusable
        // Since there is no modal behind cookies, the main tab event must come from the main screen.
        getFocusableElements(cookiesMain_containerNode);
        // await getFocusableElements(cookiesMain_containerNode).then(function () {
        //   documentFocusTabEventSetup(cookiesMain_containerNode);
        // });
    }
    _main_closeButton_click() {
        this.visible = false;
        if (this.afterHideFocusElement) {
            if (typeof this.afterHideFocusElement === "string") {
                getFocusableElements(document.getElementById(this.afterHideFocusElement));
            }
            else {
                getFocusableElements(this.afterHideFocusElement);
            }
        }
    }
    _main_manageButton_click() {
        // Hide the main dialog in case we need it...
        const cookiesMain_modalNode = document.getElementById(elementIDs.cookiesMain_modalID);
        const cookiesSettings_modalNode = document.getElementById(elementIDs.cookiesSettings_modalID);
        this._toggleElementListDisplay([cookiesMain_modalNode], false);
        this._toggleElementListDisplay([cookiesSettings_modalNode], true);
        this._setCookieSwitch();
        getFocusableElements(cookiesSettings_modalNode);
    }
    _settings_closeButton_click() {
        const cookiesMain_modalNode = document.getElementById(elementIDs.cookiesMain_modalID);
        const cookiesSettings_modalNode = document.getElementById(elementIDs.cookiesSettings_modalID);
        this._toggleElementListDisplay([cookiesSettings_modalNode], false);
        this._toggleElementListDisplay([cookiesMain_modalNode], true);
        getFocusableElements(cookiesMain_modalNode);
    }
    _settings_saveButton_click(e) {
        const cookiesSettings_saveButtonNode = document.getElementById(elementIDs.cookiesSettings_saveButtonID);
        if (cookiesSettings_saveButtonNode.ariaDisabled === "true") {
            e.preventDefault();
        }
        else {
            this._saveButtonAction(t9n.cookieAccepted_settingsDialog, t9n.cookieRejected_settingsDialog);
        }
    }
    _getPrivacyPolicyButton() {
        let privacyPolicyButton = tsx("button", { type: "button", id: elementIDs.cookiesSettings_privacyPolicyButtonID, className: this.classes(css_esri.esri_widget_anchor, css.default.widget_cookies_all_links__button), "aria-label": t9n.privacyPolicyButtonText_settingsDialog, title: t9n.privacyPolicyButtonText_settingsDialog, onClick: this._settings_privacyButton_click.bind(this), tabIndex: "0" }, t9n.privacyPolicyButtonText_settingsDialog);
        // Validate Privacy Policy button
        if (this.privacyPolicy) {
            if (this.privacyPolicy.type != 'url' || !this.privacyPolicy.value || this.privacyPolicy.value.toLowerCase().indexOf("http") === -1) {
                privacyPolicyButton = tsx("div", null);
            }
        }
        else {
            if (!t9n.privacyPolicyText_settingsDialog || t9n.privacyPolicyText_settingsDialog === "") {
                privacyPolicyButton = tsx("div", null);
            }
        }
        return privacyPolicyButton;
    }
    _getContactUsButton() {
        let contactUsButton = tsx("button", { type: "button", id: elementIDs.cookiesSettings_contactUsButtonID, className: this.classes(css_esri.esri_widget_anchor, css.default.widget_cookies_all_links__button), "aria-label": t9n.contactUsButtonText_settingsDialog, title: t9n.contactUsButtonText_settingsDialog, onClick: this._settings_contactButton_click.bind(this), tabIndex: "0" }, t9n.contactUsButtonText_settingsDialog);
        // Validate Contact Us button
        if (this.contactUs) {
            if ((this.contactUs.type != 'url' && this.contactUs.type != 'email') || !this.contactUs.value || (this.contactUs.type === 'url' && this.contactUs.value.toLowerCase().indexOf("http") === -1) || (this.contactUs.type === 'email' && !this.contactUs.value.match(new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')))) {
                contactUsButton = tsx("div", null);
            }
        }
        else {
            if (!t9n.privacyPolicyText_settingsDialog || t9n.privacyPolicyText_settingsDialog === "") {
                contactUsButton = tsx("div", null);
            }
        }
        return contactUsButton;
    }
    _settings_privacyButton_click() {
        const cookiesSettings_privacyPolicyTextNode = document.getElementById(elementIDs.cookiesSettings_privacyPolicyTextID);
        if (this.privacyPolicy) {
            if (this.privacyPolicy.type === 'url') {
                window.open(this.privacyPolicy.value, "_blank", "noreferrer");
            }
        }
        else {
            if (cookiesSettings_privacyPolicyTextNode.classList.contains(css.default.widget_cookies_all_visible__none)) {
                this._toggleElementListDisplay([cookiesSettings_privacyPolicyTextNode], true);
            }
            else {
                this._toggleElementListDisplay([cookiesSettings_privacyPolicyTextNode], false);
            }
        }
    }
    _settings_contactButton_click() {
        const cookiesSettings_contactUsTextNode = document.getElementById(elementIDs.cookiesSettings_contactUsTextID);
        if (this.contactUs) {
            if (this.contactUs.type === 'url') {
                window.open(this.contactUs.value, "_blank", "noreferrer");
            }
            if (this.contactUs.type === 'email') {
                window.open(`mailto:${this.contactUs.value}?subject=Info Re: ${this.label}`, "_blank", "noreferrer");
            }
        }
        else {
            if (cookiesSettings_contactUsTextNode.classList.contains(css.default.widget_cookies_all_visible__none)) {
                this._toggleElementListDisplay([cookiesSettings_contactUsTextNode], true);
            }
            else {
                this._toggleElementListDisplay([cookiesSettings_contactUsTextNode], false);
            }
        }
    }
    _acceptAllButton_click() {
        this._setCookies();
        this._setCookieSwitch();
        this.visible = false;
        if (this.afterHideFocusElement) {
            if (typeof this.afterHideFocusElement === "string") {
                getFocusableElements(document.getElementById(this.afterHideFocusElement));
            }
            else {
                getFocusableElements(this.afterHideFocusElement);
            }
        }
        this.acceptionchange = true;
    }
    _rejectAllButton_click() {
        this._deleteCookies();
        this._setCookieSwitch();
        this.visible = false;
        if (this.afterHideFocusElement) {
            if (typeof this.afterHideFocusElement === "string") {
                getFocusableElements(document.getElementById(this.afterHideFocusElement));
            }
            else {
                getFocusableElements(this.afterHideFocusElement);
            }
        }
        this.acceptionchange = true;
    }
    _switchToggle_change(switchID) {
        const cookiesSettings_saveButtonNode = document.getElementById(elementIDs.cookiesSettings_saveButtonID);
        const cookiesSettings_switchNode = document.getElementById(switchID);
        if (cookiesSettings_saveButtonNode) {
            ariaDisable(cookiesSettings_saveButtonNode, [css.default.widget_cookies_all_buttons__disabled, css_esri.esri_button_disabled], false);
            if (cookiesSettings_switchNode.checked) {
                // cookieset._options.cookies[this.value].accepted = true;
                console.log(`Cookie: ${cookiesSettings_switchNode.value} has been accepted.`);
            }
            else {
                // cookieset.deleteCookie(this.value);
                console.log(`Cookie: ${cookiesSettings_switchNode.value} has been rejected.`);
            }
        }
    }
    _saveButtonAction(acceptMessage, rejectMessage) {
        const cookiesSettings_saveButtonNode = document.getElementById(elementIDs.cookiesSettings_saveButtonID);
        const resultObj = [];
        for (const cookie of this.cookiesVM) {
            const switchToggleCheckbox = document.getElementById(`${cookie.id}${elementIDs.cookiesSettings_switchPostfixID}`);
            let _message;
            if (switchToggleCheckbox.checked === true) {
                cookie.setCookie();
                _message = acceptMessage;
            }
            else {
                cookie.deleteCookie();
                _message = rejectMessage;
            }
            const messageObj = {
                label: cookie.id,
                message: _message
            };
            resultObj.push(messageObj);
        }
        ariaDisable(cookiesSettings_saveButtonNode, [css.default.widget_cookies_all_buttons__disabled, css_esri.esri_button_disabled], true);
        // Build the alert message
        let alertMessage = "The following cookies were set:\n";
        for (const result of resultObj) {
            alertMessage += `\n     ${result.label}: ${result.message}.`;
        }
        alert(alertMessage);
        this.visible = false;
        if (this.afterHideFocusElement) {
            if (typeof this.afterHideFocusElement === "string") {
                getFocusableElements(document.getElementById(this.afterHideFocusElement));
            }
            else {
                getFocusableElements(this.afterHideFocusElement);
            }
        }
        this.acceptionchange = true;
    }
    _setCookies() {
        for (const cookie of this.cookiesVM) {
            cookie.setCookie();
        }
    }
    _deleteCookies() {
        for (const cookie of this.cookiesVM) {
            cookie.deleteCookie();
        }
    }
    _setCookieSwitch() {
        for (const cookie of this.cookiesVM) {
            const switchToggleCheckbox = document.getElementById(`${cookie.id}${elementIDs.cookiesSettings_switchPostfixID}`);
            if (cookie.accepted === true) {
                switchToggleCheckbox.checked = true;
            }
            else {
                switchToggleCheckbox.checked = false;
            }
        }
    }
    async initCookies() {
        const _cookiesVM = new Array();
        // Build the cookie object.
        for (const conf_cookie of this.cookies) {
            const _cookie = new CookiesVM();
            _cookie.id = conf_cookie.id;
            _cookie.label = conf_cookie.label;
            _cookie.accepted = false;
            if (conf_cookie.expiry) {
                _cookie.expiry = conf_cookie.expiry;
            }
            if (conf_cookie.value) {
                _cookie.value = conf_cookie.value;
                // console.log(`Cookie value set for ID: ${_cookie.id} (${conf_cookie.value})`)
            }
            else {
                // Populate the values from the client if it exists
                await _cookie.getCookie().then(result => {
                    if (result === true) {
                        console.log(`Cookie returned for ID: ${_cookie.id} (${_cookie.value})`);
                    }
                    else {
                        console.log(`Cookie value does not exist for ID: ${_cookie.id} (${result})`);
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
    _toggleElementListDisplay(element_list, visible = true, elementID_focus = null) {
        let elementToFocus = null;
        element_list.forEach(function (element) {
            if (visible === true) {
                element.classList.remove(css.default.widget_cookies_all_visible__none);
            }
            else {
                element.classList.add(css.default.widget_cookies_all_visible__none);
            }
        });
        if (elementID_focus) {
            elementToFocus = document.getElementById(elementID_focus);
            elementToFocus.focus();
        }
        return elementToFocus;
    }
    getCookieAcceptance(name) {
        this.cookiesVM.forEach(cookieVM => {
            if (cookieVM.id.toLowerCase() === name.toLowerCase()) {
                return cookieVM.accepted;
            }
        });
        return false;
    }
};
__decorate([
    property()
], Cookies.prototype, "afterHideFocusElement", void 0);
__decorate([
    property()
], Cookies.prototype, "position", void 0);
__decorate([
    property()
], Cookies.prototype, "cookies", void 0);
__decorate([
    property()
], Cookies.prototype, "privacyPolicy", void 0);
__decorate([
    property()
], Cookies.prototype, "contactUs", void 0);
__decorate([
    property()
], Cookies.prototype, "cookiesVM", void 0);
__decorate([
    property()
], Cookies.prototype, "theme", void 0);
__decorate([
    property()
], Cookies.prototype, "acceptionchange", void 0);
Cookies = __decorate([
    subclass("dnrr.forestry.widgets.cookies")
], Cookies);
export default Cookies;
//# sourceMappingURL=Cookies.js.map