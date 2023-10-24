// @ts-check
import React from 'react';

import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import { getNormalizedLocale } from "@dnrr_fd/util/locale";

// Import Assets
import * as css from './assets/css/extentnavigator.module.css';

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'
import MapView from "@arcgis/core/views/MapView";
import { MapExtentObject } from "../class/_Map";
import { ariaDisable } from "@dnrr_fd/util";
import Extent from "@arcgis/core/geometry/Extent";

var t9n = t9n_en;
var alignmentClass: string;
var navButtonClicked = false;

var mapExtentArray = new Array<MapExtentObject>();
var mapExtentArrayPosition = 0;
var self: ExtentNavigator;

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

interface ExtentNavigatorParams extends __esri.WidgetProperties {
  horizontalAlignButtons?: boolean;
  view: MapView;
}

@subclass("esri.widgets.extentnavigator")
class ExtentNavigator extends Widget {

  constructor(params?: ExtentNavigatorParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  horizontalAlignButtons!: boolean;

  @property()
  view!: MapView;

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------
  postInitialize(): void {
    self = this;
    var _locale = getNormalizedLocale();

    if (_locale === "en") {
      t9n = t9n_en;
    } else {
      t9n = t9n_fr;
    }

    this.label = t9n.label;
    elementIDs.extentnavigatorID = this.id;

    intl.onLocaleChange(function(locale) {
      t9n = (locale === 'fr' ? t9n_fr : t9n_en);
    });

    alignmentClass = css.default.widget_extentnavigator_content_horizontal;
    if (this.horizontalAlignButtons === false) {
      alignmentClass = css.default.widget_extentnavigator_content_vertical;
    }

    // Watch for any changes in extent
    reactiveUtils.watch(
      () => !this.view.stationary,
      (stationary, wasStationary) => {
        if (wasStationary) {
          let mapExtentObject = new MapExtentObject();
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
            var ltp = mapExtentArray.length - mapExtentArrayPosition;
            if (ltp > 0) {
              for (let i=0; i<ltp; i++) {
                mapExtentArray.pop();
              }
            }

            mapExtentArray.push(mapExtentObject);
            mapExtentArrayPosition = mapExtentArray.length;
            // console.log(`After: mapExtentArray.length: ${mapExtentArray.length}, mapExtentArrayPosition: ${mapExtentArrayPosition}`);
            
            // Enable the previous extent button
            let previousExtentButton_node = document.getElementById(elementIDs.extentnavigatorPreviousExtentButtonID)!;
            if (mapExtentArrayPosition > 1) {
              ariaDisable(previousExtentButton_node, [css_esri.esri_disabled], false);
            } else {
              ariaDisable(previousExtentButton_node, [css_esri.esri_disabled], true);
            }

            // Disable the next extent button
            let nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID)!;
            if (nextExtentButton_node.ariaDisabled === "false") {
              ariaDisable(nextExtentButton_node, [css_esri.esri_disabled], true);
            }
          } else {
            navButtonClicked = false;
          }
        }
        return "";
      }
    );
  }

  render() {
    return (
      <div id={elementIDs.extentnavigatorID} class={this.classes(css_esri.esri_component, css_esri.esri_widget, alignmentClass)} afterCreate={this.setInitialRender} bind={this}>
        <div id={elementIDs.extentnavigatorPreviousExtentButtonID} role="button" class={this.classes(css_esri.esri_widget_button, css_esri.esri_widget, css.default.widget_extentnavigator_previous_extent__button)} ariaLabel={t9n.previousExtentButtonText} title={t9n.previousExtentButtonText} onclick={this._previousExtent_click.bind(this)} onkeypress={this._previousExtent_keypress.bind(this)} tabindex="0">
          <span id={elementIDs.extentnavigatorPreviousExtentSpanID} aria-hidden='true' class={this.classes(css_esri.esri_icon, css_esri.esri_icon_previous_extent)} />
          <span class={css_esri.esri_icon_font_fallback_text}>{t9n.previousExtentButtonText}</span>
        </div>
        <div id={elementIDs.extentnavigatorNextExtentButtonID} role="button" class={this.classes(css_esri.esri_widget_button, css_esri.esri_widget, css.default.widget_extentnavigator_next_extent__button)} ariaLabel={t9n.nextExtentButtonText} title={t9n.nextExtentButtonText} onclick={this._nextExtent_click.bind(this)} onkeypress={this._nextExtent_keypress.bind(this)} tabindex="0">
          <span id={elementIDs.extentnavigatorNextExtentSpanID} aria-hidden='true' class={this.classes(css_esri.esri_icon, css_esri.esri_icon_next_extent)} />
          <span class={css_esri.esri_icon_font_fallback_text}>{t9n.nextExtentButtonText}</span>
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //  Private Methods
  //--------------------------------------------------------------------------
  private _previousExtent_click(e: MouseEvent) {
    let previousExtentButton_node = document.getElementById(elementIDs.extentnavigatorPreviousExtentButtonID)!;
    if (previousExtentButton_node.ariaDisabled === "true") {
      e.preventDefault();
    } else {
      let nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID)!;
      mapExtentArrayPosition -= 1;
      navButtonClicked = true;
      this.gotoExtent(nextExtentButton_node, previousExtentButton_node, mapExtentArray[mapExtentArrayPosition-1].extent);
    }
  }

  private _previousExtent_keypress(e: KeyboardEvent) {
    let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      let previousExtentButton_node = document.getElementById(elementIDs.extentnavigatorPreviousExtentButtonID)!;
      if (previousExtentButton_node.ariaDisabled === "true") {
        e.preventDefault();
      } else {
        let nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID)!;
        mapExtentArrayPosition -= 1;
        navButtonClicked = true;
        this.gotoExtent(nextExtentButton_node, previousExtentButton_node, mapExtentArray[mapExtentArrayPosition-1].extent);
      }
    }
  }

  private _nextExtent_click(e: MouseEvent) {
    let nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID)!;
    if (nextExtentButton_node.ariaDisabled === "true") {
      e.preventDefault();
    } else {
      let previousExtentButton_node = document.getElementById(elementIDs.extentnavigatorPreviousExtentButtonID)!;
      mapExtentArrayPosition += 1;
      navButtonClicked = true;
      this.gotoExtent(nextExtentButton_node, previousExtentButton_node, mapExtentArray[mapExtentArrayPosition-1].extent);
    }
  }

  private _nextExtent_keypress(e: KeyboardEvent) {
    let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      let nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID)!;
      if (nextExtentButton_node.ariaDisabled === "true") {
        e.preventDefault();
      } else {
        let previousExtentButton_node = document.getElementById(elementIDs.extentnavigatorPreviousExtentButtonID)!;
        mapExtentArrayPosition += 1;
        navButtonClicked = true;
        this.gotoExtent(nextExtentButton_node, previousExtentButton_node, mapExtentArray[mapExtentArrayPosition-1].extent);
      }
    }
  }

  private setInitialRender() {
    let previousExtentButton_node = document.getElementById(elementIDs.extentnavigatorPreviousExtentButtonID)!;
    let nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID)!;
    ariaDisable(previousExtentButton_node, [css_esri.esri_disabled], true);
    ariaDisable(nextExtentButton_node, [css_esri.esri_disabled], true);
  }

  private gotoExtent(forwardButton_node: HTMLElement, reverseButton_node: HTMLElement, extent: Extent) {
    // Disable the reverse extent button if you reach the start of the extent array
    // console.log(`Navigation: mapExtentArray.length: ${mapExtentArray.length}, mapExtentArrayPosition: ${mapExtentArrayPosition}`);

    if (mapExtentArrayPosition > 1) {
      ariaDisable(reverseButton_node, [css_esri.esri_disabled], false);
    } else {
      ariaDisable(reverseButton_node, [css_esri.esri_disabled], true);
    }

    // Disable the forward extent button if you reach the end of the extent array
    if (mapExtentArrayPosition === mapExtentArray.length) {
      ariaDisable(forwardButton_node, [css_esri.esri_disabled], true);
    } else {
      ariaDisable(forwardButton_node, [css_esri.esri_disabled], false);
    }

    // Go to the extent.
    self.view.goTo(extent).catch((error) => {
      console.error(error);
    });
  }

}
export default ExtentNavigator;