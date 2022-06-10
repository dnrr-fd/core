import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { getWidgetTheme } from '@dnrr_fd/util/web';
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
if (getNormalizedLocale() === "en") {
    var t9n = t9n_en;
}
else {
    var t9n = t9n_fr;
}
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
var buttonLabel;
var buttonIconClass;
let Button = class Button extends Widget {
    constructor(params) {
        super(params);
    }
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    postInitialize() {
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
        return (tsx("div", { id: this.id, class: this.classes(css_esri.esri_expand__container, css_esri.esri_component, css_esri.esri_widget_button, css_esri.esri_widget), role: "button", "aria-label": buttonLabel, title: buttonLabel, tabindex: "0", onclick: this._button_click.bind(this), onkeypress: this._button_keypress.bind(this) },
            tsx("span", { id: `${this.id}_iconID`, class: this.classes(css_esri.esri_icon, buttonIconClass), "aria-hidden": "true" }),
            tsx("span", { class: css_esri.esri_icon_font_fallback_text }, buttonLabel)));
    }
    //--------------------------------------------------------------------------
    //  Private Methods
    //--------------------------------------------------------------------------
    _button_click(e) {
        e.preventDefault();
        this.buttonClickAction();
    }
    _button_keypress(e) {
        let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
        let isSpacePressed = e.key === 'Space' || e.keyCode === 32;
        if (isEnterPressed || isSpacePressed) {
            e.preventDefault(); // Prevent the default keypress action, i.e. space = scroll
            this.buttonClickAction();
        }
    }
    buttonClickAction() {
        if (this.content) {
            if (typeof (this.content) === "string") {
                // Assume the string is a URL
                var expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
                var regex = new RegExp(expression);
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
], Button.prototype, "id", void 0);
__decorate([
    property()
], Button.prototype, "content", void 0);
__decorate([
    property()
], Button.prototype, "iconClass", void 0);
__decorate([
    property()
], Button.prototype, "toolTip", void 0);
__decorate([
    property()
], Button.prototype, "theme", void 0);
Button = __decorate([
    subclass("esri.widgets.button")
], Button);
export default Button;
//# sourceMappingURL=Button.js.map