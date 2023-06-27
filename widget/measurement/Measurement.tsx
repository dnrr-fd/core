// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import Measurement from "@arcgis/core/widgets/Measurement";
import MapView from "@arcgis/core/views/MapView";
import * as intl from "@arcgis/core/intl";
import { getWidgetTheme } from "@dnrr_fd/util/web";
import { getNormalizedLocale } from "@dnrr_fd/util/locale";


// Import Assets
import * as css from './assets/css/measurement.module.css';

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'

var t9n = t9n_en;

const measurement = new Measurement();


const css_esri = {
  esri_widget: 'esri-widget',
  esri_component: 'esri-component',
  esri_widget_button: 'esri-widget--button',
  esri_interactive: 'esri-interactive',
  esri_icon_measure_line: 'esri-icon-measure-line',
  esri_icon_measure_area: 'esri-icon-measure-area',
  esri_icon_trash: 'esri-icon-trash'
};

const elementIDs = {
  esriThemeID: "esriThemeID",
  measurement_MainID: "measurement_MainID",
  measurement_DistanceButtonID: "measurement_DistanceButtonID",
  measurement_AreaButtonID: "measurement_AreaButtonID",
  measurement_ClearButtonID: "measurement_ClearButtonID"
};

interface MeasurementDNRRParams extends __esri.WidgetProperties {
  measurement_map_location?: 'top-right'|'top-left'|'bottom-right'|'bottom-left';
  measurement_index_position?: number;
  view: MapView;
}

@subclass("esri.widgets.measurementdnrr")
class MeasurementDNRR extends Widget {

  constructor(params?: MeasurementDNRRParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  measurement_map_location!: 'top-right'|'top-left'|'bottom-right'|'bottom-left';

  @property()
  measurement_index_position!: number;

  @property()
  view!: MapView;

  @property()
  theme!: 'light'|'dark';

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------

  postInitialize(): void {
    var _locale = getNormalizedLocale();
    // console.log(`_LOCALE: ${_locale}`);

    if (_locale === "en") {
      t9n = t9n_en;
    } else {
      t9n = t9n_fr;
    }

    this.label = t9n.label;
    this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme) as 'light'|'dark';
  
    intl.onLocaleChange(function(locale) {
      t9n = (locale === 'fr' ? t9n_fr : t9n_en);
    });

    // Add the appropriate measurement UI to the bottom-right when activated
    this.view.ui.add({component: measurement, position: this.measurement_map_location, index: this.measurement_index_position});
    measurement.view = this.view;
  }

  render() {
    return (
      <div id={elementIDs.measurement_MainID} class={this.classes(css.default.widget_measurement, css_esri.esri_component, css_esri.esri_widget)}>
        <div class={css.default.widget_measurement_button__div}>
          <button id={elementIDs.measurement_DistanceButtonID}
            type="button"
            class={this.classes(css.default.widget_measurement_button, css_esri.esri_widget_button, css_esri.esri_interactive, css_esri.esri_icon_measure_line)}
            title={t9n.distanceButtonLabel}
            ariaLabel={t9n.distanceButtonLabel}
            onclick={this._measureDistance_click.bind(this)}
            tabindex="0"
          ></button>
        </div>
        <div class={css.default.widget_measurement_button__div}>
          <button id={elementIDs.measurement_AreaButtonID}
            type="button"
            class={this.classes(css.default.widget_measurement_button, css_esri.esri_widget_button, css_esri.esri_interactive, css_esri.esri_icon_measure_area)}
            title={t9n.areaButtonLabel}
            ariaLabel={t9n.areaButtonLabel}
            onclick={this._measureArea_click.bind(this)}
            tabindex="1"
          ></button>
        </div>
        <div class={css.default.widget_measurement_button__div}>
          <button id={elementIDs.measurement_ClearButtonID}
            type="button"
            class={this.classes(css.default.widget_measurement_button, css_esri.esri_widget_button, css_esri.esri_interactive, css_esri.esri_icon_trash, css.default.widget_measurement_clear__button)}
            title={t9n.clearButtonLabel}
            ariaLabel={t9n.clearButtonLabel}
            onclick={this._clearMeasurements_click.bind(this)}
            tabindex="2"
          ></button>
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //  Event Methods
  //--------------------------------------------------------------------------
  private _measureDistance_click() {
    measurement.activeTool = "distance";
    let distanceButton_node = document.getElementById(elementIDs.measurement_DistanceButtonID)!;
    let areaButton_node = document.getElementById(elementIDs.measurement_AreaButtonID)!;

    distanceButton_node.classList.add("active");
    distanceButton_node.classList.add(css.default.widget_measurement__button_focus);
    areaButton_node.classList.remove("active");
    areaButton_node.classList.remove(css.default.widget_measurement__button_focus);
  }

  private _measureArea_click() {
    measurement.activeTool = "area";
    let distanceButton_node = document.getElementById(elementIDs.measurement_DistanceButtonID)!;
    let areaButton_node = document.getElementById(elementIDs.measurement_AreaButtonID)!;
    
    distanceButton_node.classList.remove("active");
    distanceButton_node.classList.remove(css.default.widget_measurement__button_focus);
    areaButton_node.classList.add("active");
    areaButton_node.classList.add(css.default.widget_measurement__button_focus);
  }

  private _clearMeasurements_click() {
    this.clear();
  }

  //--------------------------------------------------------------------------
  //  Private Methods
  //--------------------------------------------------------------------------

  clear() {
    let distanceButton_node = document.getElementById(elementIDs.measurement_DistanceButtonID)!;
    let areaButton_node = document.getElementById(elementIDs.measurement_AreaButtonID)!;
    
    distanceButton_node.classList.remove("active");
    distanceButton_node.classList.remove(css.default.widget_measurement__button_focus);
    areaButton_node.classList.remove("active");
    areaButton_node.classList.remove(css.default.widget_measurement__button_focus);
    measurement.clear();
  }

}
export default MeasurementDNRR;
