import { __decorate } from "tslib";
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { getWidgetTheme, ariaDisable, getFocusableElements } from '@dnrr_fd/util/web';
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
// Import Assets
import * as css from './assets/css/disclaimer.module.css';
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
let t9n = t9n_en;
const css_esri = {
    esri_widget: 'esri-widget',
    esri_button: 'esri-button',
    esri_button_third: 'esri-button--third',
    esri_button_disabled: 'esri-button--disabled'
};
const elementIDs = {
    esriThemeID: "esriThemeID",
    disclaimerModalID: "disclaimerModalID",
    disclaimerContentID: "disclaimerContentID",
    disclaimerAgreementCheckboxID: "disclaimerAgreementCheckboxID",
    disclaimerAgreementConfirmID: "disclaimerAgreementConfirmID"
};
let Disclaimer = class Disclaimer extends Widget {
    constructor(params) {
        super(params);
    }
    //----------------------------------
    //  Properties
    //----------------------------------
    afterDestroyFocusElement;
    theme;
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    postInitialize() {
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
        intl.onLocaleChange(function (locale) {
            t9n = (locale === 'fr' ? t9n_fr : t9n_en);
        });
    }
    render() {
        const message = t9n.messages.map(p => tsx("p", { key: `${p.id}_key` },
            p.message.map(obj => this._getElemValue(obj.element, obj.value)),
            " "));
        return (tsx("div", { id: this.id },
            tsx("div", { id: elementIDs.disclaimerModalID, afterCreate: this.setElementFocus, bind: this, className: css.default.widget_disclaimer_modal },
                tsx("div", { id: elementIDs.disclaimerContentID, className: this.classes(css.default.widget_disclaimer, css.default.widget_disclaimer_content, css_esri.esri_widget) },
                    tsx("div", { className: css.default.widget_disclaimer_title__div },
                        tsx("h1", { role: 'heading', "aria-level": '1' }, t9n.title)),
                    tsx("div", { className: css.default.widget_disclaimer_message__div },
                        tsx("div", null, message)),
                    tsx("div", { className: css.default.widget_disclaimer_checkbox__div },
                        tsx("input", { id: elementIDs.disclaimerAgreementCheckboxID, type: 'checkbox', value: 'agree', className: css.default.widget_disclaimer_checkbox, "aria-label": t9n.agreeText, title: t9n.agreeText, onClick: this._agreementCheckbox_click.bind(this) }),
                        tsx("label", { htmlFor: elementIDs.disclaimerAgreementCheckboxID, className: css.default.widget_disclaimer_checkbox__label }, t9n.agreeText)),
                    tsx("div", { className: css.default.widget_disclaimer_button__div },
                        tsx("button", { id: elementIDs.disclaimerAgreementConfirmID, type: "button", className: this.classes(css.default.widget_disclaimer_button__disabled, css_esri.esri_button, css_esri.esri_button_third, css_esri.esri_button_disabled), "aria-disabled": 'true', onClick: this._confirmButton_click.bind(this) }, t9n.confirmButtonText))))));
    }
    //--------------------------------------------------------------------------
    //  Private Methods
    //--------------------------------------------------------------------------
    async setElementFocus() {
        const main_containerNode = document.getElementById(elementIDs.disclaimerModalID);
        // Add all the elements inside modal which you want to make focusable
        getFocusableElements(main_containerNode);
    }
    // Event Listener Callbacks.
    _agreementCheckbox_click() {
        const agreementCheckbox = document.getElementById(elementIDs.disclaimerAgreementCheckboxID);
        const confirmButton = document.getElementById(elementIDs.disclaimerAgreementConfirmID);
        this._checkboxAction(agreementCheckbox, confirmButton);
    }
    async _confirmButton_click(e) {
        const confirmButton = document.getElementById(elementIDs.disclaimerAgreementConfirmID);
        if (confirmButton.ariaDisabled === "true") {
            e.preventDefault();
        }
        else {
            this.destroy();
            if (this.afterDestroyFocusElement) {
                if (typeof this.afterDestroyFocusElement === "string") {
                    getFocusableElements(document.getElementById(this.afterDestroyFocusElement));
                }
                else {
                    getFocusableElements(this.afterDestroyFocusElement);
                }
            }
        }
    }
    // Private Methods
    _checkboxAction(agreementCheckbox, confirmButton) {
        if (agreementCheckbox.checked === true) {
            ariaDisable(confirmButton, [css.default.widget_disclaimer_button__disabled, css_esri.esri_button_disabled], false);
        }
        else {
            ariaDisable(confirmButton, [css.default.widget_disclaimer_button__disabled, css_esri.esri_button_disabled], true);
        }
    }
    _getElemValue(element, value) {
        if (element.toLowerCase() === "b") {
            return tsx("b", null, value);
        }
        else {
            return value;
        }
    }
};
__decorate([
    property()
], Disclaimer.prototype, "afterDestroyFocusElement", void 0);
__decorate([
    property()
], Disclaimer.prototype, "theme", void 0);
Disclaimer = __decorate([
    subclass("dnrr.forestry.widgets.disclaimer")
], Disclaimer);
export default Disclaimer;
//# sourceMappingURL=Disclaimer.js.map