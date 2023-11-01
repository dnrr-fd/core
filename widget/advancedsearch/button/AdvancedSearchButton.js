import { __decorate } from "tslib";
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { getWidgetTheme } from '@dnrr_fd/util/web';
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
let t9n = t9n_en;
const css_esri = {
    esri_widget: 'esri-widget',
    esri_widget_button: 'esri-widget--button',
    esri_component: 'esri-component',
    esri_expand__container: 'esri-expand__container',
    esri_interactive: 'esri-interactive',
    esri_icon: 'esri-icon',
    esri_icon_font_fallback_text: 'esri-icon-font-fallback-text'
};
const elementIDs = {
    esriThemeID: "esriThemeID"
};
let buttonLabel;
let buttonIconClass;
let AdvancedSearchButton = class AdvancedSearchButton extends Widget {
    constructor(params) {
        super(params);
    }
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
            buttonIconClass = "esri-icon-review";
        }
    }
    render() {
        return (tsx("div", { class: css_esri.esri_widget },
            tsx("div", { id: this.id, class: this.classes(css_esri.esri_widget_button, css_esri.esri_widget), role: "button", "aria-label": buttonLabel, title: buttonLabel, tabIndex: "0", onclick: this._button_click.bind(this), onKeyPress: this._button_keypress.bind(this) },
                tsx("span", { id: `${this.id}_iconID`, class: this.classes(css_esri.esri_icon, buttonIconClass), "aria-hidden": "true" }),
                tsx("span", { class: css_esri.esri_icon_font_fallback_text }, buttonLabel))));
    }
    //--------------------------------------------------------------------------
    //  Private Methods
    //--------------------------------------------------------------------------
    _button_click(e) {
        // e.preventDefault();
        this.buttonClickAction();
    }
    _button_keypress(e) {
        const isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
        const isSpacePressed = e.key === 'Space' || e.keyCode === 32;
        if (isEnterPressed || isSpacePressed) {
            // e.preventDefault();  // Prevent the default keypress action, i.e. space = scroll
            this.buttonClickAction();
        }
    }
    buttonClickAction() {
        if (this.content) {
            // Activate the widget content.
            this.content.visible = true;
            // Backup in case esri content.visible doesn't work
            const content_node = this.content.container;
            if (content_node.style) {
                content_node.removeAttribute("style");
            }
        }
    }
};
__decorate([
    property()
], AdvancedSearchButton.prototype, "id", void 0);
__decorate([
    property()
], AdvancedSearchButton.prototype, "content", void 0);
__decorate([
    property()
], AdvancedSearchButton.prototype, "iconClass", void 0);
__decorate([
    property()
], AdvancedSearchButton.prototype, "toolTip", void 0);
__decorate([
    property()
], AdvancedSearchButton.prototype, "theme", void 0);
AdvancedSearchButton = __decorate([
    subclass("esri.widgets.advancedsearchbutton")
], AdvancedSearchButton);
export default AdvancedSearchButton;
//# sourceMappingURL=AdvancedSearchButton.js.map