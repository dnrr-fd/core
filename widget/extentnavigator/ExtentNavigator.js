import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
// Import Assets
import * as css from '@dnrr_fd/core/widget/extentnavigator/assets/css/extentnavigator.module.css';
import * as t9n_en from '@dnrr_fd/core/widget/extentnavigator/assets/t9n/en.json';
import * as t9n_fr from '@dnrr_fd/core/widget/extentnavigator/assets/t9n/fr.json';
import { MapExtentObject } from "@dnrr_fd/core/widget/class/_Map";
var t9n = t9n_en;
var alignmentClass;
export var mapExtentArray = new Array();
const css_esri = {
    esri_widget: 'esri-widget',
    esri_icon_previous_extent: 'esri-icon-left-arrow',
    esri_icon_next_extent: 'esri-icon-right-arrow',
    esri_button: 'esri-button'
};
const elementIDs = {
    extentnavigatorID: "extentnavigatorID",
    extentnavigatorPreviousExtentButtonID: "extentnavigatorPreviousExtentButtonID",
    extentnavigatorPreviousExtentSpanID: "extentnavigatorPreviousExtentSpanID",
    extentnavigatorNextExtentButtonID: "extentnavigatorNextExtentButtonID",
    extentnavigatorNextExtentSpanID: "extentnavigatorNextExtentSpanID"
};
let ExtentNavigator = class ExtentNavigator extends Widget {
    constructor(params) {
        super(params);
    }
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    postInitialize() {
        var _locale = getNormalizedLocale();
        if (_locale === "en") {
            t9n = t9n_en;
        }
        else {
            t9n = t9n_fr;
        }
        this.label = t9n.label;
        elementIDs.extentnavigatorID = this.id;
        intl.onLocaleChange(function (locale) {
            t9n = (locale === 'fr' ? t9n_fr : t9n_en);
        });
        alignmentClass = css.default.widget_extentnavigator_content_horizontal;
        if (this.horizontalAlignButtons === false) {
            alignmentClass = css.default.widget_extentnavigator_content_vertical;
        }
        var mapExtentObject = new MapExtentObject();
        // Watch for any changes in extent
        reactiveUtils.watch(() => !this.view.stationary, (stationary, wasStationary) => {
            if (wasStationary) {
                mapExtentObject.scale = this.view.scale;
                mapExtentObject.extent = this.view.extent;
                console.log(`New Extent Object:`);
                console.log(mapExtentObject.toString());
                mapExtentArray.push(mapExtentObject);
            }
            return "";
        });
    }
    render() {
        return (tsx("div", { id: elementIDs.extentnavigatorID, class: alignmentClass },
            tsx("div", null,
                tsx("button", { id: elementIDs.extentnavigatorPreviousExtentButtonID, type: "button", class: this.classes(css_esri.esri_button, css.default.widget_extentnavigator_previous_extent__button), ariaLabel: t9n.previousExtentButtonText, title: t9n.previousExtentButtonText, onclick: this._previousExtent_click.bind(this), onkeypress: this._previousExtent_keypress.bind(this), tabindex: "0" },
                    tsx("span", { id: elementIDs.extentnavigatorPreviousExtentSpanID, "aria-hidden": 'true', class: css_esri.esri_icon_previous_extent }))),
            tsx("div", null,
                tsx("button", { id: elementIDs.extentnavigatorNextExtentButtonID, type: "button", class: this.classes(css_esri.esri_button, css.default.widget_extentnavigator_next_extent__button), ariaLabel: t9n.nextExtentButtonText, title: t9n.nextExtentButtonText, onclick: this._nextExtent_click.bind(this), onkeypress: this._nextExtent_keypress.bind(this), tabindex: "0" },
                    tsx("span", { id: elementIDs.extentnavigatorNextExtentSpanID, "aria-hidden": 'true', class: css_esri.esri_icon_next_extent })))));
    }
    //--------------------------------------------------------------------------
    //  Private Methods
    //--------------------------------------------------------------------------
    _previousExtent_click(e) {
        e.preventDefault();
        // this._validateForm();
    }
    _previousExtent_keypress(e) {
        let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
        let isSpacePressed = e.key === 'Space' || e.keyCode === 32;
        if (isEnterPressed || isSpacePressed) {
            e.preventDefault(); // Prevent the default keypress action, i.e. space = scroll
            // this._validateForm();
        }
    }
    _nextExtent_click(e) {
        e.preventDefault();
        // this._validateForm();
    }
    _nextExtent_keypress(e) {
        let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
        let isSpacePressed = e.key === 'Space' || e.keyCode === 32;
        if (isEnterPressed || isSpacePressed) {
            e.preventDefault(); // Prevent the default keypress action, i.e. space = scroll
            // this._validateForm();
        }
    }
};
__decorate([
    property()
], ExtentNavigator.prototype, "horizontalAlignButtons", void 0);
__decorate([
    property()
], ExtentNavigator.prototype, "view", void 0);
ExtentNavigator = __decorate([
    subclass("esri.widgets.extentnavigator")
], ExtentNavigator);
export default ExtentNavigator;
//# sourceMappingURL=ExtentNavigator.js.map