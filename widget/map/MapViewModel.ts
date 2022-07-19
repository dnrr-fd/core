// @ts-check
import MapView from "@arcgis/core/views/MapView";
import { mapRootURL, mapParentElement } from "./Map"
import { MapWidget, ScaleBarWidget, LayerListWidget, MapWidgetLocale, MapWidgetSearch, SearchWidget } from "../class/_Map";
import { getNormalizedLocale } from '@dnrr_fd/util/locale'

import Expand from "@arcgis/core/widgets/Expand";
import Search from "@arcgis/core/widgets/Search";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";
import Home from "@arcgis/core/widgets/Home";
import Zoom from "@arcgis/core/widgets/Zoom";
import Locate from "@arcgis/core/widgets/Locate";
import Fullscreen from "@arcgis/core/widgets/Fullscreen";
import LayerList from "@arcgis/core/widgets/LayerList";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import PopupTemplate from "@arcgis/core/PopupTemplate";

// Import local assets
import * as searchT9n_en from '../search/assets/t9n/en.json'
import * as searchT9n_fr from '../search/assets/t9n/fr.json'
var search_defaultT9n = searchT9n_en;

// import * as scaleBarT9n_en from '../scalebar/assets/t9n/en.json'
// import * as scaleBarT9n_fr from '../scalebar/assets/t9n/fr.json'
// var scaleBar_defaultT9n = scaleBarT9n_en;

// import * as coordinateConversionT9n_en from '../coordinateconversion/assets/t9n/en.json'
// import * as coordinateConversionT9n_fr from '../coordinateconversion/assets/t9n/fr.json'
// var coordinateConversion_defaultT9n = coordinateConversionT9n_en;

// import * as homeT9n_en from '../home/assets/t9n/en.json'
// import * as homeT9n_fr from '../home/assets/t9n/fr.json'
// var home_defaultT9n = homeT9n_en;

// import * as zoomT9n_en from '../zoom/assets/t9n/en.json'
// import * as zoomT9n_fr from '../zoom/assets/t9n/fr.json'
// var zoom_defaultT9n = zoomT9n_en;

// import * as locateT9n_en from '../locate/assets/t9n/en.json'
// import * as locateT9n_fr from '../locate/assets/t9n/fr.json'
// var locate_defaultT9n = locateT9n_en;

// import * as fullscreenT9n_en from '../fullscreen/assets/t9n/en.json'
// import * as fullscreenT9n_fr from '../fullscreen/assets/t9n/fr.json'
// var fullscreen_defaultT9n = fullscreenT9n_en;

import * as layerListT9n_en from '../layerlist/assets/t9n/en.json'
import * as layerListT9n_fr from '../layerlist/assets/t9n/fr.json'
import { returnConfig } from "@dnrr_fd/util";
var layerList_defaultT9n = layerListT9n_en;


export var searchWidget = null as Search|null;
export var scaleBarWidget = null as ScaleBar|null;
export var coordinateConversionWidget = null as CoordinateConversion|null;
export var homeWidget = null as Home|null;
export var zoomWidget = null as Zoom|null;
export var locateWidget = null as Locate|null;
export var fullscreenWidget = null as Fullscreen|null;
export var layerListWidget = null as Expand|null;

var widgetsAssetsPath: string;
var lang: string;

export async function loadWidgetsIntoMap(_mapView: MapView, mapWidgetArray: Array<MapWidget|ScaleBarWidget|LayerListWidget>) {
    widgetsAssetsPath = `${mapRootURL}assets/widgets/`;
    lang = getNormalizedLocale();
    mapWidgetArray.forEach(widget => (async () => {
        if (widget.id && typeof widget.id === "string") {
            switch(widget.id.toUpperCase()) {
                case "SEARCH":
                    searchWidget = await addSearch(widget as SearchWidget, _mapView) as Search|null;
                    break;
                case "SCALEBAR":
                    scaleBarWidget = await addScaleBar(widget as ScaleBarWidget, _mapView) as ScaleBar|null;
                    break;
                case "COORDINATECONVERSION":
                    coordinateConversionWidget = await addCoordinateConversion(widget as MapWidget, _mapView) as CoordinateConversion|null;
                    break;
                case "HOME":
                    homeWidget = await addHome(widget as MapWidget, _mapView) as Home|null;
                    break;
                case "ZOOM":
                    zoomWidget = await addZoom(widget as MapWidget, _mapView) as Zoom|null;
                    break;
                case "LOCATE":
                    locateWidget = await addLocate(widget as MapWidget, _mapView) as Locate|null;
                    break;
                case "FULLSCREEN":
                    fullscreenWidget = await addFullscreen(widget as MapWidget, _mapView) as Fullscreen|null;
                    break;
                case "LAYERLIST":
                    layerListWidget = await addLayerList(widget as LayerListWidget, _mapView) as Expand|null;
                    break;
                default:
                    console.log(`Map Widget: ${widget.id} is not configured for this application!`);
            }
        } else {
            console.log("Improper configuration of a map widget! Please check the configuration file.");
        }
    })());
}

