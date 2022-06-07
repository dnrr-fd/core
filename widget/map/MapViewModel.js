import { mapRootURL } from "./Map";
import { getNormalizedLocale } from '@dnrr_fd/util/locale';
import Expand from "@arcgis/core/widgets/Expand";
import Search from "@arcgis/core/widgets/Search";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";
import Home from "@arcgis/core/widgets/Home";
import Zoom from "@arcgis/core/widgets/Zoom";
import Locate from "@arcgis/core/widgets/Locate";
import Fullscreen from "@arcgis/core/widgets/Fullscreen";
import LayerList from "@arcgis/core/widgets/LayerList";
// Import local assets
// import * as searchT9n_en from '../search/assets/t9n/en.json'
// import * as searchT9n_fr from '../search/assets/t9n/fr.json'
// var search_defaultT9n = searchT9n_en;
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
import * as layerListT9n_en from '../layerlist/assets/t9n/en.json';
import * as layerListT9n_fr from '../layerlist/assets/t9n/fr.json';
var layerList_defaultT9n = layerListT9n_en;
export var searchWidget = null;
export var scaleBarWidget = null;
export var coordinateConversionWidget = null;
export var homeWidget = null;
export var zoomWidget = null;
export var locateWidget = null;
export var fullscreenWidget = null;
export var layerListWidget = null;
var widgetsAssetsPath;
var lang;
export async function loadWidgetsIntoMap(_mapView, mapWidgetArray) {
    widgetsAssetsPath = `${mapRootURL}assets/widgets/`;
    lang = getNormalizedLocale();
    mapWidgetArray.forEach(widget => (async () => {
        if (widget.id && typeof widget.id === "string") {
            switch (widget.id.toUpperCase()) {
                case "SEARCH":
                    searchWidget = await addSearch(widget, _mapView);
                    break;
                case "SCALEBAR":
                    scaleBarWidget = await addScaleBar(widget, _mapView);
                    break;
                case "COORDINATECONVERSION":
                    coordinateConversionWidget = await addCoordinateConversion(widget, _mapView);
                    break;
                case "HOME":
                    homeWidget = await addHome(widget, _mapView);
                    break;
                case "ZOOM":
                    zoomWidget = await addZoom(widget, _mapView);
                    break;
                case "LOCATE":
                    locateWidget = await addLocate(widget, _mapView);
                    break;
                case "FULLSCREEN":
                    fullscreenWidget = await addFullscreen(widget, _mapView);
                    break;
                case "LAYERLIST":
                    layerListWidget = await addLayerList(widget, _mapView);
                    break;
                default:
                    console.log(`Map Widget: ${widget.id} is not configured for this application!`);
            }
        }
        else {
            console.log("Improper configuration of a map widget! Please check the configuration file.");
        }
    })());
}
export function removeWidgetsFromMap(_mapView) {
    [searchWidget,
        scaleBarWidget,
        coordinateConversionWidget,
        homeWidget,
        zoomWidget,
        locateWidget,
        fullscreenWidget,
        layerListWidget
    ].forEach(widget => {
        if (widget) {
            _mapView.ui.remove(widget);
        }
    });
}
async function addSearch(widget, view) {
    return new Promise(resolve => {
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        var _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        var _search = new Search();
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/config.json`).then(config => {
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
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
async function addScaleBar(widget, view) {
    return new Promise(resolve => {
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        var _position = getWidgetConfigKeyValue(widget, "map_location", "bottom-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        var _scaleBar = new ScaleBar();
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/config.json`).then(config => {
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            var _unit = getWidgetConfigKeyValue(config, "unit", widget.unit ? widget.unit : "dual");
            var _style = getWidgetConfigKeyValue(config, "style", widget.unit ? widget.unit : "line");
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
async function addCoordinateConversion(widget, view) {
    return new Promise(resolve => {
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        var _position = getWidgetConfigKeyValue(widget, "map_location", "bottom-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        var _coordinateConversion = new CoordinateConversion();
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/config.json`).then(config => {
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
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
async function addHome(widget, view) {
    return new Promise(resolve => {
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        var _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        var _home = new Home();
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/config.json`).then(config => {
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
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
async function addZoom(widget, view) {
    return new Promise(resolve => {
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        var _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 1);
        var _zoom = new Zoom();
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/config.json`).then(config => {
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
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
async function addLocate(widget, view) {
    return new Promise(resolve => {
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        var _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 2);
        var _locate = new Locate();
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/config.json`).then(config => {
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
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
async function addFullscreen(widget, view) {
    return new Promise(resolve => {
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        var _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 3);
        var _fullscreen = new Fullscreen();
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/config.json`).then(config => {
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
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
async function addLayerList(widget, view) {
    return new Promise(resolve => {
        // Get the default asset from language.
        layerList_defaultT9n = (lang === 'fr' ? layerListT9n_fr : layerListT9n_en);
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        var _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
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
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/config.json`).then(config => {
            var layerListT9nPath;
            if (widget.t9nPath != null) {
                layerListT9nPath = `${widget.t9nPath}/${widget.id}_${lang}.json`;
            }
            else {
                layerListT9nPath = null;
            }
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            var _expanded = getWidgetConfigKeyValue(config, "expanded", widget.expanded ? widget.expanded : false);
            var _group = getWidgetConfigKeyValue(config, "group", widget.group ? widget.group : `${_position}-group`);
            var _label;
            var collapse_icon = "esri-icon-left";
            if (_position.toUpperCase().includes("RIGHT")) {
                collapse_icon = "esri-icon-right";
            }
            returnWidgetConfig(layerListT9nPath, `${widgetsAssetsPath}${widget.id}/t9n/${lang}.json`).then(t9nResults => {
                if (t9nResults === null) {
                    t9nResults = layerList_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults, "label", lang === "en" ? "Layer List" : "Liste des Couches");
            }).then(function () {
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
async function returnWidgetConfig(filePath, defaultFilePath) {
    return new Promise(resolve => {
        // If the config file is not null, try and load it.
        var finalFilePath = filePath ? filePath : defaultFilePath;
        console.log(`Config file path: ${finalFilePath}`);
        fetch(finalFilePath)
            .then(response => {
            if (response.status >= 200 && response.status <= 299) {
                resolve(response.json());
            }
            else {
                resolve(null);
            }
        })
            .catch(error => {
            resolve(null);
        });
    });
}
function getWidgetConfigKeyValue(widget, configKey, defaultValue = null) {
    var result = defaultValue;
    if (widget) {
        var keys = Object.keys(widget);
        if (keys.includes(configKey)) {
            result = widget[configKey];
        }
    }
    return result;
}
function getWidgetLocaleConfigKeyValue(widgetLocale, configKey, defaultValue = null) {
    var result = defaultValue;
    if (widgetLocale) {
        var keys = Object.keys(widgetLocale);
        if (keys.includes(configKey)) {
            result = widgetLocale[configKey];
        }
    }
    return result;
}
//# sourceMappingURL=MapViewModel.js.map