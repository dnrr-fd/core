// @ts-check
import React from 'react';

import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import MapView from "@arcgis/core/views/MapView";
import FeatureTable from "@arcgis/core/widgets/FeatureTable";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import SketchViewModel from "@arcgis/core/widgets/Sketch/SketchViewModel";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as intl from "@arcgis/core/intl";
import { getWidgetTheme, getFocusableElements } from "@dnrr_fd/util/web";
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
import { SearchFieldSelectObjects, AdvancedSearchLayer, GraphicalSearchOptions } from "../class/_AdvancedSearch";
import { setupFeatureLayer, initializeFeatureTable, processFSOArray, selectFeatures, setSearchFieldsVisibility, selectFeaturesUsingGeometry } from "./AdvancedSearchViewModel";
import { clearFeatureTable, setCurrentSearchLayerIndex, featureLayerReferences } from "./AdvancedSearchViewModel";

// Import Assets
import * as css from './assets/css/advancedsearch.module.css';
import * as calcite_dark from './assets/css/dark/calcite.module.css';
import * as calcite_light from './assets/css/light/calcite.module.css';

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'

export var _locale: string;
export var t9n = t9n_en;
export var featureLayerArray: Array<FeatureLayer>;

var calcite_theme = calcite_dark;

var resultsTable: FeatureTable;
var searchLayers: tsx.JSX.Element;
var searchFields: tsx.JSX.Element;
var _searchFieldSelectObjectsArray: Array<SearchFieldSelectObjects>;

var byShapeGraphicsLayer = new GraphicsLayer();
var byShapeSketchViewModel: SketchViewModel;

const css_esri = {
  esri_widget: 'esri-widget',
  esri_component: 'esri-component',
  esri_interactive: 'esri-interactive',
  esri_button: 'esri-button',
  esri_button_third: 'esri-button--third',
  esri_button_tertiary: 'esri-button--tertiary',
  esri_button_disabled: 'esri-button--disabled',
  esri_widget_button: 'esri-widget--button',
  esri_widget_anchor: 'esri-widget__anchor',
  esri_input: 'esri-input',
  esri_select: 'esri-select',
  esri_icon_draw_rectangle: 'esri-icon-checkbox-unchecked',
  esri_icon_draw_polygon: 'esri-icon-polygon',
  esri_icon_draw_circle: 'esri-icon-radio-unchecked',
  esri_icon_draw_polyline: 'esri-icon-polyline',
  esri_icon_draw_point: 'esri-icon-map-pin',
  esri_icon_maximize: 'esri-icon-maximize',
  esri_icon_minimize: 'esri-icon-minimize',
  esri_icon_close: 'esri-icon-close',
  esri_icon_down: 'esri-icon-down',
  esri_icon_up: 'esri-icon-up',
  esri_icon_erase: 'esri-icon-erase',
  esri_icon_swap: 'esri-icon-swap',
  esri_expand__container: 'esri-expand__container',
  esri_icon: 'esri-icon',
  esri_icon_font_fallback_text: 'esri-icon-font-fallback-text'
};

export const elementIDs = {
  esriThemeID: "esriThemeID",
  advancedsearch_ModalID: "advancedsearch_ModalID",
  advancedsearch_MainID: "advancedsearch_MainID",
  advancedSearch_TitlebarDivID: "advancedSearch_TitlebarDivID",
  advancedSearch_TitlebarTitleDivID: "advancedSearch_TitlebarTitleDivID",
  advancedSearch_TitlebarTitleSpanID: "advancedSearch_TitlebarTitleSpanID",
  advancedSearch_TitlebarButtonsDivID: "advancedSearch_TitlebarButtonsDivID",
  advancedSearch_CloseButtonID: "advancedSearch_CloseButtonID",
  advancedSearch_CloseSpanID: "advancedSearch_CloseSpanID",
  advancedSearch_MinimizeButtonID: "advancedSearch_MinimizeButtonID",
  advancedSearch_MinimizeSpanID: "advancedSearch_MinimizeSpanID",
  advancedSearch_MaximizeButtonID: "advancedSearch_MaximizeButtonID",
  advancedSearch_MaximizeSpanID: "advancedSearch_MaximizeSpanID",
  advancedsearch_content: "advancedsearch_content",
  advancedsearch_CommonBarID: "advancedsearch_CommonBarID",
  advancedsearch_CommonBarSearchLayerID: "advancedsearch_CommonBarSearchLayerID",
  advancedsearch_CommonBarSelectionTypeID: "advancedsearch_CommonBarSelectionTypeID",
  advancedSearch_CommonBarSelectionClearButtonID: "advancedSearch_CommonBarSelectionClearButtonID",
  advancedSearch_CommonBarSelectionSwapButtonID: "advancedSearch_CommonBarSelectionSwapButtonID",
  advancedsearch_CommonBarSelectionZoomToFirstRecordCheckboxID: "advancedsearch_CommonBarSelectionZoomToFirstRecordCheckboxID",
  advancedsearch_MainTabcontentID: "advancedsearch_MainTabcontentID",
  advancedsearch_ByShapeTabID: "advancedsearch_ByShapeTabID",
  advancedSearch_ByShapeButton_rectangleID: "advancedSearch_ByShapeButton_rectangleID",
  advancedSearch_ByShapeButton_polygonID: "advancedSearch_ByShapeButton_polygonID",
  advancedSearch_ByShapeButton_circleID: "advancedSearch_ByShapeButton_circleID",
  advancedSearch_ByShapeButton_polylineID: "advancedSearch_ByShapeButton_polylineID",
  advancedSearch_ByShapeButton_pointID: "advancedSearch_ByShapeButton_pointID",
  advancedsearch_ByValueTabID: "advancedsearch_ByValueTabID",
  advancedsearch_ResultsTabID: "advancedsearch_ResultsTabID",
  advancedsearch_ByShapeTabDivID: "advancedsearch_ByShapeTabDivID",
  advancedsearch_ByValueTabDivID: "advancedsearch_ByValueTabDivID",
  advancedsearch_ResultsTabDivID: "advancedsearch_ResultsTabDivID",
  advancedsearch_ResultsNoResultsDivID: "advancedsearch_ResultsNoResultsDivID",
  advancedsearch_ResultsDetailsDivID: "advancedsearch_ResultsDetailsDivID",
  advancedsearch_ByValueSearchButtonID: "advancedsearch_ByValueSearchButtonID",
  advancedsearch_ByValueResultsExtentCheckboxID: "advancedsearch_ByValueResultsExtentCheckboxID"
};

export const selectTypeOptions = {
  newSelection: "newSelection",
  addToSelection: "addToSelection",
  removeFromSelection: "removeFromSelection",
  subsetOfSelection: "subsetOfSelection"
};

export const postFixes = {
  featureLayerID: "_asID",
  layerDivID: "_divID",
  layerFieldDivID: "_divID",
  layerFieldInputID: "_inputID",
  layerFieldDataListID: "_datalistID",
  layerFieldHiddenInputID: "_hiddeninputID",
  layerFieldValidationDivID: "_validationID",
  layerFieldValidationAsterixDivID: "_validationAsterixID"
}

interface AdvancedSearchParams extends __esri.WidgetProperties {
  view: MapView;
  layers: Array<AdvancedSearchLayer>;
  zoomtosearchresults?: boolean;
  graphicalsearchoptions?: GraphicalSearchOptions;
  rootFocusElement: string;
  addMissingSearchLayers?: boolean;
}

@subclass("esri.widgets.advancedsearch")
class AdvancedSearch extends Widget {