export function removeWidgetsFromMap(_mapView: MapView) {
    [ searchWidget,
      scaleBarWidget,
      coordinateConversionWidget,
      homeWidget,
      zoomWidget,
      locateWidget,
      fullscreenWidget,
      layerListWidget
    ].forEach(widget => {
        if (widget) {
            _mapView.ui.remove(widget)
        }
    });
}

async function addSearch(widget: SearchWidget, view: MapView){
    return new Promise(resolve => {
        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        var _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        var _search = new Search();

        returnConfig(configFile, null).then(config => {
            var searchT9nPath = widget.t9nPath? `${widget.t9nPath}/${lang}.json`: null as string|null;
            var sources = widget.sources? widget.sources: null as Array<{id: string, url: string, searchFields: Array<string>, outFields: Array<string>, exactMatch: boolean}>|null;
            var _visible = getWidgetConfigKeyValue(config as MapWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _label: string;
            var _allPlaceholder: string;
            var _t9nResults: MapWidgetSearch;
            returnConfig(searchT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = search_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults as MapWidgetSearch, "label", lang==="en"? "Search": "Rechercher") as string;
                _allPlaceholder = getWidgetLocaleConfigKeyValue(t9nResults as MapWidgetSearch, "allPlaceholder", lang==="en"? "Search": "Rechercher") as string;
                _t9nResults = t9nResults as MapWidgetSearch;
            }).then(function(){
                var sourcesT9n = _t9nResults.sources? _t9nResults.sources: null;
                _search.label = _label;
                _search.allPlaceholder = _allPlaceholder
                _search.view = view;
                _search.visible = _visible;

                // Add any sources using sources and t9n
                var _sources = new Array<any>();
                sources?.forEach(source => {
                    let _source = new Object();
                    if (source.url) {
                        let lyr = new FeatureLayer({
                            url: source.url
                        });
                        _source["searchFields"] = source.searchFields? source.searchFields: [];
                        _source["outFields"] = source.outFields? source.outFields: ["*"];
                        _source["exactMatch"] = source.exactMatch? source.exactMatch: false;
                        if (sourcesT9n) {
                            sourcesT9n.forEach(sourceT9n => {
                                if (sourceT9n.id.toLowerCase() === source.id.toLowerCase()) {
                                    _source["name"] = sourceT9n.label? sourceT9n.label: sourceT9n.id;
                                    _source["placeholder"] = sourceT9n.placeholder? sourceT9n.placeholder: sourceT9n.id;
                                    _source["suggestionTemplate"] = sourceT9n.suggestionTemplate? sourceT9n.suggestionTemplate: "";
                                    lyr.popupTemplate = {title: sourceT9n.popuptemplatetitle} as PopupTemplate;
                                }
                            })
                        }
                        _source["layer"] = lyr;
                        _sources.push(_source);
                    }
                });
    
                view.ui.add([
                    {
                        component: _search,
                        position: _position,
                        index: _index,
                        sources: _sources
                    }
                ]);
                resolve(_search);
            });
        });
    });
}

