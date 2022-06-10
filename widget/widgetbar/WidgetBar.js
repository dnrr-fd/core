import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { createWidgetsForWidgetBar, removeWidgetsFromWidgetBar } from './WidgetBarViewModel';
import { getElementPosition, getWidgetTheme } from '@dnrr_fd/util/web';
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css_dark from './assets/css/dark/widgetbar.module.css';
import * as css_light from './assets/css/light/widgetbar.module.css';
export var widgetBarRootURL;
export var widgetBarWidgetCloseFocusElement;
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
var t9n = t9n_en;
var css_theme = css_dark;
var _widgetBarWidgets;
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
        var _locale = getNormalizedLocale();
        console.log(`_LOCALE: ${_locale}`);
        if (_locale === "en") {
            t9n = t9n_en;
        }
        else {
            t9n = t9n_fr;
        }
        widgetBarRootURL = this.widgetBarRootURL;
        var self = this;
        this.rendered = false;
        this.label = t9n.title;
        if (this.afterWidgetCloseFocusElement) {
            widgetBarWidgetCloseFocusElement = this.afterWidgetCloseFocusElement;
        }
        //Set the initial theme
        this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme);
        css_theme = (this.theme === 'dark' ? css_dark : css_light);
        // Create widgetBarWidget scaffold
        _widgetBarWidgets = this.widgets.map(widget => tsx("div", { id: widget.id, class: self.classes(css_theme.default.widget_widgetbar_widget, css_theme.default[widget.id], css_theme.default.widget_widgetbar_visible__none) }));
        // Watch for changes
        intl.onLocaleChange(async function (locale) {
            t9n = (locale === 'fr' ? t9n_fr : t9n_en);
            self.locale = locale;
            removeWidgetsFromWidgetBar(self.mapView);
            await createWidgetsForWidgetBar(self.mapView, self.widgets, self.cookies, self.localeList, self.graphicsLayer).then(_mapBarWidgets => {
                self.widgetStylize(_mapBarWidgets);
            });
        });
        this.watch("theme", function (theme_new, theme_old) {
            if (theme_old) {
                css_theme = (theme_new === 'dark' ? css_dark : css_light);
                // self.render();
                console.log(`Watch: Theme (WidgetBar) is now ${theme_new}`);
            }
        });
        // Create widget bar widgets
        await createWidgetsForWidgetBar(this.mapView, this.widgets, this.cookies, this.localeList, this.graphicsLayer).then(_mapBarWidgets => {
            this.widgetStylize(_mapBarWidgets);
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
    widgetStylize(_mapBarWidgets) {
        if (_mapBarWidgets) {
            _mapBarWidgets.forEach(wbw => {
                // Make valid widget bar widget styling changes.
                var wbw_node = document.getElementById(wbw.id);
                if (wbw_node) {
                    var wbwccID = `${wbw.id}_controls_content`;
                    var wbwcc_node = document.getElementById(wbwccID);
                    if (wbwcc_node) {
                        var wbwccClass = `widget_widgetbar_widget__${wbwccID}`;
                        wbwcc_node.classList.add(css_theme.default[wbwccClass]);
                    }
                    wbw_node.classList.remove(css_theme.default.widget_widgetbar_visible__none);
                }
            });
            _mapBarWidgets.forEach(wbw => {
                // Adjust the expand menus after final render from above class changes.
                var button_node = document.getElementById(wbw.id);
                if (button_node) {
                    var wbwccID = `${wbw.id}_controls_content`;
                    var wbwcc_node = document.getElementById(wbwccID);
                    if (wbwcc_node) {
                        var windowWidth = window.innerWidth;
                        var pos = getElementPosition(button_node);
                        var right_offset = windowWidth - pos.xMax;
                        wbwcc_node.setAttribute("style", "right: -" + right_offset + "px!important;");
                        console.log(`${wbw.id}  Position - xMax: ${pos.xMax}, xMin: ${pos.xMin}, yMin: ${pos.yMin}, yMax: ${pos.yMax} { right: -${right_offset}px!important; }`);
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
], WidgetBar.prototype, "graphicsLayer", void 0);
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
WidgetBar = __decorate([
    subclass("dnrr.forestry.widgets.widgetbar")
], WidgetBar);
export default WidgetBar;
//# sourceMappingURL=WidgetBar.js.map