  constructor(params?: AdvancedSearchParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  view!: MapView;

  @property()
  layers!: Array<AdvancedSearchLayer>;

  @property()
  zoomtosearchresults!: boolean;

  @property()
  graphicalsearchoptions!: GraphicalSearchOptions;

  @property()
  rootFocusElement!: string;

  @property()
  addMissingSearchLayers!: boolean;

  @property()
  theme!: 'light'|'dark';

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------
  async postInitialize() {
    await this.PreLoad().then(searchFieldSelectObjectsArray => {
      console.log(`searchFieldSelectObjectsArray: ${searchFieldSelectObjectsArray}`);
      this.Load();
    });
  }

  async PreLoad (): Promise<Array<SearchFieldSelectObjects>> {
    return new Promise(resolve => {
      // Get the unique values for all layers to populate the select.
      processFSOArray(this.layers).then(results => {
        _searchFieldSelectObjectsArray = results as Array<SearchFieldSelectObjects>;

        // Dynamically create search fields.
        searchFields = this.layers.map(layer =>
          <div key={`${layer.id}_key`} id={`${layer.id}${postFixes.layerDivID}`} class={this.classes(css.default.widget_advancedsearch_byvalue_searchfield__div)}>
            {layer.searchfields.map(searchfield => 
              <div key={`${layer.id}_${searchfield.field}_key`} id={`${layer.id}_${searchfield.field}${postFixes.layerFieldDivID}`} class={css.default.widget_advancedsearch_byvalue_searchfield_fieldsnovalidation__div}>
                <div class={css.default.widget_advancedsearch_byvalue_searchfield_fields__div}>
                  <div class={css.default.widget_advancedsearch_byvalue_searchfield_fields_items__div}>
                    <div class={css.default.widget_advancedsearch_byvalue_searchfield_fields_label__div}>
                      <label for={`${layer.id}_${searchfield.field}${postFixes.layerFieldInputID}`}>{searchfield.fieldlabel[_locale as keyof typeof searchfield.fieldlabel]}</label>
                    </div>
                    <div class={css.default.widget_advancedsearch_byvalue_fieldinput_asterix__div}>
                      <input id={`${layer.id}_${searchfield.field}${postFixes.layerFieldInputID}`} class={this.classes(css_esri.esri_input, css.default.widget_advancedsearch__select, `${searchfield.required? css.default.widget_advancedsearch_required__input: ""}`)} list={`${layer.id}_${searchfield.field}${postFixes.layerFieldDataListID}`} placeholder={searchfield.searchhint? searchfield.searchhint: ""} required={searchfield.required? searchfield.required===true? `"${searchfield.required}"`: "false": "false"}></input>
                      <datalist id={`${layer.id}_${searchfield.field}${postFixes.layerFieldDataListID}`}>
                        {_searchFieldSelectObjectsArray[_searchFieldSelectObjectsArray.map(function(e) { return e.layerID; }).indexOf(layer.id)].selectObjects[_searchFieldSelectObjectsArray[_searchFieldSelectObjectsArray.map(function(e) { return e.layerID; }).indexOf(layer.id)].selectObjects.map(function(e) { return e.fieldID; }).indexOf(searchfield.field)].options.map(option => option)}
                      </datalist>
                      <div id={`${layer.id}_${searchfield.field}${postFixes.layerFieldValidationAsterixDivID}`} class={this.classes(css.default.widget_advancedsearch_error__div, css.default.widget_advancedsearch_error__asterix, css.default.widget_advancedsearch_visible__none)}>*</div>
                      <input type="hidden" id={`${layer.id}_${searchfield.field}${postFixes.layerFieldHiddenInputID}`} ></input>
                    </div>
                  </div>
                </div>
                <div id={`${layer.id}_${searchfield.field}${postFixes.layerFieldValidationDivID}`} class={this.classes(css.default.widget_advancedsearch_error__div, css.default.widget_advancedsearch_visible__none)}></div>
              </div>
            )}
          </div>
        );
        resolve(_searchFieldSelectObjectsArray);
      });
    });
  }

  async Load() {
    t9n = (_locale === 'en' ? t9n_en : t9n_fr);

    this.zoomtosearchresults = this.zoomtosearchresults? this.zoomtosearchresults: true;
    this.graphicalsearchoptions = this.graphicalsearchoptions? this.graphicalsearchoptions: new GraphicalSearchOptions();

    this.addMissingSearchLayers = this.addMissingSearchLayers? this.addMissingSearchLayers: true;

    this.label = t9n.label;

    //Set the initial theme
    this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme) as 'light'|'dark';
    calcite_theme = (this.theme === 'dark' ? calcite_dark : calcite_light);
    
    intl.onLocaleChange(function(locale) {
      t9n = (locale === 'en' ? t9n_en : t9n_fr);
    });

    this.watch("theme", function(theme_new: string, theme_old: string){
      calcite_theme = (theme_new === 'dark' ? calcite_dark : calcite_light);
    });

    // Dynamically create search layers.
    searchLayers = this.layers.map(layer =>
        <option key={`${layer.id}_sl_key`} value={layer.id} title={layer.searchlayertitletext[_locale as keyof typeof layer.searchlayertitletext]}>{layer.searchlayerlabel[_locale as keyof typeof layer.searchlayerlabel]}</option>
    );

    // Set up the sketch view models for the select by shape section
    byShapeGraphicsLayer.title = t9n.sketchLayerTitle;
    byShapeSketchViewModel = new SketchViewModel({
      view: this.view,
      layer: byShapeGraphicsLayer
    });

    byShapeSketchViewModel.on("create", async (event) => {
      if (event.state === "complete") {
        // Remove the focus from all the tools
        let toolsArray = ["rectangle", "polygon", "circle", "polyline", "point"];
        let tool_node: HTMLElement;
        toolsArray.forEach(t => {
          tool_node = document.getElementById(`advancedSearch_ByShapeButton_${t}ID`)!;
          tool_node.classList.remove(css.default.widget_advancedsearch_byshape__button_focus);
        })
            // Empty the graphics layer and remove it from the map
        byShapeGraphicsLayer.removeAll();
        this.view.map.remove(byShapeGraphicsLayer);
        console.log(`Select by ${event.tool} is ${event.state}.`);

        let modal_node = document.getElementById(elementIDs.advancedsearch_ModalID)!;
        this.toggleNode(modal_node, false)
    
        await selectFeaturesUsingGeometry(this.view, this.layers, event.graphic.geometry, resultsTable).then(result => {
          resultsTable.refresh();
          if (result != null) {
            if (result.resultsCount === 0) {
              // No records were returned. Clear the results table of previous results.
              this.clearResults();
              // Change the title
              this.setTitle(t9n.label, `${t9n.resultsNoResultsLabel}`);
    
            } else {
              // Change the title
              this.setTitle(null, `${result.layerTitle} (${result.resultsCount} ${t9n.resultsTabLabel})`);
    
            }
            this.toggleNode(modal_node, true)
    
            this._resultsTab_click();
                  
            // Get focusable elements
            getFocusableElements(document.getElementById(this.rootFocusElement)!);
          }
        });
      }
    });
  }

