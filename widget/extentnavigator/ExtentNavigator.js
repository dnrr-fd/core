import { __decorate } from "tslib";
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
// Import Assets
import * as css from './assets/css/extentnavigator.module.css';
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
import { MapExtentObject } from "../class/_Map";
import { ariaDisable } from "@dnrr_fd/util";
let t9n = t9n_en;
let alignmentClass;
let navButtonClicked = false;
const mapExtentArray = new Array();
let mapExtentArrayPosition = 0;
let self;
const css_esri = {
    esri_widget: 'esri-widget',
    esri_disabled: 'esri-disabled',
    esri_button_disabled: 'esri-button--disabled',
    esri_icon_previous_extent: 'esri-icon-left-arrow',
    esri_icon_next_extent: 'esri-icon-right-arrow',
    esri_component: 'esri-component',
    esri_widget_button: 'esri-widget--button',
    esri_icon: 'esri-icon',
    esri_icon_font_fallback_text: 'esri-icon-font-fallback-text'
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
    //----------------------------------
    //  Properties
    //----------------------------------
    horizontalAlignButtons;
    view;
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    postInitialize() {
        self = this;
        const _locale = getNormalizedLocale();
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
        // Watch for any changes in extent
        reactiveUtils.watch(() => !this.view.stationary, (stationary, wasStationary) => {
            if (wasStationary) {
                const mapExtentObject = new MapExtentObject();
                mapExtentObject.scale = this.view.scale;
                mapExtentObject.extent = this.view.extent;
                // console.log(`New Extent Object:`);
                // console.log(mapExtentObject.toString());
                // ****************************************************************************
                // Determine if the extent navigator buttons were clicked first before pushing.
                // ****************************************************************************
                if (navButtonClicked === false) {
                    // Pop the array based on mapExtentArrayPosition
                    // console.log(`Before: mapExtentArray.length: ${mapExtentArray.length}, mapExtentArrayPosition: ${mapExtentArrayPosition}`);
                    const ltp = mapExtentArray.length - mapExtentArrayPosition;
                    if (ltp > 0) {
                        for (let i = 0; i < ltp; i++) {
                            mapExtentArray.pop();
                        }
                    }
                    mapExtentArray.push(mapExtentObject);
                    mapExtentArrayPosition = mapExtentArray.length;
                    // console.log(`After: mapExtentArray.length: ${mapExtentArray.length}, mapExtentArrayPosition: ${mapExtentArrayPosition}`);
                    // Enable the previous extent button
                    const previousExtentButton_node = document.getElementById(elementIDs.extentnavigatorPreviousExtentButtonID);
                    if (mapExtentArrayPosition > 1) {
                        ariaDisable(previousExtentButton_node, [css_esri.esri_disabled], false);
                    }
                    else {
                        ariaDisable(previousExtentButton_node, [css_esri.esri_disabled], true);
                    }
                    // Disable the next extent button
                    const nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID);
                    if (nextExtentButton_node.ariaDisabled === "false") {
                        ariaDisable(nextExtentButton_node, [css_esri.esri_disabled], true);
                    }
                }
                else {
                    navButtonClicked = false;
                }
            }
            return "";
        });
    }
    render() {
        return (tsx("div", { id: elementIDs.extentnavigatorID, className: this.classes(css_esri.esri_component, css_esri.esri_widget, alignmentClass), afterCreate: this.setInitialRender, bind: this },
            tsx("div", { id: elementIDs.extentnavigatorPreviousExtentButtonID, role: "button", className: this.classes(css_esri.esri_widget_button, css_esri.esri_widget, css.default.widget_extentnavigator_previous_extent__button), "aria-label": t9n.previousExtentButtonText, title: t9n.previousExtentButtonText, onClick: this._previousExtent_click.bind(this), onKeyPress: this._previousExtent_keypress.bind(this), tabIndex: "0" },
                tsx("span", { id: elementIDs.extentnavigatorPreviousExtentSpanID, "aria-hidden": 'true', className: this.classes(css_esri.esri_icon, css_esri.esri_icon_previous_extent) }),
                tsx("span", { className: css_esri.esri_icon_font_fallback_text }, t9n.previousExtentButtonText)),
            tsx("div", { id: elementIDs.extentnavigatorNextExtentButtonID, role: "button", className: this.classes(css_esri.esri_widget_button, css_esri.esri_widget, css.default.widget_extentnavigator_next_extent__button), "aria-label": t9n.nextExtentButtonText, title: t9n.nextExtentButtonText, onClick: this._nextExtent_click.bind(this), onKeyPress: this._nextExtent_keypress.bind(this), tabIndex: "0" },
                tsx("span", { id: elementIDs.extentnavigatorNextExtentSpanID, "aria-hidden": 'true', className: this.classes(css_esri.esri_icon, css_esri.esri_icon_next_extent) }),
                tsx("span", { className: css_esri.esri_icon_font_fallback_text }, t9n.nextExtentButtonText))));
    }
    //--------------------------------------------------------------------------
    //  Private Methods
    //--------------------------------------------------------------------------
    _previousExtent_click(e) {
        const previousExtentButton_node = document.getElementById(elementIDs.extentnavigatorPreviousExtentButtonID);
        if (previousExtentButton_node.ariaDisabled === "true") {
            e.preventDefault();
        }
        else {
            const nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID);
            mapExtentArrayPosition -= 1;
            navButtonClicked = true;
            this.gotoExtent(nextExtentButton_node, previousExtentButton_node, mapExtentArray[mapExtentArrayPosition - 1].extent);
        }
    }
    _previousExtent_keypress(e) {
        const isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
        const isSpacePressed = e.key === 'Space' || e.keyCode === 32;
        if (isEnterPressed || isSpacePressed) {
            const previousExtentButton_node = document.getElementById(elementIDs.extentnavigatorPreviousExtentButtonID);
            if (previousExtentButton_node.ariaDisabled === "true") {
                e.preventDefault();
            }
            else {
                const nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID);
                mapExtentArrayPosition -= 1;
                navButtonClicked = true;
                this.gotoExtent(nextExtentButton_node, previousExtentButton_node, mapExtentArray[mapExtentArrayPosition - 1].extent);
            }
        }
    }
    _nextExtent_click(e) {
        const nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID);
        if (nextExtentButton_node.ariaDisabled === "true") {
            e.preventDefault();
        }
        else {
            const previousExtentButton_node = document.getElementById(elementIDs.extentnavigatorPreviousExtentButtonID);
            mapExtentArrayPosition += 1;
            navButtonClicked = true;
            this.gotoExtent(nextExtentButton_node, previousExtentButton_node, mapExtentArray[mapExtentArrayPosition - 1].extent);
        }
    }
    _nextExtent_keypress(e) {
        const isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
        const isSpacePressed = e.key === 'Space' || e.keyCode === 32;
        if (isEnterPressed || isSpacePressed) {
            const nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID);
            if (nextExtentButton_node.ariaDisabled === "true") {
                e.preventDefault();
            }
            else {
                const previousExtentButton_node = document.getElementById(elementIDs.extentnavigatorPreviousExtentButtonID);
                mapExtentArrayPosition += 1;
                navButtonClicked = true;
                this.gotoExtent(nextExtentButton_node, previousExtentButton_node, mapExtentArray[mapExtentArrayPosition - 1].extent);
            }
        }
    }
    setInitialRender() {
        const previousExtentButton_node = document.getElementById(elementIDs.extentnavigatorPreviousExtentButtonID);
        const nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID);
        ariaDisable(previousExtentButton_node, [css_esri.esri_disabled], true);
        ariaDisable(nextExtentButton_node, [css_esri.esri_disabled], true);
    }
    gotoExtent(forwardButton_node, reverseButton_node, extent) {
        // Disable the reverse extent button if you reach the start of the extent array
        // console.log(`Navigation: mapExtentArray.length: ${mapExtentArray.length}, mapExtentArrayPosition: ${mapExtentArrayPosition}`);
        if (mapExtentArrayPosition > 1) {
            ariaDisable(reverseButton_node, [css_esri.esri_disabled], false);
        }
        else {
            ariaDisable(reverseButton_node, [css_esri.esri_disabled], true);
        }
        // Disable the forward extent button if you reach the end of the extent array
        if (mapExtentArrayPosition === mapExtentArray.length) {
            ariaDisable(forwardButton_node, [css_esri.esri_disabled], true);
        }
        else {
            ariaDisable(forwardButton_node, [css_esri.esri_disabled], false);
        }
        // Go to the extent.
        self.view.goTo(extent).catch((error) => {
            console.error(error);
        });
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