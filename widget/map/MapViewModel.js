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
import AdvancedSearch from "../advancedsearch/AdvancedSearch";
import AdvancedSearchButton from "../advancedsearch/button/AdvancedSearchButton";
// Import local assets
import * as searchT9n_en from '../search/assets/t9n/en.json';
import * as searchT9n_fr from '../search/assets/t9n/fr.json';
let search_defaultT9n = searchT9n_en;
import * as cookiesT9n_en from '../cookies/assets/t9n/en.json';
import * as cookiesT9n_fr from '../cookies/assets/t9n/fr.json';
let cookies_defaultT9n = cookiesT9n_en;
import * as advancedSearchT9n_en from '../advancedsearch/assets/t9n/en.json';
import * as advancedSearchT9n_fr from '../advancedsearch/assets/t9n/fr.json';
let advancedSearch_defaultT9n = advancedSearchT9n_en;
import * as layerListT9n_en from '../layerlist/assets/t9n/en.json';
import * as layerListT9n_fr from '../layerlist/assets/t9n/fr.json';
let layerList_defaultT9n = layerListT9n_en;
let mapWidgets = new Array();
let lang;
export async function loadWidgetsIntoMap(_mapView, mapWidgetArray) {
    return new Promise(resolve => {
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
                    case "ADVANCEDSEARCH":
                        await addAdvancedSearch(widget, _mapView).then(advancedSearchWidget => {
                            if (advancedSearchWidget) {
                                mapWidgets.push(new mwObject(advancedSearchWidget));
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
            const widget_node = document.getElementById(mwObj.mWidget.id);
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
        let configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        const _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        const _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        const _search = new Search();
        returnConfig(configFile, null).then(config => {
            const searchT9nPath = widget.t9nPath ? `${widget.t9nPath}/${lang}.json` : null;
            let _visible;
            let _label;
            let _allPlaceholder;
            const searchConfig = config;
            returnConfig(searchT9nPath, null).then(t9nResults => {
                let _t9nResults;
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
                const _sources = new Collection();
                if (searchConfig) {
                    const sources = searchConfig.sources ? searchConfig.sources : null;
                    sources?.forEach(source => {
                        const _source = new LayerSearchSource();
                        if (source.url) {
                            const lyr = new FeatureLayer({
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
        const _cookiesID = "cookiesID";
        const lang = getNormalizedLocale();
        let cookiesWidget;
        // Get the default asset from language.
        cookies_defaultT9n = (lang === 'fr' ? cookiesT9n_fr : cookiesT9n_en);
        let configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        const _map_position = getWidgetConfigKeyValue(widget, "map_location", "bottom-left");
        const _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        returnConfig(configFile, null).then(config => {
            const cookiesT9nPath = widget.t9nPath ? `${widget.t9nPath}/${lang}.json` : null;
            const _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            const _container = getWidgetConfigKeyValue(config, "container", _cookiesID);
            const _expanded = getWidgetConfigKeyValue(config, "expanded", widget.expanded ? widget.expanded : true);
            const _cookies = getWidgetConfigKeyValue(config, "cookies", widget.cookies ? widget.cookies : null);
            const _privacyPolicy = getWidgetConfigKeyValue(config, "privacyPolicy", widget.privacyPolicy ? widget.privacyPolicy : null);
            const _contactUs = getWidgetConfigKeyValue(config, "contactUs", widget.contactUs ? widget.contactUs : null);
            const _position = getWidgetConfigKeyValue(config, "position", widget.position ? widget.position : "bottom");
            let _label;
            let _cookiesT9n;
            returnConfig(cookiesT9nPath, null).then(async (t9nResults) => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = cookies_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults, "allPlaceholder", lang === "en" ? "Cookies Settings" : "Paramètres des Cookies");
                _cookiesT9n = getWidgetLocaleConfigKeyValue(t9nResults, "cookies", null);
                // Create the cookies widget and set its properties.
                const cookie_array = new Array();
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
                const _cookies_button = new CookiesButton({
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
        let configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        const _position = getWidgetConfigKeyValue(widget, "map_location", "bottom-left");
        const _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        const _scaleBar = new ScaleBar();
        returnConfig(configFile, null).then(config => {
            const _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            const _unit = getWidgetConfigKeyValue(config, "unit", widget.unit ? widget.unit : "dual");
            const _style = getWidgetConfigKeyValue(config, "style", widget.unit ? widget.unit : "line");
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
        let configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        const _position = getWidgetConfigKeyValue(widget, "map_location", "bottom-left");
        const _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        const _coordinateConversion = new CoordinateConversion();
        returnConfig(configFile, null).then(config => {
            const _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
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
        let configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        const _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        const _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        const _home = new Home();
        returnConfig(configFile, null).then(config => {
            const _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
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
        let configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        const _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        const _index = getWidgetConfigKeyValue(widget, "index_position", 1);
        const _zoom = new Zoom();
        returnConfig(configFile, null).then(config => {
            const _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
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
        let configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        const _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        const _index = getWidgetConfigKeyValue(widget, "index_position", 1);
        const _horizontalAlignButtons = getWidgetConfigKeyValue(widget, "horizontal_align_buttons", true);
        const _extentNavigator = new ExtentNavigator();
        returnConfig(configFile, null).then(config => {
            const _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
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
        let configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        const _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        const _index = getWidgetConfigKeyValue(widget, "index_position", 2);
        const _locate = new Locate();
        returnConfig(configFile, null).then(config => {
            const _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
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
        let configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        const _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        const _index = getWidgetConfigKeyValue(widget, "index_position", 3);
        const _fullscreen = new Fullscreen();
        returnConfig(configFile, null).then(config => {
            const _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
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
        let configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        const _position = getWidgetConfigKeyValue(widget, "map_location", "top-left");
        const _index = getWidgetConfigKeyValue(widget, "index_position", 4);
        const _layerList = new LayerList();
        const _layerList_expand = new Expand();
        returnConfig(configFile, null).then(config => {
            const layerListT9nPath = widget.t9nPath ? `${widget.t9nPath}/${lang}.json` : null;
            const _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            const _expanded = getWidgetConfigKeyValue(config, "expanded", widget.expanded ? widget.expanded : false);
            const _group = getWidgetConfigKeyValue(config, "group", widget.group ? widget.group : `${_position}-group`);
            let _label;
            let collapse_icon = "esri-icon-left";
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
async function addAdvancedSearch(widget, view) {
    return new Promise(resolve => {
        const _advancedSearchID = "advancedSearchID";
        const lang = getNormalizedLocale();
        let advancedSearchWidget;
        // Get the default asset from language.
        advancedSearch_defaultT9n = (lang === 'fr' ? advancedSearchT9n_fr : advancedSearchT9n_en);
        let configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        const _map_position = getWidgetConfigKeyValue(widget, "map_location", "bottom-left");
        const _index = getWidgetConfigKeyValue(widget, "index_position", 0);
        const advancedSearchT9nPath = widget.t9nPath ? `${widget.t9nPath}/${lang}.json` : null;
        const _visible = getWidgetConfigKeyValue(widget, "visible", widget.visible ? widget.visible : true);
        const _container = getWidgetConfigKeyValue(widget, "advancedSearchContainer", _advancedSearchID);
        const _rootFocusElement = getWidgetConfigKeyValue(widget, "rootFocusElement", widget.rootFocusElement ? widget.rootFocusElement : "mainID");
        const _expanded = getWidgetConfigKeyValue(widget, "expanded", widget.expanded ? widget.expanded : true);
        let _label;
        returnConfig(configFile, null).then(config => {
            const asConfig = config;
            const _addMissingSearchLayers = asConfig.addMissingSearchLayers ? asConfig.addMissingSearchLayers : true;
            const _layers = asConfig.layers ? asConfig.layers : null;
            if (_layers === null) {
                resolve(null);
            }
            else {
                returnConfig(advancedSearchT9nPath, null).then(async function (t9nResults) {
                    _label = lang === "en" ? "Advanced Search" : "Recherche Avancée";
                    if (t9nResults === null || t9nResults === undefined) {
                        console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                        t9nResults = advancedSearch_defaultT9n;
                    }
                    const t9nObj = t9nResults;
                    if (Object.hasOwn(t9nObj, 'label') === true) {
                        if (t9nObj.label.length > 0) {
                            _label = t9nObj.label;
                        }
                    }
                    // Check if the container exists and if it is empty
                    const containerElement = document.getElementById(_container);
                    if (containerElement) {
                        if (containerElement.innerHTML.length > 0) {
                            containerElement.innerHTML = "";
                        }
                    }
                    else {
                        const rootElement = document.getElementById(_rootFocusElement);
                        if (rootElement) {
                            const ce = document.createElement("div");
                            ce.id = _container;
                            rootElement.appendChild(ce);
                        }
                        else {
                            resolve(null);
                        }
                    }
                    advancedSearchWidget = new AdvancedSearch({
                        view: view,
                        layers: _layers,
                        container: _container,
                        visible: _expanded,
                        rootFocusElement: _rootFocusElement,
                        addMissingSearchLayers: _addMissingSearchLayers
                    });
                }).then(function () {
                    advancedSearchWidget.label = _label;
                    const _advancedSearch_button = new AdvancedSearchButton({
                        id: widget.id,
                        visible: _visible,
                        content: advancedSearchWidget,
                        iconClass: "esri-icon-review"
                    });
                    view.ui.add([
                        {
                            component: _advancedSearch_button,
                            position: _map_position,
                            index: _index
                        }
                    ]);
                    view.when(() => {
                        //layerList_Expand.expandTooltip = `${layerList_Expand.label} ${layerList.label}`;
                        // _cookies_button.toolTip = `${_label}`;
                    });
                    _advancedSearch_button.when(() => {
                        console.log("Advanced Search widget rendered.");
                        resolve(_advancedSearch_button);
                    });
                });
            }
        });
    });
}
function getWidgetConfigKeyValue(widget, configKey, defaultValue = null) {
    let result = defaultValue;
    if (widget) {
        const keys = Object.keys(widget);
        if (keys.includes(configKey)) {
            result = widget[configKey];
        }
    }
    return result;
}
function getWidgetLocaleConfigKeyValue(widgetLocale, configKey, defaultValue = null) {
    let result = defaultValue;
    if (widgetLocale) {
        const keys = Object.keys(widgetLocale);
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