  render() {
    return (
      <div>
        <div id={elementIDs.advancedsearch_ModalID} class={this.classes(css.default.widget_advancedsearch_loading_modal, css.default.widget_advancedsearch_loading_modal__restored, css.default.widget_advancedsearch_visibility__hidden, calcite_theme.default["modal-background"])}>
          <div class={this.classes(calcite_theme.default.loader, calcite_theme.default["is-active"], calcite_theme.default["padding-leader-3"], calcite_theme.default["padding-trailer-3"])}>
            <div class={calcite_theme.default["loader-bars"]}></div>
            <div class={calcite_theme.default["loader-text"]} ariaLabel={t9n.loadingText}>{t9n.loadingText}</div>
          </div>
        </div>
        <div class={this.classes(css_esri.esri_widget, css_esri.esri_component)}>
          <div id={elementIDs.advancedsearch_MainID} class={this.classes(css.default.widget_advancedsearch, css.default.widget_advancedsearch__restored, css_esri.esri_widget, css_esri.esri_component, css.default.widget_advancedsearch_transition)} afterCreate={this.afterRenderActions} bind={this}>
            <div class={css.default.widget_advancedsearch_main__div}>
              <div id={elementIDs.advancedSearch_TitlebarDivID} class={css.default.widget_advancedsearch_titlebar__div}>
                <div id={elementIDs.advancedSearch_TitlebarTitleDivID} class={css.default.widget_advancedsearch_titlebar_title__div}>
                    <span id={elementIDs.advancedSearch_TitlebarTitleSpanID}></span>
                </div>

                <div id={elementIDs.advancedSearch_TitlebarButtonsDivID} class={css.default.widget_advancedsearch_titlebar_buttons__div}>
                  <button id={elementIDs.advancedSearch_MinimizeButtonID} type="button" class={this.classes(css_esri.esri_button_tertiary, css.default.widget_advancedsearch_titlebar__button)} ariaLabel={t9n.minimizeButtonText} title={t9n.minimizeButtonText} onclick={this._minimizeButton_click.bind(this)} onkeypress={this._minimizeButton_keypress.bind(this)} tabindex="0">
                    <span id={elementIDs.advancedSearch_MinimizeSpanID} aria-hidden='true' class={css_esri.esri_icon_down} />
                  </button>
                  <button id={elementIDs.advancedSearch_MaximizeButtonID} type="button" class={this.classes(css_esri.esri_button_tertiary, css.default.widget_advancedsearch_titlebar__button)} ariaLabel={t9n.maximizeButtonText} title={t9n.maximizeButtonText} onclick={this._maximizeButton_click.bind(this)} onkeypress={this._maximizeButton_keypress.bind(this)} tabindex="0">
                    <span id={elementIDs.advancedSearch_MaximizeSpanID} aria-hidden='true' class={css_esri.esri_icon_maximize} />
                  </button>
                  <button id={elementIDs.advancedSearch_CloseButtonID} type="button" class={this.classes(css_esri.esri_button_tertiary, css.default.widget_advancedsearch_titlebar__button)} ariaLabel={t9n.closeButtonText} title={t9n.closeButtonText} onclick={this._closeButton_click.bind(this)} onkeypress={this._closeButton_keypress.bind(this)} tabindex="0">
                    <span id={elementIDs.advancedSearch_CloseSpanID} aria-hidden='true' class={css_esri.esri_icon_close} />
                  </button>
                </div>

              </div>
              <div id={elementIDs.advancedsearch_content}>
                <div class={css.default.widget_advancedsearch_tab__div}>
                  <button id={elementIDs.advancedsearch_ByShapeTabID}
                    class={this.classes(css.default.widget_advancedsearch_tab__button, css_esri.esri_widget_button)}
                    title={t9n.byShapeTabLabel}
                    ariaLabel={t9n.byShapeTabLabel}
                    onclick={this._byShapeTab_click.bind(this)}
                    tabindex="0"
                  >{t9n.byShapeTabLabel}</button>
                  <button id={elementIDs.advancedsearch_ByValueTabID}
                    class={this.classes(css.default.widget_advancedsearch_tab__button, css_esri.esri_widget_button)}
                    title={t9n.byValueTabLabel}
                    ariaLabel={t9n.byValueTabLabel}
                    onclick={this._byValueTab_click.bind(this)}
                    tabindex="0"
                  >{t9n.byValueTabLabel}</button>
                  <button id={elementIDs.advancedsearch_ResultsTabID}
                    class={this.classes(css.default.widget_advancedsearch_tab__button, css_esri.esri_widget_button)}
                    title={t9n.resultsTabLabel}
                    ariaLabel={t9n.resultsTabLabel}
                    onclick={this._resultsTab_click.bind(this)}
                    tabindex="0"
                  >{t9n.resultsTabLabel}</button>
                </div>

                <div id={elementIDs.advancedsearch_MainTabcontentID} class={this.classes(css.default.widget_advancedsearch_tabcontent_main__div, css.default.widget_advancedsearch_tabcontent_main__restored)}>
                  <div id={elementIDs.advancedsearch_CommonBarID} class={css.default.widget_advancedsearch_commonbar__div}>
                    <div class={css.default.widget_advancedsearch_commonbar_searchlayer__div}>
                      <label for={elementIDs.advancedsearch_CommonBarSearchLayerID}>{t9n.commonSearchLayerLabel}</label>
                      <select id={elementIDs.advancedsearch_CommonBarSearchLayerID} class={this.classes(css_esri.esri_input, css.default.widget_advancedsearch__select)} name={elementIDs.advancedsearch_CommonBarSearchLayerID} onchange={this._searchLayer_change.bind(this)}>
                        {searchLayers}
                      </select>
                    </div>
                    <div class={css.default.widget_advancedsearch_commonbar_selectiontype__div}>
                      <label for={elementIDs.advancedsearch_CommonBarSelectionTypeID}>{t9n.commonSelectTypeLabel}</label>
                      <select id={elementIDs.advancedsearch_CommonBarSelectionTypeID} class={this.classes(css_esri.esri_input, css.default.widget_advancedsearch__select)} name={elementIDs.advancedsearch_CommonBarSelectionTypeID} onchange={this._selectionType_change.bind(this)}>
                        <option value={selectTypeOptions.newSelection}>{t9n.commonSelectTypeNewLabel}</option>
                        <option value={selectTypeOptions.addToSelection}>{t9n.commonSelectTypeAddLabel}</option>
                        <option value={selectTypeOptions.removeFromSelection}>{t9n.commonSelectTypeRemoveLabel}</option>
                        <option value={selectTypeOptions.subsetOfSelection}>{t9n.commonSelectTypeSubsetLabel}</option>
                      </select>
                    </div>
                    <div class={css.default.widget_advancedsearch_commonbar_selection_buttons__div}>
                      {/* <div class={css_esri.esri_widget}>
                        <div
                            id={elementIDs.advancedSearch_CommonBarSelectionClearButtonID}
                            class={this.classes(css_esri.esri_widget_button, css_esri.esri_widget, css.default.widget_advancedsearch_commonbar_selection_clear__button)}
                            role="button"
                            aria-label={t9n.commonSelectClearText}
                            title={t9n.commonSelectClearText}
                            onclick={this._selectionClearButton_click.bind(this)}
                            onkeypress={this._selectionClearButton_keypress.bind(this)}
                            tabindex="0">
                          <span class={this.classes(css_esri.esri_icon, css_esri.esri_icon_erase)} aria-hidden="true"></span>
                          <span class={css_esri.esri_icon_font_fallback_text}>{t9n.commonSelectClearText}</span>
                        </div>
                      </div> */}
                      <button id={elementIDs.advancedSearch_CommonBarSelectionClearButtonID} type="button" class={this.classes(css_esri.esri_widget_button, css.default.widget_advancedsearch_commonbar_selection_clear__button)} ariaLabel={t9n.commonSelectClearText} title={t9n.commonSelectClearText} onclick={this._selectionClearButton_click.bind(this)} onkeypress={this._selectionClearButton_keypress.bind(this)} tabindex="0">
                        <span aria-hidden='true' class={css_esri.esri_icon_erase} />
                      </button>
                      {/* <button id={elementIDs.advancedSearch_CommonBarSelectionSwapButtonID} type="button" class={this.classes(css_esri.esri_widget_button, css.default.widget_advancedsearch_commonbar_selection_swap__button)} ariaLabel={t9n.commonSelectSwapText} title={t9n.commonSelectSwapText} onclick={this._selectionSwapButton_click.bind(this)} onkeypress={this._selectionSwapButton_keypress.bind(this)} tabindex="0">
                        <span aria-hidden='true' class={css_esri.esri_icon_swap} />
                      </button> */}
                      <div class={css.default.widget_advancedsearch_commonbar_selection_checkbox__div}>
                        <input id={elementIDs.advancedsearch_CommonBarSelectionZoomToFirstRecordCheckboxID}
                          class={this.classes(css_esri.esri_input, css.default.widget_advancedsearch_checkbox__input)}
                          type="checkbox"
                          checked>
                        </input>
                        <label for={elementIDs.advancedsearch_CommonBarSelectionZoomToFirstRecordCheckboxID} class={css.default.widget_advancedsearch_checkbox__label}>{t9n.commonSelectZoomFirstRecordLabel}</label>
                      </div>
                    </div>
                  </div>



                  <div id={elementIDs.advancedsearch_ByShapeTabDivID} class={this.classes(css.default.widget_advancedsearch_tabcontent__div)}>
                    {/* <h3>{t9n.byShapeHeaderLabel}</h3> */}

                    <div class={css.default.widget_advancedsearch_byshape_main__div}>

                      <div class={css_esri.esri_widget}>
                        <div
                            id={elementIDs.advancedSearch_ByShapeButton_rectangleID}
                            class={this.classes(css_esri.esri_widget_button, css_esri.esri_widget, css.default.widget_advancedsearch_byshape__button)}
                            role="button"
                            aria-label={t9n.byShapeRectangle}
                            title={t9n.byShapeRectangle}
                            onclick={(e: MouseEvent) => {this._selectByTool_click(e, "rectangle")}}
                            onkeypress={(e: KeyboardEvent) => {this._selectByTool_keypress(e, "rectangle")}}
                            tabindex="0">
                          <span class={this.classes(css_esri.esri_icon, css_esri.esri_icon_draw_rectangle)} aria-hidden="true"></span>
                          <span class={css_esri.esri_icon_font_fallback_text}>{t9n.byShapeRectangle}</span>
                        </div>
                      </div>

                      {/* <button
                          id={elementIDs.advancedSearch_ByShapeRectangleButtonID}
                          class={css.default.widget_advancedsearch_byshape__button}
                          type="button"
                          ariaLabel={t9n.byShapeRectangle}
                          title={t9n.byShapeRectangle}
                          onclick={(e: MouseEvent) => {this._selectByTool_click(e, "rectangle")}}
                          onkeypress={(e: KeyboardEvent) => {this._selectByTool_keypress(e, "rectangle")}}
                          tabindex="0">
                        <span aria-hidden='true' class={this.classes(css_esri.esri_icon, css_esri.esri_icon_draw_rectangle)} />
                        <span class={css_esri.esri_icon_font_fallback_text}>{t9n.byShapeRectangle}</span>
                      </button> */}

                      <div class={css_esri.esri_widget}>
                        <div
                            id={elementIDs.advancedSearch_ByShapeButton_polygonID}
                            class={this.classes(css_esri.esri_widget_button, css_esri.esri_widget, css.default.widget_advancedsearch_byshape__button)}
                            role="button"
                            aria-label={t9n.byShapePolygon}
                            title={t9n.byShapePolygon}
                            onclick={(e: MouseEvent) => {this._selectByTool_click(e, "polygon")}}
                            onkeypress={(e: KeyboardEvent) => {this._selectByTool_keypress(e, "polygon")}}
                            tabindex="0">
                          <span class={this.classes(css_esri.esri_icon, css_esri.esri_icon_draw_polygon)} aria-hidden="true"></span>
                          <span class={css_esri.esri_icon_font_fallback_text}>{t9n.byShapePolygon}</span>
                        </div>
                      </div>

                      <div class={css_esri.esri_widget}>
                        <div
                            id={elementIDs.advancedSearch_ByShapeButton_circleID}
                            class={this.classes(css_esri.esri_widget_button, css_esri.esri_widget, css.default.widget_advancedsearch_byshape__button)}
                            role="button"
                            aria-label={t9n.byShapeCircle}
                            title={t9n.byShapeCircle}
                            onclick={(e: MouseEvent) => {this._selectByTool_click(e, "circle")}}
                            onkeypress={(e: KeyboardEvent) => {this._selectByTool_keypress(e, "circle")}}
                            tabindex="0">
                          <span class={this.classes(css_esri.esri_icon, css_esri.esri_icon_draw_circle)} aria-hidden="true"></span>
                          <span class={css_esri.esri_icon_font_fallback_text}>{t9n.byShapeCircle}</span>
                        </div>
                      </div>

                      <div class={css_esri.esri_widget}>
                        <div
                            id={elementIDs.advancedSearch_ByShapeButton_polylineID}
                            class={this.classes(css_esri.esri_widget_button, css_esri.esri_widget, css.default.widget_advancedsearch_byshape__button)}
                            role="button"
                            aria-label={t9n.byShapePolyline}
                            title={t9n.byShapePolyline}
                            onclick={(e: MouseEvent) => {this._selectByTool_click(e, "polyline")}}
                            onkeypress={(e: KeyboardEvent) => {this._selectByTool_keypress(e, "polyline")}}
                            tabindex="0">
                          <span class={this.classes(css_esri.esri_icon, css_esri.esri_icon_draw_polyline)} aria-hidden="true"></span>
                          <span class={css_esri.esri_icon_font_fallback_text}>{t9n.byShapePolyline}</span>
                        </div>
                      </div>

                      <div class={css_esri.esri_widget}>
                        <div
                            id={elementIDs.advancedSearch_ByShapeButton_pointID}
                            class={this.classes(css_esri.esri_widget_button, css_esri.esri_widget, css.default.widget_advancedsearch_byshape__button)}
                            role="button"
                            aria-label={t9n.byShapePoint}
                            title={t9n.byShapePoint}
                            onclick={(e: MouseEvent) => {this._selectByTool_click(e, "point")}}
                            onkeypress={(e: KeyboardEvent) => {this._selectByTool_keypress(e, "point")}}
                            tabindex="0">
                          <span class={this.classes(css_esri.esri_icon, css_esri.esri_icon_draw_point)} aria-hidden="true"></span>
                          <span class={css_esri.esri_icon_font_fallback_text}>{t9n.byShapePoint}</span>
                        </div>
                      </div>

                    </div>

                  </div>



                  <div id={elementIDs.advancedsearch_ByValueTabDivID} class={this.classes(css.default.widget_advancedsearch_tabcontent__div, css.default.widget_advancedsearch_visible__none)}>
                    {/* <h3>{t9n.byValueHeaderLabel}</h3> */}

                    <div class={css.default.widget_advancedsearch_byvalue_searchfields__div}>
                      {searchFields}
                    </div>

                    <div class={css.default.widget_advancedsearch_byvalue_search_group__div}>
                      <div class={css.default.widget_advancedsearch_byvalue_search__div}>
                        <button id={elementIDs.advancedsearch_ByValueSearchButtonID} type="button" class={this.classes(css_esri.esri_button)} aria-label={t9n.byValueSearchButtonLabel} title={t9n.byValueSearchButtonLabel} onclick={this._searchButton_click.bind(this)} onkeypress={this._searchButton_keypress.bind(this)} tabindex="0">
                          {t9n.byValueSearchButtonLabel}
                        </button>
                      </div>
                      <div class={css.default.widget_advancedsearch_checkbox__div}>
                        <input id={elementIDs.advancedsearch_ByValueResultsExtentCheckboxID}
                          class={this.classes(css_esri.esri_input, css.default.widget_advancedsearch_checkbox__input)}
                          type="checkbox"
                          checked>
                        </input>
                        <label for={elementIDs.advancedsearch_ByValueResultsExtentCheckboxID} class={css.default.widget_advancedsearch_checkbox__label}>{t9n.byValueLimitResultsExtentLabel}</label>
                      </div>
                    </div>

                  </div>
                </div>
                
                
                <div id={elementIDs.advancedsearch_ResultsTabDivID} class={this.classes(css.default.widget_advancedsearch_tabcontent__div, css.default.widget_advancedsearch_tabcontent_results__restored, css.default.widget_advancedsearch_visible__none)}>
                  <div id={elementIDs.advancedsearch_ResultsNoResultsDivID} class={css.default.widget_advancedsearch_tabcontent_resultsnoresults__div}>{t9n.resultsNoResultsLabel}</div>
                  <div id={elementIDs.advancedsearch_ResultsDetailsDivID} class={this.classes(css.default.widget_advancedsearch_tabcontent_resultsdetails__div, css.default.widget_advancedsearch_tabcontent_resultsdetails__restored)}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //  Event Methods
  //--------------------------------------------------------------------------
  private _selectByTool_click (e: MouseEvent, tool: "rectangle"|"polygon"|"circle"|"polyline"|"point") {
    e.preventDefault();

    if (!this.view.map.layers.includes(byShapeGraphicsLayer)) {
      this.view.map.add(byShapeGraphicsLayer);
    }

    // Keep focus on the tool while graphic is being drawn.
    let toolsArray = ["rectangle", "polygon", "circle", "polyline", "point"];
    let tool_node: HTMLElement;
    toolsArray.forEach(t => {
      tool_node = document.getElementById(`advancedSearch_ByShapeButton_${t}ID`)!;
      if (t === tool) {
        tool_node.classList.add(css.default.widget_advancedsearch_byshape__button_focus);
      } else {
        tool_node.classList.remove(css.default.widget_advancedsearch_byshape__button_focus);
      }
    })
    
    byShapeSketchViewModel.create(tool);
  }
  
  private _selectByTool_keypress(e: KeyboardEvent, tool: "rectangle"|"polygon"|"circle"|"polyline"|"point") {
    let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      e.preventDefault();

      if (!this.view.map.layers.includes(byShapeGraphicsLayer)) {
        this.view.map.add(byShapeGraphicsLayer);
      }

      // Keep focus on the tool while graphic is being drawn.
      let toolsArray = ["rectangle", "polygon", "circle", "polyline", "point"];
      let tool_node: HTMLElement;
      toolsArray.forEach(t => {
        tool_node = document.getElementById(`advancedSearch_ByShapeButton_${t}ID`)!;
        if (t === tool) {
          tool_node.classList.add(css.default.widget_advancedsearch_byshape__button_focus);
        } else {
          tool_node.classList.remove(css.default.widget_advancedsearch_byshape__button_focus);
        }
      })
    
      byShapeSketchViewModel.create(tool);
    }
  }

  private _closeButton_click (e: MouseEvent) {
    e.preventDefault();
    this.closeWidget();
  }
  
  private _closeButton_keypress(e: KeyboardEvent) {
    let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      e.preventDefault();
      this.closeWidget();
    }
  }

