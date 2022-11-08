import { mapRootURL } from "./Map";
import { mwObject } from "../class/_Map";
import { getNormalizedLocale } from '@dnrr_fd/util/locale';
import { returnConfig } from "@dnrr_fd/util";
import Collection from "@arcgis/core/core/Collection";
import Expand from "@arcgis/core/widgets/Expand";
import Search from "@arcgis/core/widgets/Search";
import LayerSearchSource from "@arcgis/core/widgets/Search/LayerSearchSource";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";
import Home from "@arcgis/core/widgets/Home";
import Zoom from "@arcgis/core/widgets/Zoom";
import ExtentNavigator from "../extentnavigator/ExtentNavigator";
import Locate from "@arcgis/core/widgets/Locate";
import Fullscreen from "@arcgis/core/widgets/Fullscreen";
import LayerList from "@arcgis/core/widgets/LayerList";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Cookies from "../cookies/Cookies";
import { Cookie } from "../class/_Cookie";
import CookiesButton from "../cookies/button/CookiesButton";
// Import local assets
import * as searchT9n_en from '../search/assets/t9n/en.json';
import * as searchT9n_fr from '../search/assets/t9n/fr.json';
var search_defaultT9n = searchT9n_en;
import * as cookiesT9n_en from '../cookies/assets/t9n/en.json';
import * as cookiesT9n_fr from '../cookies/assets/t9n/fr.json';
var cookies_defaultT9n = cookiesT9n_en;
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
var mapWidgets = new Array();
var widgetsAssetsPath;
var lang;
export async function loadWidgetsIntoMap(_mapView, mapWidgetArray) {
    return new Promise(resolve => {
        widgetsAssetsPath = `${mapRootURL}assets/widgets/`;
        lang = getNormalizedLocale();
        mwAsyncForEach(mapWidgetArray, async (widget) => {
            if (widget.id && typeof widget.id === "string") {
                switch (widget.id.toUpperCase()) {
                    case "SEARCH":
                        await addSearch(widget, _mapView).then(searchWidget => {
                            if (searchWidget) {
                                mapWidgets.push(new mwObject(searchWidget));
                            }
                        });
                        break;
                    case "COOKIES":
                        await addCookies(widget, _mapView).then(cookiesWidget => {
                            if (cookiesWidget) {
                                mapWidgets.push(new mwObject(cookiesWidget));
                            }
                        });
                        break;
                    case "SCALEBAR":
                        await addScaleBar(widget, _mapView).then(scaleBarWidget => {
                            if (scaleBarWidget) {
                                mapWidgets.push(new mwObject(scaleBarWidget));
                            }
                        });
                        break;
                    case "COORDINATECONVERSION":
                        await addCoordinateConversion(widget, _mapView).then(coordinateConversionWidget => {
                            if (coordinateConversionWidget) {
                                mapWidgets.push(new mwObject(coordinateConversionWidget));
                            }
                        });
                        break;
                    case "HOME":
                        await addHome(widget, _mapView).then(homeWidget => {
                            if (homeWidget) {
                                mapWidgets.push(new mwObject(homeWidget));
                            }
                        });
                        break;
                    case "ZOOM":
                        await addZoom(widget, _mapView).then(zoomWidget => {
                            if (zoomWidget) {
                                mapWidgets.push(new mwObject(zoomWidget));
                            }
                        });
                        break;
                    case "EXTENTNAVIGATION":
                        await addExtentNavigator(widget, _mapView).then(extentnavigatorWidget => {
                            if (extentnavigatorWidget) {
                                mapWidgets.push(new mwObject(extentnavigatorWidget));
                            }
                        });
                        break;
                    case "LOCATE":
                        await addLocate(widget, _mapView).then(locateWidget => {
                            if (locateWidget) {
                                mapWidgets.push(new mwObject(locateWidget));
                            }
                        });
                        break;
                    case "FULLSCREEN":
                        await addFullscreen(widget, _mapView).then(fullscreenWidget => {
                            if (fullscreenWidget) {
                                mapWidgets.push(new mwObject(fullscreenWidget));
                            }
                        });
                        break;
                    case "LAYERLIST":
                        await addLayerList(widget, _mapView).then(layerListWidget => {
                            if (layerListWidget) {
                                mapWidgets.push(new mwObject(layerListWidget));
                            }
                        });
                        break;
                    default:
                        console.log(`Map Widget: ${widget.id} is not configured for this application!`);
                }
            }
            else {
                console.log("Improper configuration of a map widget! Please check the configuration file.");
            }
        }).then(() => {
            // console.log("Resolved: createWidgetsForWidgetBar()");
            resolve(mapWidgets);
        });
    });
}
export function removeWidgetsFromMap(_mapView) {
    mapWidgets.forEach(mwObj => {
        if (mwObj) {
            _mapView.ui.remove(mwObj.mWidget);
            var widget_node = document.getElementById(mwObj.mWidget.id);
            if (widget_node) {
                widget_node.innerHTML = "";
            }
        }
    });
    mapWidgets = [];
}
async function addSearch(widget, view) {
    return new Promise(resolve => {
        // Get the default asset from language.
        search_defaultT9n = (lang === 'fr' ? searchT9n_fr : searchT9n_en);
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
        returnConfig(configFile, null).then(config => {
            var searchT9nPath = widget.t9nPath ? `${widget.t9nPath}/${lang}.json` : null;
            var _visible;
            var _label;
            var _allPlaceholder;
            var searchConfig;
            searchConfig = config;
            returnConfig(searchT9nPath, null).then(t9nResults => {
                var _t9nResults;
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    _t9nResults = search_defaultT9n;
                }
                else {
                    _t9nResults = t9nResults;
                }
                _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : searchConfig ? searchConfig.visible ? searchConfig.visible : true : true);
                _label = getWidgetLocaleConfigKeyValue(_t9nResults, "label", lang === "en" ? "Search" : "Rechercher");
                _allPlaceholder = getWidgetLocaleConfigKeyValue(_t9nResults, "allPlaceholder", lang === "en" ? "Search" : "Rechercher");
                _search.label = _label;
                _search.allPlaceholder = _allPlaceholder;
                _search.view = view;
                _search.visible = _visible;
                return _t9nResults.sources ? _t9nResults.sources : null;
            }).then(searchSourcesT9n => {
                // Add any sources using sources and t9n
                var _sources = new Collection();
                if (searchConfig) {
                    var sources = searchConfig.sources ? searchConfig.sources : null;
                    sources?.forEach(source => {
                        let _source = new LayerSearchSource();
                        if (source.url) {
                            let lyr = new FeatureLayer({
                                url: source.url
                            });
                            _source.searchFields = source.searchFields ? source.searchFields : [];
                            _source.outFields = source.outFields ? source.outFields : ["*"];
                            _source.exactMatch = source.exactMatch ? source.exactMatch : false;
                            _source.maxResults = source.maxResults ? source.maxResults : 6;
                            _source.maxSuggestions = source.maxSuggestions ? source.maxSuggestions : 6;
                            if (searchSourcesT9n) {
                                searchSourcesT9n.forEach(sourceT9n => {
                                    if (sourceT9n.id.toLowerCase() === source.id.toLowerCase()) {
                                        _source.name = sourceT9n.label ? sourceT9n.label : sourceT9n.id;
                                        _source.placeholder = sourceT9n.placeholder ? sourceT9n.placeholder : sourceT9n.id;
                                        _source.suggestionTemplate = sourceT9n.suggestionTemplate ? sourceT9n.suggestionTemplate : "";
                                        lyr.popupTemplate = { title: sourceT9n.popuptemplatetitle };
                                    }
                                });
                            }
                            _source.layer = lyr;
                            _sources.push(_source);
                        }
                    });
                    _search.sources = _sources;
                }
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
    });
}
async function addCookies(widget, view) {
    return new Promise(resolve => {
        var _cookiesID = "cookiesID";
        var lang = getNormalizedLocale();
        var cookiesWidget;
        // Get the default asset from language.
        cookies_defaultT9n = (lang === 'fr' ? cookiesT9n_fr : cookiesT9n_en);
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        var _map_position = getWidgetConfigKeyValue(widget, "map_location", "bottom-left");
        var _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        returnConfig(configFile, null).then(config => {
            var cookiesT9nPath = widget.t9nPath ? `${widget.t9nPath}/${lang}.json` : null;
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            var _container = getWidgetConfigKeyValue(config, "container", _cookiesID);
            var _expanded = getWidgetConfigKeyValue(config, "expanded", widget.expanded ? widget.expanded : true);
            var _cookies = getWidgetConfigKeyValue(config, "cookies", widget.cookies ? widget.cookies : null);
            var _privacyPolicy = getWidgetConfigKeyValue(config, "privacyPolicy", widget.privacyPolicy ? widget.privacyPolicy : null);
            var _contactUs = getWidgetConfigKeyValue(config, "contactUs", widget.contactUs ? widget.contactUs : null);
            var _position = getWidgetConfigKeyValue(config, "position", widget.position ? widget.position : "bottom");
            var _label;
            var _cookiesT9n;
            returnConfig(cookiesT9nPath, null).then(async (t9nResults) => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = cookies_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults, "allPlaceholder", lang === "en" ? "Cookies Settings" : "Paramètres des Cookies");
                _cookiesT9n = getWidgetLocaleConfigKeyValue(t9nResults, "cookies", null);
                // Create the cookies widget and set its properties.
                var cookie_array = new Array();
                _cookies.forEach(conf_cookie => {
                    _cookiesT9n.forEach(t9n_cookie => {
                        if (conf_cookie.id === t9n_cookie.id) {
                            if (t9n_cookie.label) {
                                cookie_array.push(new Cookie(t9n_cookie.id, t9n_cookie.label));
                            }
                            else {
                                cookie_array.push(new Cookie(conf_cookie.id, conf_cookie.id));
                            }
                        }
                    });
                });
                cookiesWidget = new Cookies({
                    // Get the following from the config file as an example.
                    afterHideFocusElement: "mainID",
                    container: _container,
                    visible: _expanded,
                    privacyPolicy: _privacyPolicy,
                    contactUs: _contactUs,
                    position: _position,
                    cookies: cookie_array
                });
                await cookiesWidget.initCookies();
            }).then(function () {
                cookiesWidget.label = _label;
                var _cookies_button = new CookiesButton({
                    id: widget.id,
                    visible: _visible,
                    content: cookiesWidget,
                    iconClass: "esri-icon-settings"
                });
                view.ui.add([
                    {
                        component: _cookies_button,
                        position: _map_position,
                        index: _index
                    }
                ]);
                view.when(() => {
                    //layerList_Expand.expandTooltip = `${layerList_Expand.label} ${layerList.label}`;
                    // _cookies_button.toolTip = `${_label}`;
                });
                _cookies_button.when(() => {
                    console.log("Cookies widget rendered.");
                    resolve(_cookies_button);
                });
            });
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
        returnConfig(configFile, null).then(config => {
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
        returnConfig(configFile, null).then(config => {
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
        returnConfig(configFile, null).then(config => {
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
        returnConfig(configFile, null).then(config => {
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
async function addExtentNavigator(widget, view) {
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
        var _horizontalAlignButtons = getWidgetConfigKeyValue(widget, "horizontal_align_buttons", true);
        var _extentNavigator = new ExtentNavigator();
        returnConfig(configFile, null).then(config => {
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            _extentNavigator.label = widget.id;
            _extentNavigator.horizontalAlignButtons = _horizontalAlignButtons;
            _extentNavigator.view = view;
            _extentNavigator.visible = _visible;
            view.ui.add([
                {
                    component: _extentNavigator,
                    position: _position,
                    index: _index
                }
            ]);
            resolve(_extentNavigator);
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
        returnConfig(configFile, null).then(config => {
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
        returnConfig(configFile, null).then(config => {
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
        returnConfig(configFile, null).then(config => {
            var layerListT9nPath = widget.t9nPath ? `${widget.t9nPath}/${lang}.json` : null;
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            var _expanded = getWidgetConfigKeyValue(config, "expanded", widget.expanded ? widget.expanded : false);
            var _group = getWidgetConfigKeyValue(config, "group", widget.group ? widget.group : `${_position}-group`);
            var _label;
            var collapse_icon = "esri-icon-left";
            if (_position.toUpperCase().includes("RIGHT")) {
                collapse_icon = "esri-icon-right";
            }
            returnConfig(layerListT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
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
async function mwAsyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        // console.log("Promise: callback()");
        await callback(array[index], index, array);
    }
}
//# sourceMappingURL=MapViewModel.js.map