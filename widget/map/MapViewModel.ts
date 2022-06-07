// @ts-check
import MapView from "@arcgis/core/views/MapView";
import { mapRootURL, mapParentElement } from "./Map"
import { MapWidget, ScaleBarWidget, LayerListWidget, MapWidgetLocale } from "../class/_Map";
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
                    searchWidget = await addSearch(widget as MapWidget, _mapView) as Search|null;
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

async function addSearch(widget: MapWidget, view: MapView){
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

        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(config => {
            var _visible = getWidgetConfigKeyValue(config as MapWidget, "visible", widget.visible? widget.visible: true) as boolean;

            _search.label = widget.id;
            _search.view = view;
            _search.visible = _visible;

            view.ui.add([
                {
                    component: _search,
                    position: _position,
                    index: _index
                }
            ]);
            resolve(_search);
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

        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(config => {
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

        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(config => {
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

        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(config => {
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

        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(config => {
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

        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(config => {
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

        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(config => {
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
        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        // var t9nPath = `${widgetsAssetsPath}${widget.id}/t9n/${widget.id}_${lang}.json`;
        var _position = getWidgetConfigKeyValue(widget, "map_location", "top-left") as string;
        var _index = getWidgetConfigKeyValue(widget, "index_position", 4);

        var _layerList = new LayerList();
        var _layerList_expand = new Expand();

        // var mapExpandContainer: HTMLElement;
        // if (document.getElementById("mapExpandContainerID") === null) {
        //     mapExpandContainer = document.createElement('div');
        //     mapExpandContainer.id = "mapExpandContainerID";
        //     mapExpandContainer.setAttribute('style', 'top: 175px;');
        //     if (mapParentElement) {
        //         mapParentElement.appendChild(mapExpandContainer);
        //     }
        // }

        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(config => {
            var layerListT9nPath = `${widgetsAssetsPath}${widget.id}/t9n/${widget.id}_${lang}.json`;
            var _visible = getWidgetConfigKeyValue(config as LayerListWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as LayerListWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as LayerListWidget, "group", widget.group? widget.group: `${_position}-group`) as string;
            var _label: string;

            var collapse_icon = "esri-icon-left";
            if (_position.toUpperCase().includes("RIGHT")) {
                collapse_icon = "esri-icon-right"
            }

            returnWidgetConfig(layerListT9nPath, layerListT9nPath).then(t9nResults => {
                _label = getWidgetLocaleConfigKeyValue(t9nResults as MapWidgetLocale, "label", widget.id? widget.id: lang==="en"? "Layer List": "Liste des Couches") as string;
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

async function returnWidgetConfig (filePath: string|null, defaultFilePath: string){
    return new Promise(resolve => {
        // If the config file is not null, try and load it.
        var finalFilePath = filePath? filePath: defaultFilePath
        console.log(`Config file path: ${finalFilePath}`);

        fetch(finalFilePath)
        .then(response => {
            if (response.status >= 200 && response.status <= 299) {
                resolve(response.json());
            } else {
                resolve(null);
            }
        })
        .catch(error => {
            resolve(null);
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