async function addScaleBar(widget: ScaleBarWidget, view: MapView){
    return new Promise(resolve => {
        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        var _position = getWidgetConfigKeyValue(widget, "map_location", "bottom-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        var _scaleBar = new ScaleBar();

        returnConfig(configFile, null).then(config => {
            var _visible = getWidgetConfigKeyValue(config as ScaleBarWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _unit = getWidgetConfigKeyValue(config as ScaleBarWidget, "unit", widget.unit? widget.unit: "dual") as "non-metric"|"metric"|"dual";
            var _style = getWidgetConfigKeyValue(config as ScaleBarWidget, "style", widget.unit? widget.unit: "line") as "ruler"|"line";

            _scaleBar.label = widget.id;
            _scaleBar.view = view;
            _scaleBar.visible = _visible;
            _scaleBar.unit = _unit;
            _scaleBar.style = _style;

            view.ui.add([
                {
                    component: _scaleBar,
                    position: _position,
                    index: _index
                }
            ]);
            resolve(_scaleBar);
        });
    });
}

async function addCoordinateConversion(widget: MapWidget, view: MapView){
    return new Promise(resolve => {
        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        var _position = getWidgetConfigKeyValue(widget, "map_location", "bottom-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        var _coordinateConversion = new CoordinateConversion();

        returnConfig(configFile, null).then(config => {
            var _visible = getWidgetConfigKeyValue(config as MapWidget, "visible", widget.visible? widget.visible: true) as boolean;

            _coordinateConversion.label = widget.id;
            _coordinateConversion.view = view;
            _coordinateConversion.visible = _visible;
            _coordinateConversion.headingLevel = 4;
            // _coordinateConversion.visibleElements.captureButton = false;
            // _coordinateConversion.visibleElements.editButton = false;
            // _coordinateConversion.visibleElements.expandButton = false;
            // _coordinateConversion.visibleElements.settingsButton = false;

            view.ui.add([
                {
                    component: _coordinateConversion,
                    position: _position,
                    index: _index
                }
            ]);
            resolve(_coordinateConversion);
        });
    });
}

async function addHome(widget: MapWidget, view: MapView){
    return new Promise(resolve => {
        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        var _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        var _home = new Home();

        returnConfig(configFile, null).then(config => {
            var _visible = getWidgetConfigKeyValue(config as MapWidget, "visible", widget.visible? widget.visible: true) as boolean;

            _home.label = widget.id;
            _home.view = view;
            _home.visible = _visible;

            view.ui.add([
                {
                    component: _home,
                    position: _position,
                    index: _index
                }
            ]);
            resolve(_home);
        });
    });
}

async function addZoom(widget: MapWidget, view: MapView){
    return new Promise(resolve => {
        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        var _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 1);
        var _zoom = new Zoom();

        returnConfig(configFile, null).then(config => {
            var _visible = getWidgetConfigKeyValue(config as MapWidget, "visible", widget.visible? widget.visible: true) as boolean;

            _zoom.label = widget.id;
            _zoom.view = view;
            _zoom.visible = _visible;

            view.ui.add([
                {
                    component: _zoom,
                    position: _position,
                    index: _index
                }
            ]);
            resolve(_zoom);
        });
    });
}

async function addLocate(widget: MapWidget, view: MapView){
    return new Promise(resolve => {
        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        var _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 2);
        var _locate = new Locate();

        returnConfig(configFile, null).then(config => {
            var _visible = getWidgetConfigKeyValue(config as MapWidget, "visible", widget.visible? widget.visible: true) as boolean;

            _locate.label = widget.id;
            _locate.view = view;
            _locate.visible = _visible;

            view.ui.add([
                {
                    component: _locate,
                    position: _position,
                    index: _index
                }
            ]);
            resolve(_locate);
        });
    });
}

async function addFullscreen(widget: MapWidget, view: MapView){
    return new Promise(resolve => {
        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        var _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 3);
        var _fullscreen = new Fullscreen();

        returnConfig(configFile, null).then(config => {
            var _visible = getWidgetConfigKeyValue(config as MapWidget, "visible", widget.visible? widget.visible: true) as boolean;

            _fullscreen.label = widget.id;
            _fullscreen.view = view;
            _fullscreen.visible = _visible;

            view.ui.add([
                {
                    component: _fullscreen,
                    position: _position,
                    index: _index
                }
            ]);
            resolve(_fullscreen);
        });
    });
}

async function addLayerList(widget: LayerListWidget, view: MapView){
    return new Promise(resolve => {
        // Get the default asset from language.
        layerList_defaultT9n = (lang === 'fr' ? layerListT9n_fr : layerListT9n_en);

        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        var _position = getWidgetConfigKeyValue(widget, "map_location", "top-left") as string;
        var _index = getWidgetConfigKeyValue(widget, "index_position", 4);

        var _layerList = new LayerList();
        var _layerList_expand = new Expand();

        returnConfig(configFile, null).then(config => {
            var layerListT9nPath = widget.t9nPath? `${widget.t9nPath}/${lang}.json`: null as string|null;
            var _visible = getWidgetConfigKeyValue(config as LayerListWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as LayerListWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as LayerListWidget, "group", widget.group? widget.group: `${_position}-group`) as string;
            var _label: string;

            var collapse_icon = "esri-icon-left";
            if (_position.toUpperCase().includes("RIGHT")) {
                collapse_icon = "esri-icon-right"
            }

            returnConfig(layerListT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = layerList_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults as MapWidgetLocale, "label", lang==="en"? "Layer List": "Liste des Couches") as string;
            }).then(function (){
                _layerList.label = _label;
                _layerList.view = view;
                _layerList.visible = _visible;
                // _layerList.container = mapExpandContainer;

                _layerList_expand.id = widget.id;
                _layerList_expand.view = view;
                _layerList_expand.visible = _visible;
                _layerList_expand.content = _layerList;
                _layerList_expand.expanded = _expanded;
                _layerList_expand.group = _group;
                _layerList_expand.mode = "floating";
                _layerList_expand.collapseIconClass = collapse_icon;
    
                view.ui.add([
                    {
                        component: _layerList_expand,
                        position: _position,
                        index: _index
                    }
                ]);
                view.when(() => {
                    //layerList_Expand.expandTooltip = `${layerList_Expand.label} ${layerList.label}`;
                    _layerList_expand.expandTooltip = `${_layerList.label}`;
                });
                resolve(_layerList_expand);
            });
        });
    });
}

function getWidgetConfigKeyValue(widget: MapWidget, configKey: string, defaultValue=null as string|number|boolean|null) {
    var result = defaultValue;
    if (widget) {
        var keys = Object.keys(widget);
        if (keys.includes(configKey)) {
            result = widget[configKey];
        }
    }
    return result;
}

function getWidgetLocaleConfigKeyValue(widgetLocale: MapWidgetLocale, configKey: string, defaultValue=null as string|number|boolean|null) {
    var result = defaultValue;
    if (widgetLocale) {
        var keys = Object.keys(widgetLocale);
        if (keys.includes(configKey)) {
            result = widgetLocale[configKey];
        }
    }
    return result;
}