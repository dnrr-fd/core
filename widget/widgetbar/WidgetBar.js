import { __decorate } from "tslib";
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import Expand from "@arcgis/core/widgets/Expand";
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import * as intl from "@arcgis/core/intl";
import { createWidgetsForWidgetBar, removeWidgetsFromWidgetBar } from './WidgetBarViewModel';
import { getElementPosition, getFocusableElements, getWidgetTheme } from '@dnrr_fd/util/web';
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css_dark from './assets/css/dark/widgetbar.module.css';
import * as css_light from './assets/css/light/widgetbar.module.css';
export let widgetBarRootURL;
export let widgetBarWidgetCloseFocusElement;
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
let t9n = t9n_en;
let css_theme = css_dark;
let _widgetBarWidgets;
let afterWidgetCloseFocusElement;
const elementIDs = {
    esriThemeID: "esriThemeID",
    widgetBarID: "_widgetBarID",
    widgetBarContainerID: "widgetBarContainerID"
};
let WidgetBar = class WidgetBar extends Widget {
    constructor(params) {
        super(params);
    }
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
        widgetBarRootURL = this.widgetBarRootURL;
        const self = this;
        this.rendered = false;
        afterWidgetCloseFocusElement = this.afterWidgetCloseFocusElement;
        this.label = t9n.title;
        if (this.afterWidgetCloseFocusElement) {
            widgetBarWidgetCloseFocusElement = this.afterWidgetCloseFocusElement;
        }
        //Set the initial theme
        this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme);
        css_theme = (this.theme === 'dark' ? css_dark : css_light);
        // Create widgetBarWidget scaffold
        _widgetBarWidgets = this.widgets.map(widget => tsx("div", { key: `${widget.id}_key`, id: widget.id, class: self.classes(css_theme.default.widget_widgetbar_widget, css_theme.default[widget.id], css_theme.default.widget_widgetbar_visible__none) }));
        // Watch for changes
        intl.onLocaleChange(async function (locale) {
            t9n = (locale === 'fr' ? t9n_fr : t9n_en);
            self.locale = locale;
            removeWidgetsFromWidgetBar(self.mapView);
            await createWidgetsForWidgetBar(self).then(_widgetBarWidgets => {
                self.widgetBarWidgets = _widgetBarWidgets;
                self.widgetStylize(_widgetBarWidgets);
            });
        });
        reactiveUtils.watch(() => self.theme, (theme_new, theme_old) => {
            if (theme_old) {
                css_theme = (theme_new === 'dark' ? css_dark : css_light);
                // console.log(`Watch: Theme (WidgetBar) is now ${theme_new}`);
            }
        });
        // Create widget bar widgets
        await createWidgetsForWidgetBar(self).then(_widgetBarWidgets => {
            self.widgetBarWidgets = _widgetBarWidgets;
            this.widgetStylize(_widgetBarWidgets);
        });
    }
    render() {
        return (tsx("div", { id: elementIDs.widgetBarID, afterCreate: this._setRendered, bind: this, class: this.classes(css_theme.default.widget_widgetbar, css_theme.default.widget_widgetbar_box_shadow, css_theme.default.widget_widgetbar_transition) },
            tsx("div", { class: css_theme.default.widget_widgetbar_bg },
                tsx("div", { class: css_theme.default.widget_widgetbar_bg__header },
                    tsx("div", { class: css_theme.default.widget_widgetbar_bg__bg1 }),
                    tsx("div", { class: css_theme.default.widget_widgetbar_bg__bg2 }))),
            tsx("div", { id: elementIDs.widgetBarContainerID, class: this.classes(css_theme.default.widget_widgetbar_fg, css_theme.default.widget_widgetbar_fg__container) }, _widgetBarWidgets)));
    }
    //--------------------------------------------------------------------------
    //  Private Methods
    //--------------------------------------------------------------------------
    _setRendered() {
        this.rendered = true;
    }
    widgetStylize(_widgetBarWidgets) {
        if (_widgetBarWidgets) {
            _widgetBarWidgets.forEach(wbObj => {
                // Make valid widget bar widget styling changes.
                const wbw_node = document.getElementById(wbObj.wbWidget.id);
                if (wbw_node) {
                    const wbwccID = `${wbObj.wbWidget.id}_controls_content`;
                    const wbwcc_node = document.getElementById(wbwccID);
                    if (wbwcc_node) {
                        const wbwccClass = `widget_widgetbar_widget__${wbwccID}`;
                        wbwcc_node.classList.add(css_theme.default[wbwccClass]);
                    }
                    wbw_node.classList.remove(css_theme.default.widget_widgetbar_visible__none);
                }
            });
            _widgetBarWidgets.forEach(wbObj => {
                // Adjust the expand menus after final render from above class changes.
                const button_node = document.getElementById(wbObj.wbWidget.id);
                if (button_node) {
                    const wbwccID = `${wbObj.wbWidget.id}_controls_content`;
                    const wbwcc_node = document.getElementById(wbwccID);
                    if (wbwcc_node) {
                        const windowWidth = window.innerWidth;
                        const pos = getElementPosition(button_node);
                        const right_offset = windowWidth - pos.xMax;
                        wbwcc_node.setAttribute("style", "right: -" + right_offset + "px!important;");
                        // console.log(`${wbObj.wbWidget.id}  Position - xMax: ${pos.xMax}, xMin: ${pos.xMin}, yMin: ${pos.yMin}, yMax: ${pos.yMax} { right: -${right_offset}px!important; }`);
                    }
                    if (wbObj.fireEvent === true) {
                        if (wbObj.wbWidget instanceof Expand) {
                            const wbwExpand = wbObj.wbWidget;
                            reactiveUtils.watch(() => wbwExpand.expanded, () => {
                                wbwExpand.renderNow();
                                if (afterWidgetCloseFocusElement) {
                                    if (typeof afterWidgetCloseFocusElement === "string") {
                                        getFocusableElements(document.getElementById(afterWidgetCloseFocusElement));
                                    }
                                    else {
                                        getFocusableElements(afterWidgetCloseFocusElement);
                                    }
                                }
                            });
                        }
                    }
                }
            });
        }
    }
};
__decorate([
    property()
], WidgetBar.prototype, "afterWidgetCloseFocusElement", void 0);
__decorate([
    property()
], WidgetBar.prototype, "theme", void 0);
__decorate([
    property()
], WidgetBar.prototype, "mapView", void 0);
__decorate([
    property()
], WidgetBar.prototype, "widgetBarRootURL", void 0);
__decorate([
    property()
], WidgetBar.prototype, "locale", void 0);
__decorate([
    property()
], WidgetBar.prototype, "title", void 0);
__decorate([
    property()
], WidgetBar.prototype, "rendered", void 0);
__decorate([
    property()
], WidgetBar.prototype, "cookies", void 0);
__decorate([
    property()
], WidgetBar.prototype, "widgets", void 0);
__decorate([
    property()
], WidgetBar.prototype, "localeList", void 0);
__decorate([
    property()
], WidgetBar.prototype, "activeWidget", void 0);
__decorate([
    property()
], WidgetBar.prototype, "widgetBarWidgets", void 0);
WidgetBar = __decorate([
    subclass("dnrr.forestry.widgets.widgetbar")
], WidgetBar);
export default WidgetBar;
//# sourceMappingURL=WidgetBar.js.map