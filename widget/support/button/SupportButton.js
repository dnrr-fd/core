import { __decorate } from "tslib";
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { getWidgetTheme } from '@dnrr_fd/util/web';
import * as t9n_en from '../button/assets/t9n/en.json';
import * as t9n_fr from '../button/assets/t9n/fr.json';
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
let t9n = t9n_en;
const css_esri = {
    esri_widget: 'esri-widget',
    esri_widget_button: 'esri-widget--button',
    esri_component: 'esri-component',
    esri_expand__container: 'esri-expand__container',
    esri_icon: 'esri-icon',
    esri_icon_font_fallback_text: 'esri-icon-font-fallback-text'
};
const elementIDs = {
    esriThemeID: "esriThemeID"
};
let buttonLabel;
let buttonIconClass;
let SupportButton = class SupportButton extends Widget {
    constructor(params) {
        super(params);
    }
    //----------------------------------
    //  Properties
    //----------------------------------
    content;
    iconClass;
    toolTip;
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
        this.label = t9n.label;
        this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme);
        intl.onLocaleChange(function (locale) {
            t9n = (locale === 'fr' ? t9n_fr : t9n_en);
        });
        if (this.toolTip) {
            buttonLabel = this.toolTip;
        }
        else if (t9n.toolTip && t9n.toolTip.length > 0) {
            buttonLabel = t9n.toolTip;
        }
        else if (t9n.label && t9n.label.length > 0) {
            buttonLabel = t9n.toolTip;
        }
        else {
            buttonLabel = "";
        }
        if (this.iconClass && this.iconClass.length > 0) {
            buttonIconClass = this.iconClass;
        }
        else {
            buttonIconClass = "esri-icon-notice-round";
        }
    }
    render() {
        return (tsx("div", { id: this.id, className: this.classes(css_esri.esri_expand__container, css_esri.esri_component, css_esri.esri_widget_button, css_esri.esri_widget), role: "button", "aria-label": buttonLabel, title: buttonLabel, tabIndex: "0", onClick: this._button_click.bind(this), onKeyPress: this._button_keypress.bind(this) },
            tsx("span", { id: `${this.id}_iconID`, className: this.classes(css_esri.esri_icon, buttonIconClass), "aria-hidden": "true" }),
            tsx("span", { className: css_esri.esri_icon_font_fallback_text }, buttonLabel)));
    }
    //--------------------------------------------------------------------------
    //  Private Methods
    //--------------------------------------------------------------------------
    _button_click(e) {
        e.preventDefault();
        this.buttonClickAction();
    }
    _button_keypress(e) {
        const isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
        const isSpacePressed = e.key === 'Space' || e.keyCode === 32;
        if (isEnterPressed || isSpacePressed) {
            e.preventDefault(); // Prevent the default keypress action, i.e. space = scroll
            this.buttonClickAction();
        }
    }
    buttonClickAction() {
        if (this.content) {
            if (typeof (this.content) === "string") {
                // Assume the string is a URL
                const expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
                const regex = new RegExp(expression);
                if (this.content.match(regex)) {
                    window.open(this.content, "_blank", "noreferrer");
                }
                else {
                    alert("Invalid URL passed!");
                }
            }
            else {
                if (this.content instanceof Widget) {
                    // Activate the widget content.
                    this.content.visible = true;
                }
                else {
                    // alert("Node");
                }
            }
        }
    }
};
__decorate([
    property()
], SupportButton.prototype, "content", void 0);
__decorate([
    property()
], SupportButton.prototype, "iconClass", void 0);
__decorate([
    property()
], SupportButton.prototype, "toolTip", void 0);
__decorate([
    property()
], SupportButton.prototype, "theme", void 0);
SupportButton = __decorate([
    subclass("esri.widgets.supportbutton")
], SupportButton);
export default SupportButton;
//# sourceMappingURL=SupportButton.js.map