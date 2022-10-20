// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import { getNormalizedLocale } from "@dnrr_fd/util/locale";

// Import Assets
import * as css from '@dnrr_fd/core/widget/extentnavigator/assets/css/extentnavigator.module.css';

import * as t9n_en from '@dnrr_fd/core/widget/extentnavigator/assets/t9n/en.json'
import * as t9n_fr from '@dnrr_fd/core/widget/extentnavigator/assets/t9n/fr.json'
import MapView from "@arcgis/core/views/MapView";
import { MapExtentObject } from "@dnrr_fd/core/widget/class/_Map";
import { ariaDisable } from "@dnrr_fd/util";

var t9n = t9n_en;
var alignmentClass: string;

export var mapExtentArray = new Array<MapExtentObject>();

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

    var mapExtentObject = new MapExtentObject();

    // Watch for any changes in extent
    reactiveUtils.watch(
      () => !this.view.stationary,
      (stationary, wasStationary) => {
        if (wasStationary) {
          mapExtentObject.scale = this.view.scale;
          mapExtentObject.extent = this.view.extent;
          console.log(`New Extent Object:`);
          console.log(mapExtentObject.toString());
          mapExtentArray.push(mapExtentObject);
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
      // this.addURLServiceToMap(urlValue);
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
        // this.addURLServiceToMap(urlValue);
      }
      }
  }

  private _nextExtent_click(e: MouseEvent) {
    let nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID)!;
    if (nextExtentButton_node.ariaDisabled === "true") {
      e.preventDefault();
    } else {
      // this.addURLServiceToMap(urlValue);
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
        // this.addURLServiceToMap(urlValue);
      }
    }
  }

  private setInitialRender() {
    let previousExtentButton_node = document.getElementById(elementIDs.extentnavigatorPreviousExtentButtonID)!;
    let nextExtentButton_node = document.getElementById(elementIDs.extentnavigatorNextExtentButtonID)!;
    ariaDisable(previousExtentButton_node, [css_esri.esri_disabled], true);
    ariaDisable(nextExtentButton_node, [css_esri.esri_disabled], true);
  }
}
export default ExtentNavigator;