  private _maximizeButton_click (e: MouseEvent) {
    e.preventDefault();
    this.maximizeWidget();
  }
  
  private _maximizeButton_keypress(e: KeyboardEvent) {
    let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      e.preventDefault();
      this.maximizeWidget();
    }
  }

  private _minimizeButton_click (e: MouseEvent) {
    e.preventDefault();
    this.minimizeWidget();
  }
  
  private _minimizeButton_keypress(e: KeyboardEvent) {
    let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      e.preventDefault();
      this.minimizeWidget();
    }
  }

  private _byShapeTab_click() {
    let commonBarDiv_node = document.getElementById(elementIDs.advancedsearch_CommonBarID)!;

    let byShapeDiv_node = document.getElementById(elementIDs.advancedsearch_ByShapeTabDivID)!;
    let byShapeButton_node = document.getElementById(elementIDs.advancedsearch_ByShapeTabID)!;
    byShapeButton_node.setAttribute("style", "border-bottom: none;");

    let byValueDiv_node = document.getElementById(elementIDs.advancedsearch_ByValueTabDivID)!;
    let byValueButton_node = document.getElementById(elementIDs.advancedsearch_ByValueTabID)!;
    byValueButton_node.removeAttribute("style");

    let resultsDiv_node = document.getElementById(elementIDs.advancedsearch_ResultsTabDivID)!;
    let resultsButton_node = document.getElementById(elementIDs.advancedsearch_ResultsTabID)!;
    resultsButton_node.removeAttribute("style");

    let mainTabcontentDiv_node = document.getElementById(elementIDs.advancedsearch_MainTabcontentID)!;
    mainTabcontentDiv_node.classList.remove(css.default.widget_advancedsearch_visible__none);

    commonBarDiv_node.classList.remove(css.default.widget_advancedsearch_visible__none);
    byShapeDiv_node.classList.remove(css.default.widget_advancedsearch_visible__none);
    byValueDiv_node.classList.add(css.default.widget_advancedsearch_visible__none);
    resultsDiv_node.classList.add(css.default.widget_advancedsearch_visible__none);
  
    // Get focusable elements
    getFocusableElements(document.getElementById(this.rootFocusElement)!);

}

  private _byValueTab_click() {
    let commonBarDiv_node = document.getElementById(elementIDs.advancedsearch_CommonBarID)!;

    let byShapeDiv_node = document.getElementById(elementIDs.advancedsearch_ByShapeTabDivID)!;
    let byShapeButton_node = document.getElementById(elementIDs.advancedsearch_ByShapeTabID)!;
    byShapeButton_node.removeAttribute("style");

    let byValueDiv_node = document.getElementById(elementIDs.advancedsearch_ByValueTabDivID)!;
    let byValueButton_node = document.getElementById(elementIDs.advancedsearch_ByValueTabID)!;
    byValueButton_node.setAttribute("style", "border-bottom: none;");

    let resultsDiv_node = document.getElementById(elementIDs.advancedsearch_ResultsTabDivID)!;
    let resultsButton_node = document.getElementById(elementIDs.advancedsearch_ResultsTabID)!;
    resultsButton_node.removeAttribute("style");

    let mainTabcontentDiv_node = document.getElementById(elementIDs.advancedsearch_MainTabcontentID)!;
    mainTabcontentDiv_node.classList.remove(css.default.widget_advancedsearch_visible__none);

    commonBarDiv_node.classList.remove(css.default.widget_advancedsearch_visible__none);
    byValueDiv_node.classList.remove(css.default.widget_advancedsearch_visible__none);
    byShapeDiv_node.classList.add(css.default.widget_advancedsearch_visible__none);
    resultsDiv_node.classList.add(css.default.widget_advancedsearch_visible__none);

    // Get focusable elements
    getFocusableElements(document.getElementById(this.rootFocusElement)!);

  }

  private _resultsTab_click() {
    // let commonBarDiv_node = document.getElementById(elementIDs.advancedsearch_CommonBarID)!;

    // let byShapeDiv_node = document.getElementById(elementIDs.advancedsearch_ByShapeTabDivID)!;
    let byShapeButton_node = document.getElementById(elementIDs.advancedsearch_ByShapeTabID)!;
    byShapeButton_node.removeAttribute("style");

    // let byValueDiv_node = document.getElementById(elementIDs.advancedsearch_ByValueTabDivID)!;
    let byValueButton_node = document.getElementById(elementIDs.advancedsearch_ByValueTabID)!;
    byValueButton_node.removeAttribute("style");

    let resultsDiv_node = document.getElementById(elementIDs.advancedsearch_ResultsTabDivID)!;
    let resultsButton_node = document.getElementById(elementIDs.advancedsearch_ResultsTabID)!;
    resultsButton_node.setAttribute("style", "border-bottom: none;");

    let mainTabcontentDiv_node = document.getElementById(elementIDs.advancedsearch_MainTabcontentID)!;
    mainTabcontentDiv_node.classList.add(css.default.widget_advancedsearch_visible__none);
    resultsDiv_node.classList.remove(css.default.widget_advancedsearch_visible__none);
    // byValueDiv_node.classList.add(css.default.widget_advancedsearch_visible__none);
    // byShapeDiv_node.classList.add(css.default.widget_advancedsearch_visible__none);

    // Get focusable elements
    getFocusableElements(document.getElementById(this.rootFocusElement)!);
  }

  private _selectionClearButton_click(e: MouseEvent) {
    e.preventDefault();

    this.clearResults();
  }

  private _selectionClearButton_keypress(e: KeyboardEvent) {
    let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      e.preventDefault();

      this.clearResults();
    }
  }

  // private _selectionSwapButton_click(e: MouseEvent) {
  //   e.preventDefault();
    
  // }

  // private _selectionSwapButton_keypress(e: KeyboardEvent) {
  //   let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
  //   let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

  //   if (isEnterPressed || isSpacePressed) {
  //     e.preventDefault();

  //   }
  // }

  private async _searchButton_click(e: MouseEvent) {
    e.preventDefault();

    let modal_node = document.getElementById(elementIDs.advancedsearch_ModalID)!;
    this.toggleNode(modal_node, false)

    await selectFeatures(this.view, this.layers, _searchFieldSelectObjectsArray, resultsTable).then(result => {
      resultsTable.refresh();
      if (result != null) {
        if (result.resultsCount === 0) {
          // No records were returned. Clear the results table of previous results.
          this.clearResults();
          // Change the title
          this.setTitle(t9n.label, `${t9n.resultsNoResultsLabel}`);

        } else {
          // Change the title
          this.setTitle(null, `${result.layerTitle} (${result.resultsCount} ${t9n.resultsTabLabel})`);

        }
        this.toggleNode(modal_node, true)

        this._resultsTab_click();
              
        // Get focusable elements
        getFocusableElements(document.getElementById(this.rootFocusElement)!);
      } else {
        // Validation error.
      }
    });
  }

  private async _searchButton_keypress(e: KeyboardEvent) {
    let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      e.preventDefault();
  
      let modal_node = document.getElementById(elementIDs.advancedsearch_ModalID)!;
      this.toggleNode(modal_node, false)

      await selectFeatures(this.view, this.layers, _searchFieldSelectObjectsArray, resultsTable).then(result => {
        resultsTable.refresh();
        if (result != null) {
          if (result.resultsCount === 0) {
            // No records were returned. Clear the results table of previous results.
            this.clearResults();
            // Change the title
            this.setTitle(t9n.label, `${t9n.resultsNoResultsLabel}`);
  
          } else {
            // Change the title
            this.setTitle(null, `${result.layerTitle} (${result.resultsCount} ${t9n.resultsTabLabel})`);
  
          }
          this.toggleNode(modal_node, true)
  
          this._resultsTab_click();
                
          // Get focusable elements
          getFocusableElements(document.getElementById(this.rootFocusElement)!);
        } else {
          // Validation error.
        }
      });
    }
  }

  private _searchLayer_change() {
    setSearchFieldsVisibility();
  }

  private _selectionType_change() {
    let commonBarSelectionType_node = document.getElementById(elementIDs.advancedsearch_CommonBarSelectionTypeID) as HTMLSelectElement;
    console.log(`Selection Type: ${commonBarSelectionType_node.value}`);
  }

  //--------------------------------------------------------------------------
  //  Private Methods
  //--------------------------------------------------------------------------
  private afterRenderActions() {
    _locale = getNormalizedLocale();

    let resultsDiv_node = document.getElementById(elementIDs.advancedsearch_ResultsDetailsDivID) as HTMLDivElement;
    let modal_node = document.getElementById(elementIDs.advancedsearch_ModalID)!;

    // Change the title
    this.setTitle(t9n.label);

    window.addEventListener("resize", this.setTitle);

    this.toggleNode(modal_node, true)

    resultsTable = initializeFeatureTable(this.view, resultsDiv_node, resultsTable);
    resultsTable.visible = false;

    let byShapeButton_node = document.getElementById(elementIDs.advancedsearch_ByShapeTabID)!;
    byShapeButton_node.setAttribute("style", "border-bottom: none;");

    setSearchFieldsVisibility();

    featureLayerArray = new Array<FeatureLayer>();

    // Set up event listeners for data lists.
    this.layers.forEach(async layer => {
      // If the layers listed in the config file aren't in the map, add them.
      let asID = `${layer.id}${postFixes.featureLayerID}`;
      await setupFeatureLayer(this.view, layer, asID).then(featureLayer => {
        console.log(`featureLayerReferences - afterRenderActions(): ${featureLayerReferences}`);
        if (featureLayer != null) {
          featureLayer.title = `${layer.searchlayerlabel[_locale as keyof typeof layer.searchlayerlabel]}`;
          featureLayerArray.push(featureLayer);
          layer.searchfields.forEach(searchfield => {
            let input_node = document.getElementById(`${layer.id}_${searchfield.field}${postFixes.layerFieldInputID}`)! as HTMLInputElement;
            // inputArray.push(input_node);
            if(input_node) {
              input_node.addEventListener('input', function() {
                let inputValue = input_node.value;
                let hiddeninput_node = document.getElementById(`${layer.id}_${searchfield.field}${postFixes.layerFieldHiddenInputID}`)! as HTMLInputElement;
                let options = document.querySelectorAll(`#${input_node.getAttribute('list')} option`) as NodeListOf<HTMLOptionElement>;
    
                hiddeninput_node.value = inputValue;
    
                for (var i=0; i<options.length; i++) {
                  var option = options[i];
          
                  if(option.innerText === inputValue) {
                    if (option.getAttribute('data-value')) {
                      hiddeninput_node.value = option.getAttribute('data-value') as string;
                      console.log(`${hiddeninput_node.id} was changed to: ${hiddeninput_node.value}`);
                      break;
                    }
                  }
                }
              });
            }
          });
        }
      }).then(() => {
        console.log(`featureLayerArray: ${featureLayerArray.map(function (fl: any) { return fl.uid; })}`);
      });
    });
    setCurrentSearchLayerIndex(0);
  }

  private closeWidget() {
    this.visible = false;
    let content_node = this.container as HTMLDivElement;
    if (content_node.style.display === "") {
      content_node.setAttribute("style", "display: none;");
    }
    window.removeEventListener("resize", this.setTitle);
  }

  private toggleNode(node: HTMLElement, minimize: boolean) {
    if (minimize === true) {
      node.classList.add(css.default.widget_advancedsearch_visibility__hidden);
    } else {
      node.classList.remove(css.default.widget_advancedsearch_visibility__hidden);
    }
  }

  private clearResults() {
    let resultsNoResultsDiv_node = document.getElementById(elementIDs.advancedsearch_ResultsNoResultsDivID) as HTMLDivElement;

    // Clear and hide the feature table
    clearFeatureTable(resultsTable)
    resultsTable.visible = false;
    resultsTable.layer = featureLayerArray[0]
    setCurrentSearchLayerIndex(0);

    // Show the No Results. node.
    resultsNoResultsDiv_node.classList.remove(css.default.widget_advancedsearch_visible__none);

    // Reset any previous field inputs.
    this.layers.forEach(layer => {
      layer.searchfields.forEach(searchfield => {
        let input_node = document.getElementById(`${layer.id}_${searchfield.field}${postFixes.layerFieldInputID}`)! as HTMLInputElement;
        let hiddeninput_node = document.getElementById(`${layer.id}_${searchfield.field}${postFixes.layerFieldHiddenInputID}`)! as HTMLInputElement;
        if (input_node && input_node.value != "") {
          let in_value = input_node.value;
          let hin_value = hiddeninput_node.value;
          
          input_node.value = "";
          hiddeninput_node.value = "";

          console.log(`Input node ${input_node.id} changed from ${in_value} to ${input_node.value}.`);
          console.log(`Hidden input node ${hiddeninput_node.id} changed from ${hin_value} to ${hiddeninput_node.value}.`);
        }
      })
    });

    // Reset the Search Layer.
    let searchLayer = "";
    let commonBarSearchLayer_node = document.getElementById(elementIDs.advancedsearch_CommonBarSearchLayerID) as HTMLSelectElement;
    for (let i=0; i<commonBarSearchLayer_node.options.length; i++) {
      if (i === 0) {
        commonBarSearchLayer_node.options[i].selected = true;
        searchLayer = commonBarSearchLayer_node.options[i].value;

        // Assign the initial layer to the feature table.
        let slID = `${searchLayer}${postFixes.featureLayerID}`;
        this.view.map.allLayers.forEach(maplayer => {
          if (maplayer.id.toLowerCase() === slID.toLowerCase()) {
            console.log(`Fetaure table layer will change from ${resultsTable.layer.id} to ${maplayer.id}`);
            resultsTable.layer = maplayer as FeatureLayer;
          }
        });
      } else {
        commonBarSearchLayer_node.options[i].selected = false;
      }
    }
    setSearchFieldsVisibility();

    // Reset the Selection Type.
    let commonBarSelectionType_node = document.getElementById(elementIDs.advancedsearch_CommonBarSelectionTypeID) as HTMLSelectElement;
    for (let i=0; i<commonBarSelectionType_node.options.length; i++) {
      if (i === 0) {
        commonBarSelectionType_node.options[i].selected = true;
      } else {
        commonBarSelectionType_node.options[i].selected = false;
      }
    }

    // Reset the zoom to first result checkbox to its default
    let zoomToFirstRecordCheckbox_node = document.getElementById(elementIDs.advancedsearch_CommonBarSelectionZoomToFirstRecordCheckboxID) as HTMLInputElement
    zoomToFirstRecordCheckbox_node.checked = true;
    
    // Reset the extent checkbox to its default
    let extentCheckbox_node = document.getElementById(elementIDs.advancedsearch_ByValueResultsExtentCheckboxID) as HTMLInputElement
    extentCheckbox_node.checked = true;
    
    // Change the title
    this.setTitle(t9n.label);
  }

  private maximizeWidget() {
    let loadingModal_node = document.getElementById(elementIDs.advancedsearch_ModalID)!;
    let resultsTableDiv_node = document.getElementById(elementIDs.advancedsearch_ResultsTabDivID)!;
    let resultsDetailsTableDiv_node = document.getElementById(elementIDs.advancedsearch_ResultsDetailsDivID)!;
    let main_node = document.getElementById(elementIDs.advancedsearch_MainID)!;
    let mainTabcontentDiv_node = document.getElementById(elementIDs.advancedsearch_MainTabcontentID)!;

    let maximizeButton_node = document.getElementById(elementIDs.advancedSearch_MaximizeButtonID)!;
    let maximizeSpan_node = document.getElementById(elementIDs.advancedSearch_MaximizeSpanID)!;

    let minimizeButton_node = document.getElementById(elementIDs.advancedSearch_MinimizeButtonID)!;
    let minimizeSpan_node = document.getElementById(elementIDs.advancedSearch_MinimizeSpanID)!;

    let content_node = document.getElementById(elementIDs.advancedsearch_content)!;

    // Check if the main_node was minimized
    if (main_node.classList.contains(css.default.widget_advancedsearch__minimized) === true) {
      // Make the main content visible again
      this.toggleNode(content_node, false);

      // Change the minimize button icon
      minimizeSpan_node.classList.remove(css_esri.esri_icon_up);
      minimizeSpan_node.classList.add(css_esri.esri_icon_down);
      minimizeButton_node.title = t9n.minimizeButtonText;
      minimizeButton_node.ariaLabel = t9n.minimizeButtonText;
    }

    if (maximizeSpan_node.classList.contains(css_esri.esri_icon_maximize)) {
      main_node.classList.remove(css.default.widget_advancedsearch__restored);
      main_node.classList.remove(css.default.widget_advancedsearch__minimized);
      main_node.classList.add(css.default.widget_advancedsearch__maximized);

      maximizeSpan_node.classList.remove(css_esri.esri_icon_maximize);
      maximizeSpan_node.classList.add(css_esri.esri_icon_minimize);
      maximizeButton_node.title = t9n.restoreButtonText;
      maximizeButton_node.ariaLabel = t9n.restoreButtonText;

      mainTabcontentDiv_node.classList.remove(css.default.widget_advancedsearch_tabcontent_main__restored);
      mainTabcontentDiv_node.classList.add(css.default.widget_advancedsearch_tabcontent_main__maximized);
      resultsDetailsTableDiv_node.classList.remove(css.default.widget_advancedsearch_tabcontent_resultsdetails__restored);
      resultsDetailsTableDiv_node.classList.add(css.default.widget_advancedsearch_tabcontent_resultsdetails__maximized);
      resultsTableDiv_node.classList.remove(css.default.widget_advancedsearch_tabcontent_results__restored);
      resultsTableDiv_node.classList.add(css.default.widget_advancedsearch_tabcontent_results__maximized);
      loadingModal_node.classList.remove(css.default.widget_advancedsearch_loading_modal__restored);
      loadingModal_node.classList.add(css.default.widget_advancedsearch_loading_modal__maximized);

    } else {
      main_node.classList.remove(css.default.widget_advancedsearch__maximized);
      main_node.classList.remove(css.default.widget_advancedsearch__minimized);
      main_node.classList.add(css.default.widget_advancedsearch__restored);

      maximizeSpan_node.classList.remove(css_esri.esri_icon_minimize);
      maximizeSpan_node.classList.add(css_esri.esri_icon_maximize);
      maximizeButton_node.title = t9n.maximizeButtonText;
      maximizeButton_node.ariaLabel = t9n.maximizeButtonText;

      mainTabcontentDiv_node.classList.remove(css.default.widget_advancedsearch_tabcontent_main__maximized);
      mainTabcontentDiv_node.classList.add(css.default.widget_advancedsearch_tabcontent_main__restored);
      resultsDetailsTableDiv_node.classList.remove(css.default.widget_advancedsearch_tabcontent_resultsdetails__maximized);
      resultsDetailsTableDiv_node.classList.add(css.default.widget_advancedsearch_tabcontent_resultsdetails__restored);
      resultsTableDiv_node.classList.remove(css.default.widget_advancedsearch_tabcontent_results__maximized);
      resultsTableDiv_node.classList.add(css.default.widget_advancedsearch_tabcontent_results__restored);
      loadingModal_node.classList.remove(css.default.widget_advancedsearch_loading_modal__maximized);
      loadingModal_node.classList.add(css.default.widget_advancedsearch_loading_modal__restored);

    }
  }

  private minimizeWidget() {
    let loadingModal_node = document.getElementById(elementIDs.advancedsearch_ModalID)!;
    let resultsTableDiv_node = document.getElementById(elementIDs.advancedsearch_ResultsTabDivID)!;
    let resultsDetailsTableDiv_node = document.getElementById(elementIDs.advancedsearch_ResultsDetailsDivID)!;
    let main_node = document.getElementById(elementIDs.advancedsearch_MainID)!;
    let mainTabcontentDiv_node = document.getElementById(elementIDs.advancedsearch_MainTabcontentID)!;

    let maximizeButton_node = document.getElementById(elementIDs.advancedSearch_MaximizeButtonID)!;
    let maximizeSpan_node = document.getElementById(elementIDs.advancedSearch_MaximizeSpanID)!;

    let minimizeButton_node = document.getElementById(elementIDs.advancedSearch_MinimizeButtonID)!;
    let minimizeSpan_node = document.getElementById(elementIDs.advancedSearch_MinimizeSpanID)!;

    let content_node = document.getElementById(elementIDs.advancedsearch_content)!;

    // Check if the main_node was maximized
    if (maximizeSpan_node.classList.contains(css_esri.esri_icon_minimize)) {
      // Change the maximize button icon
      maximizeSpan_node.classList.remove(css_esri.esri_icon_minimize);
      maximizeSpan_node.classList.add(css_esri.esri_icon_maximize);
      maximizeButton_node.title = t9n.maximizeButtonText;
      maximizeButton_node.ariaLabel = t9n.maximizeButtonText;
    }

    if (minimizeSpan_node.classList.contains(css_esri.esri_icon_down)) {
      // Hide the main content
      this.toggleNode(content_node, true);

      main_node.classList.remove(css.default.widget_advancedsearch__restored);
      main_node.classList.remove(css.default.widget_advancedsearch__maximized);
      main_node.classList.add(css.default.widget_advancedsearch__minimized);

      minimizeSpan_node.classList.remove(css_esri.esri_icon_down);
      minimizeSpan_node.classList.add(css_esri.esri_icon_up);
      minimizeButton_node.title = t9n.restoreButtonText;
      minimizeButton_node.ariaLabel = t9n.restoreButtonText;

      mainTabcontentDiv_node.classList.remove(css.default.widget_advancedsearch_tabcontent_main__restored);
      mainTabcontentDiv_node.classList.remove(css.default.widget_advancedsearch_tabcontent_main__maximized);
      resultsDetailsTableDiv_node.classList.remove(css.default.widget_advancedsearch_tabcontent_resultsdetails__restored);
      resultsDetailsTableDiv_node.classList.remove(css.default.widget_advancedsearch_tabcontent_resultsdetails__maximized);
      resultsTableDiv_node.classList.remove(css.default.widget_advancedsearch_tabcontent_results__restored);
      resultsTableDiv_node.classList.remove(css.default.widget_advancedsearch_tabcontent_results__maximized);
      loadingModal_node.classList.remove(css.default.widget_advancedsearch_loading_modal__maximized);
      loadingModal_node.classList.remove(css.default.widget_advancedsearch_loading_modal__restored);

    } else {
      // Make the main content visible again
      this.toggleNode(content_node, false);

      main_node.classList.remove(css.default.widget_advancedsearch__maximized);
      main_node.classList.remove(css.default.widget_advancedsearch__minimized);
      main_node.classList.add(css.default.widget_advancedsearch__restored);

      minimizeSpan_node.classList.remove(css_esri.esri_icon_up);
      minimizeSpan_node.classList.add(css_esri.esri_icon_down);
      minimizeButton_node.title = t9n.minimizeButtonText;
      minimizeButton_node.ariaLabel = t9n.minimizeButtonText;

      mainTabcontentDiv_node.classList.add(css.default.widget_advancedsearch_tabcontent_main__restored);
      resultsDetailsTableDiv_node.classList.add(css.default.widget_advancedsearch_tabcontent_resultsdetails__restored);
      resultsTableDiv_node.classList.add(css.default.widget_advancedsearch_tabcontent_results__restored);
      loadingModal_node.classList.add(css.default.widget_advancedsearch_loading_modal__restored);
    }
  }

  private setTitle(widgetLabel=null as string|Event|null, title=null as string|null) {
    let titlebarDiv_node = document.getElementById(elementIDs.advancedSearch_TitlebarDivID)!;
    let titlebarButtonsDiv_node = document.getElementById(elementIDs.advancedSearch_TitlebarButtonsDivID)!;
    let titlebarTitleSpan_node = document.getElementById(elementIDs.advancedSearch_TitlebarTitleSpanID)!;

    let buttonsDivNodeWidth = titlebarButtonsDiv_node.offsetWidth;
    let combinedTitle = "";

    if (widgetLabel instanceof Event) {
      combinedTitle = titlebarTitleSpan_node.ariaLabel? titlebarTitleSpan_node.ariaLabel: t9n.label? t9n.label: "";
    } else {

      if (title && widgetLabel) {
        combinedTitle = `${widgetLabel} - ${title}`;
      } else if (title && !widgetLabel) {
        combinedTitle = `${title}`;
      } else if (!title && widgetLabel) {
        combinedTitle = `${widgetLabel}`;
      } else {
        combinedTitle = t9n.label? t9n.label: "";
      }
      titlebarTitleSpan_node.ariaLabel = combinedTitle;
      titlebarTitleSpan_node.title = combinedTitle;
    }

    let combinedTitleWidth = getStringPixelWidth(combinedTitle);
    let t9nTitleWidth = getStringPixelWidth(t9n.label);

    // CHECK THAT WIDTHS MAKE SENSE OTHERWISE JUST PUT A SHORT TITLE.
    if (combinedTitleWidth) {
      if ((combinedTitleWidth + buttonsDivNodeWidth) > titlebarDiv_node.offsetWidth) {
        if ((combinedTitleWidth) > titlebarDiv_node.offsetWidth) {
          if (t9nTitleWidth) {
            if ((t9nTitleWidth + buttonsDivNodeWidth) > titlebarDiv_node.offsetWidth) {
              if (t9nTitleWidth > titlebarDiv_node.offsetWidth) {
                titlebarTitleSpan_node.innerHTML = "";
                titlebarTitleSpan_node.setAttribute("style", `margin-left: 0px;white-space: nowrap;`);
              } else {
                titlebarTitleSpan_node.innerHTML = t9n.label
                titlebarTitleSpan_node.setAttribute("style", `margin-left: 0px;white-space: nowrap;`);
              }

            } else {
              titlebarTitleSpan_node.innerHTML = t9n.label
              titlebarTitleSpan_node.setAttribute("style", `margin-left: ${buttonsDivNodeWidth}px;white-space: nowrap;`);
            }
          } else {
            titlebarTitleSpan_node.innerHTML = "";
            titlebarTitleSpan_node.setAttribute("style", `margin-left: 0px;white-space: nowrap;`);
          }
        } else {
          titlebarTitleSpan_node.innerHTML = combinedTitle;
          titlebarTitleSpan_node.setAttribute("style", `margin-left: 0px;white-space: nowrap;`);
        }
      } else {
        titlebarTitleSpan_node.innerHTML = combinedTitle;
        titlebarTitleSpan_node.setAttribute("style", `margin-left: ${buttonsDivNodeWidth}px;white-space: nowrap;`);
      }
    }

    function getStringPixelWidth(_string: string, referenceClassOrElement=".esri-widget" as string|HTMLElement): number|null {
      let style: CSSStyleDeclaration;
      let element: HTMLElement;
  
      if (typeof referenceClassOrElement ==="string" ) {
        element = document.querySelector(referenceClassOrElement)!;
      } else {
        element = referenceClassOrElement
      }
  
      if (element && (element instanceof HTMLElement === true)) {
        style = getComputedStyle(element, null);
  
        let font_weight,
            font_size,
            font_family = "";
        font_weight = style.getPropertyValue("font-weight");
        font_size = style.getPropertyValue("font-size");
        font_family = style.getPropertyValue("font-family");
  
        let font_style = `${font_weight} ${font_size} ${font_family}`;
        // console.log(`Calculated style: ${font_style}`)

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (context) {
          context.font = font_style;
          const metrics = context.measureText(_string);
          let width = Number(metrics.width.toFixed(0));
          // console.log(`Element width: ${width}`);

          return width;
        }
      } 
  
      return null;
    }
  }

}
export default AdvancedSearch;
