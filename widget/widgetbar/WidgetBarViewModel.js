import esriConfig from "@arcgis/core/config.js";
import Portal from "@arcgis/core/portal/Portal";
import { widgetBarRootURL, widgetBarWidgetCloseFocusElement } from "./WidgetBar";
import { DefaultCreateOptions, ScreenshotSettings } from "../class/_WidgetBar";
import { Centroid, wbwObject } from "../class/_WidgetBar";
import { LegendStyle } from "../class/_Legend";
import { getNormalizedLocale } from '@dnrr_fd/util/locale';
import { returnConfig } from "@dnrr_fd/util";
import Expand from "@arcgis/core/widgets/Expand";
import Legend from "@arcgis/core/widgets/Legend";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import Sketch from "@arcgis/core/widgets/Sketch";
import Print from "@arcgis/core/widgets/Print";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Collection from "@arcgis/core/core/Collection";
import Bookmark from "@arcgis/core/webmap/Bookmark";
import Viewpoint from "@arcgis/core/Viewpoint";
import Point from "@arcgis/core/geometry/Point";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Support from "../support/Support";
import Button from "../button/Button";
import MeasurementDNRR from "../measurement/Measurement";
// Import local assets
import * as legendT9n_en from '../legend/assets/t9n/en.json';
import * as legendT9n_fr from '../legend/assets/t9n/fr.json';
var legend_defaultT9n = legendT9n_en;
import * as bookmarksT9n_en from '../bookmarks/assets/t9n/en.json';
import * as bookmarksT9n_fr from '../bookmarks/assets/t9n/fr.json';
var bookmarks_defaultT9n = bookmarksT9n_en;
import * as basemapGalleryT9n_en from '../basemapgallery/assets/t9n/en.json';
import * as basemapGalleryT9n_fr from '../basemapgallery/assets/t9n/fr.json';
var basemapGallery_defaultT9n = basemapGalleryT9n_en;
import * as measurementT9n_en from '../measurement/assets/t9n/en.json';
import * as measurementT9n_fr from '../measurement/assets/t9n/fr.json';
var measurement_defaultT9n = measurementT9n_en;
import * as sketchT9n_en from '../sketch/assets/t9n/en.json';
import * as sketchT9n_fr from '../sketch/assets/t9n/fr.json';
var sketch_defaultT9n = sketchT9n_en;
import * as printT9n_en from '../print/assets/t9n/en.json';
import * as printT9n_fr from '../print/assets/t9n/fr.json';
var print_defaultT9n = printT9n_en;
import * as supportT9n_en from '../support/assets/t9n/en.json';
import * as supportT9n_fr from '../support/assets/t9n/fr.json';
var support_defaultT9n = supportT9n_en;
var widgetBarWidgets = new Array();
var widgetsAssetsPath;
var widgetBarGroup = "widget-bar-group";
export async function createWidgetsForWidgetBar(widgetBar) {
    var _mapView = widgetBar.mapView;
    var widgetBarWidgetArray = widgetBar.widgets;
    var _cookies = widgetBar.cookies;
    var _localeList = widgetBar.localeList;
    var graphicsLayer = widgetBar.graphicsLayer;
    return new Promise(resolve => {
        widgetsAssetsPath = `${widgetBarRootURL}assets/widgets/`;
        wbwAsyncForEach(widgetBarWidgetArray, async (widget) => {
            if (widget.id && typeof widget.id === "string") {
                switch (widget.id.toUpperCase()) {
                    case "LEGEND":
                        await addLegend(widget, _mapView).then(legendWidget => {
                            if (legendWidget) {
                                legendWidget.when(() => {
                                    widgetBarWidgets.push(new wbwObject(legendWidget));
                                    // console.log("Legend widget added to array.");
                                });
                            }
                        });
                        break;
                    case "BOOKMARKS":
                        await addBookmarks(widget, _mapView, _cookies, _localeList).then(bookmarksWidget => {
                            if (bookmarksWidget) {
                                bookmarksWidget.when(() => {
                                    widgetBarWidgets.push(new wbwObject(bookmarksWidget));
                                    // console.log("Bookmarks widget added to array.");
                                });
                            }
                        });
                        break;
                    case "BASEMAPGALLERY":
                        await addBasemapGallery(widget, _mapView).then(basemapgalleryWidget => {
                            if (basemapgalleryWidget) {
                                basemapgalleryWidget.when(() => {
                                    widgetBarWidgets.push(new wbwObject(basemapgalleryWidget));
                                    // console.log("BasemapGallery widget added to array.");
                                });
                            }
                        });
                        break;
                    case "MEASUREMENT":
                        await addMeasurement(widget, _mapView, graphicsLayer).then(measurementWidget => {
                            if (measurementWidget) {
                                measurementWidget.when(() => {
                                    widgetBarWidgets.push(new wbwObject(measurementWidget));
                                    // console.log("Measurement widget added to array.");
                                });
                            }
                        });
                        break;
                    case "SKETCH":
                        await addSketch(widget, _mapView, graphicsLayer).then(sketchWidget => {
                            if (sketchWidget) {
                                sketchWidget.when(() => {
                                    widgetBarWidgets.push(new wbwObject(sketchWidget));
                                    // console.log("Sketch widget added to array.");
                                });
                            }
                        });
                        break;
                    case "PRINT":
                        await addPrint(widget, _mapView).then(printWidget => {
                            if (printWidget) {
                                widgetBarWidgets.push(new wbwObject(printWidget));
                            }
                        });
                        break;
                    case "SUPPORT":
                        await addSupport(widget, _mapView).then(supportWidget => {
                            if (supportWidget) {
                                widgetBarWidgets.push(new wbwObject(supportWidget, false));
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
            resolve(widgetBarWidgets);
        });
    });
}
async function addLegend(widget, _mapView) {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();
        // Get the default asset from language.
        legend_defaultT9n = (lang === 'fr' ? legendT9n_fr : legendT9n_en);
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        returnConfig(configFile, null).then(config => {
            var legendT9nPath;
            if (widget.t9nPath != null) {
                legendT9nPath = `${widget.t9nPath}/${widget.id}_${lang}.json`;
            }
            else {
                legendT9nPath = null;
            }
            var _legend = new Legend();
            var _legend_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            var _expanded = getWidgetConfigKeyValue(config, "expanded", widget.expanded ? widget.expanded : false);
            var _group = getWidgetConfigKeyValue(config, "group", widget.group ? widget.group : widgetBarGroup);
            var _label;
            returnConfig(legendT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = legend_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults, "label", lang === "en" ? "Legend" : "Légende");
            }).then(function () {
                var _style = new LegendStyle();
                _style.type = "card";
                _style.layout = "auto";
                if (window.screen.width > 992) {
                    _style.type = "classic";
                    _style.layout = "stack";
                }
                _legend.label = _label;
                _legend.view = _mapView;
                _legend.style = _style;
                _legend_expand.id = widget.id;
                _legend_expand.view = _mapView;
                _legend_expand.visible = _visible;
                _legend_expand.content = _legend;
                _legend_expand.expanded = _expanded;
                _legend_expand.group = _group;
                _legend_expand.container = widget.id;
                _legend_expand.collapseIconClass = "esri-icon-up";
                _mapView.when(() => {
                    //layerList_Expand.expandTooltip = `${layerList_Expand.label} ${layerList.label}`;
                    _legend_expand.expandTooltip = `${_legend.label}`;
                });
                _legend_expand.when(() => {
                    console.log("Legend widget rendered.");
                    resolve(_legend_expand);
                });
            });
        });
    });
}
async function addBookmarks(widget, _mapView, _cookies, _localeList) {
    return new Promise(resolve => {
        var configFile;
        var lang = getNormalizedLocale();
        // Get the default asset from language.
        bookmarks_defaultT9n = (lang === 'fr' ? bookmarksT9n_fr : bookmarksT9n_en);
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        returnConfig(configFile, null).then(async (config) => {
            var bookmarksT9nPath;
            if (widget.t9nPath != null) {
                bookmarksT9nPath = `${widget.t9nPath}/${widget.id}_${lang}.json`;
            }
            else {
                bookmarksT9nPath = null;
            }
            var _bookmarks_expand = new Expand();
            var _bookmarks = await createBookmarks(config, _mapView, _cookies, _localeList, `${widgetsAssetsPath}${widget.id}/img/default-thumb.png`);
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            var _expanded = getWidgetConfigKeyValue(config, "expanded", widget.expanded ? widget.expanded : false);
            var _group = getWidgetConfigKeyValue(config, "group", widget.group ? widget.group : widgetBarGroup);
            var _label;
            returnConfig(bookmarksT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = bookmarks_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults, "label", lang === "en" ? "Bookmarks" : "Signets");
            }).then(function () {
                _bookmarks_expand.id = widget.id;
                _bookmarks_expand.view = _mapView;
                _bookmarks_expand.visible = _visible;
                _bookmarks_expand.content = _bookmarks;
                _bookmarks_expand.expanded = _expanded;
                _bookmarks_expand.group = _group;
                _bookmarks_expand.container = widget.id;
                _bookmarks_expand.collapseIconClass = "esri-icon-up";
                _mapView.when(() => {
                    _bookmarks_expand.expandTooltip = `${_label}`;
                });
                _bookmarks_expand.when(() => {
                    console.log("Bookmarks widget rendered.");
                    resolve(_bookmarks_expand);
                });
            });
        });
    });
}
async function addBasemapGallery(widget, _mapView) {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();
        // Get the default asset from language.
        basemapGallery_defaultT9n = (lang === 'fr' ? basemapGalleryT9n_fr : basemapGalleryT9n_en);
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        returnConfig(configFile, null).then(config => {
            var basemapGalleryT9nPath;
            if (widget.t9nPath != null) {
                basemapGalleryT9nPath = `${widget.t9nPath}/${widget.id}_${lang}.json`;
            }
            else {
                basemapGalleryT9nPath = null;
            }
            var _basemapGallery_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            var _expanded = getWidgetConfigKeyValue(config, "expanded", widget.expanded ? widget.expanded : false);
            var _group = getWidgetConfigKeyValue(config, "group", widget.group ? widget.group : widgetBarGroup);
            var _portal = getWidgetConfigKeyValue(config, "basemapsourceportal", esriConfig.portalUrl);
            var _label;
            returnConfig(basemapGalleryT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = basemapGallery_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults, "label", lang === "en" ? "Basemap Gallery" : "Bibliothèque de fonds de carte");
            }).then(function () {
                var _basemapGallery = new BasemapGallery({
                    view: _mapView,
                    source: {
                        portal: new Portal({
                            url: _portal
                        })
                    },
                    label: _label
                });
                _basemapGallery_expand.id = widget.id;
                _basemapGallery_expand.view = _mapView;
                _basemapGallery_expand.visible = _visible;
                _basemapGallery_expand.content = _basemapGallery;
                _basemapGallery_expand.expanded = _expanded;
                _basemapGallery_expand.group = _group;
                _basemapGallery_expand.container = widget.id;
                _basemapGallery_expand.collapseIconClass = "esri-icon-up";
                _mapView.when(() => {
                    //layerList_Expand.expandTooltip = `${layerList_Expand.label} ${layerList.label}`;
                    _basemapGallery_expand.expandTooltip = `${_basemapGallery.label}`;
                });
                _basemapGallery_expand.when(() => {
                    console.log("BasemapGallery widget rendered.");
                    resolve(_basemapGallery_expand);
                });
            });
        });
    });
}
async function addMeasurement(widget, _mapView, _graphicsLayer) {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();
        // Get the default asset from language.
        measurement_defaultT9n = (lang === 'fr' ? measurementT9n_fr : measurementT9n_en);
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        returnConfig(configFile, null).then(config => {
            var measurementT9nPath;
            if (widget.t9nPath != null) {
                measurementT9nPath = `${widget.t9nPath}/${widget.id}_${lang}.json`;
            }
            else {
                measurementT9nPath = null;
            }
            var _measurement = new MeasurementDNRR();
            var _measurement_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            var _expanded = getWidgetConfigKeyValue(config, "expanded", widget.expanded ? widget.expanded : false);
            var _group = getWidgetConfigKeyValue(config, "group", widget.group ? widget.group : widgetBarGroup);
            var _map_location = getWidgetConfigKeyValue(config, "measurement_map_location", "top-right");
            var _index_pos = getWidgetConfigKeyValue(config, "measurement_index_position", 0);
            var _label;
            returnConfig(measurementT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = sketch_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults, "label", lang === "en" ? "Sketch" : "Dessin");
            }).then(function () {
                _measurement.label = _label;
                _measurement.view = _mapView;
                _measurement.measurement_map_location = _map_location;
                _measurement.measurement_index_position = _index_pos;
                _measurement_expand.id = widget.id;
                _measurement_expand.view = _mapView;
                _measurement_expand.visible = _visible;
                _measurement_expand.content = _measurement;
                _measurement_expand.expanded = _expanded;
                _measurement_expand.group = _group;
                _measurement_expand.container = widget.id;
                _measurement_expand.collapseIconClass = "esri-icon-up";
                _mapView.when(() => {
                    //layerList_Expand.expandTooltip = `${layerList_Expand.label} ${layerList.label}`;
                    _measurement_expand.expandTooltip = `${_measurement.label}`;
                });
                _measurement_expand.when(() => {
                    console.log("Measurement widget rendered.");
                    resolve(_measurement_expand);
                });
            });
        });
    });
}
async function addSketch(widget, _mapView, _graphicsLayer) {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();
        // Get the default asset from language.
        sketch_defaultT9n = (lang === 'fr' ? sketchT9n_fr : sketchT9n_en);
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        returnConfig(configFile, null).then(config => {
            var sketchT9nPath;
            if (widget.t9nPath != null) {
                sketchT9nPath = `${widget.t9nPath}/${widget.id}_${lang}.json`;
            }
            else {
                sketchT9nPath = null;
            }
            var _sketch = new Sketch();
            var _sketch_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            var _expanded = getWidgetConfigKeyValue(config, "expanded", widget.expanded ? widget.expanded : false);
            var _group = getWidgetConfigKeyValue(config, "group", widget.group ? widget.group : widgetBarGroup);
            var _mode = getWidgetConfigKeyValue(config, "mode", "update");
            var _label;
            returnConfig(sketchT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = sketch_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults, "label", lang === "en" ? "Sketch" : "Dessin");
            }).then(function () {
                _sketch.label = _label;
                _sketch.view = _mapView;
                _sketch.layer = _graphicsLayer;
                _sketch.creationMode = _mode;
                _sketch_expand.id = widget.id;
                _sketch_expand.view = _mapView;
                _sketch_expand.visible = _visible;
                _sketch_expand.content = _sketch;
                _sketch_expand.expanded = _expanded;
                _sketch_expand.group = _group;
                _sketch_expand.container = widget.id;
                _sketch_expand.collapseIconClass = "esri-icon-up";
                _mapView.when(() => {
                    //layerList_Expand.expandTooltip = `${layerList_Expand.label} ${layerList.label}`;
                    _sketch_expand.expandTooltip = `${_sketch.label}`;
                });
                _sketch_expand.when(() => {
                    console.log("Sketch widget rendered.");
                    resolve(_sketch_expand);
                });
            });
        });
    });
}
async function addPrint(widget, _mapView) {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();
        // Get the default asset from language.
        print_defaultT9n = (lang === 'fr' ? printT9n_fr : printT9n_en);
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        returnConfig(configFile, null).then(config => {
            var printT9nPath;
            if (widget.t9nPath != null) {
                printT9nPath = `${widget.t9nPath}/${widget.id}_${lang}.json`;
            }
            else {
                printT9nPath = null;
            }
            var _print = new Print();
            var _print_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            var _expanded = getWidgetConfigKeyValue(config, "expanded", widget.expanded ? widget.expanded : false);
            var _group = getWidgetConfigKeyValue(config, "group", widget.group ? widget.group : widgetBarGroup);
            var _psURL = getWidgetConfigKeyValue(config, "printServiceURL", "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task");
            var _label;
            returnConfig(printT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = print_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults, "label", lang === "en" ? "Print" : "Imprimer");
            }).then(function () {
                _print.label = _label;
                _print.view = _mapView;
                _print.printServiceUrl = _psURL;
                _print_expand.id = widget.id;
                _print_expand.view = _mapView;
                _print_expand.visible = _visible;
                _print_expand.content = _print;
                _print_expand.expanded = _expanded;
                _print_expand.group = _group;
                _print_expand.container = widget.id;
                _print_expand.collapseIconClass = "esri-icon-up";
                _mapView.when(() => {
                    //layerList_Expand.expandTooltip = `${layerList_Expand.label} ${layerList.label}`;
                    _print_expand.expandTooltip = `${_print.label}`;
                });
                _print_expand.when(() => {
                    console.log("Print widget rendered.");
                    resolve(_print_expand);
                });
            });
        });
    });
}
async function addSupport(widget, _mapView) {
    return new Promise(resolve => {
        var _supportID = "supportID";
        var lang = getNormalizedLocale();
        // Get the default asset from language.
        support_defaultT9n = (lang === 'fr' ? supportT9n_fr : supportT9n_en);
        var configFile;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        }
        else {
            configFile = null;
        }
        returnConfig(configFile, null).then(config => {
            var supportT9nPath;
            if (widget.t9nPath != null) {
                supportT9nPath = `${widget.t9nPath}/${widget.id}_${lang}.json`;
            }
            else {
                supportT9nPath = null;
            }
            var _visible = getWidgetConfigKeyValue(config, "visible", widget.visible ? widget.visible : true);
            var _container = getWidgetConfigKeyValue(config, "container", _supportID);
            var _sURL = getWidgetConfigKeyValue(config, "serviceURL", "https://nsgi-uat.cio.gov.ns.ca/feedback-api/api/SendFeedback");
            var _pKey = getWidgetConfigKeyValue(config, "privateKey", "TRdf4t5WpLhWRxPe");
            var _label;
            var _support = new Support({
                // Get the following from the config file as an example.
                afterCloseFocusElement: widgetBarWidgetCloseFocusElement,
                id: _supportID,
                serviceURL: _sURL,
                privateKey: _pKey,
                visible: false,
                container: _container
            });
            returnConfig(supportT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = support_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults, "label", lang === "en" ? "Support Form" : "Formulaire d'assistance");
            }).then(function () {
                _support.label = _label;
                var _support_button = new Button({
                    id: widget.id,
                    visible: _visible,
                    content: _support,
                    container: widget.id,
                    iconClass: "esri-icon-notice-round"
                });
                _mapView.when(() => {
                    //layerList_Expand.expandTooltip = `${layerList_Expand.label} ${layerList.label}`;
                    _support_button.toolTip = `${_support.label}`;
                });
                _support_button.when(() => {
                    console.log("Support widget rendered.");
                    resolve(_support_button);
                });
            });
        });
    });
}
export function removeWidgetsFromWidgetBar(_mapView) {
    widgetBarWidgets.forEach(wbwObj => {
        if (wbwObj) {
            var widget_node = document.getElementById(wbwObj.wbWidget.id);
            widget_node.innerHTML = "";
        }
    });
    widgetBarWidgets = [];
}
function getWidgetConfigKeyValue(widget, configKey, defaultValue = null) {
    if (widget) {
        var keys = Object.keys(widget);
        if (keys.includes(configKey)) {
            return widget[configKey];
        }
    }
    return defaultValue;
}
function getBookmarkConfigKeyValue(bookmark, configKey, defaultValue = null) {
    if (bookmark) {
        var keys = Object.keys(bookmark);
        if (keys.includes(configKey)) {
            return bookmark[configKey];
        }
    }
    return defaultValue;
}
function getWidgetLocaleConfigKeyValue(widgetLocale, configKey, defaultValue = null) {
    if (widgetLocale) {
        var keys = Object.keys(widgetLocale);
        if (keys.includes(configKey)) {
            return widgetLocale[configKey];
        }
    }
    return defaultValue;
}
async function createBookmarks(_config, _view, _cookies, _localeList, default_thumbnail) {
    return new Promise(resolve => {
        var _editingEnabled = getWidgetConfigKeyValue(_config, "editingEnabled", true);
        var defaultCreateOptions = new DefaultCreateOptions();
        var screenshotSettings = new ScreenshotSettings();
        screenshotSettings.width = 100;
        screenshotSettings.height = 100;
        defaultCreateOptions.takeScreenshot = true;
        defaultCreateOptions.captureViewpoint = true;
        defaultCreateOptions.screenshotSettings = screenshotSettings;
        var _defaultCreateOptions = getWidgetConfigKeyValue(_config, "defaultCreateOptions", null);
        if (_defaultCreateOptions === null) {
            _defaultCreateOptions = defaultCreateOptions;
        }
        var _bookmarks = new Bookmarks({
            view: _view,
            editingEnabled: _editingEnabled,
            defaultCreateOptions: _defaultCreateOptions
        });
        var bookmarks_list = new Array();
        var bookmarks_list_config = new Array();
        var bookmarks_list_cookies = new Array();
        // Default bookmarks from config file
        if (_config.bookmarks) {
            bookmarks_list_config = _config.bookmarks;
        }
        // Bookmarks from cookies
        cookieVMAsyncForEach(_cookies, async (cookie) => {
            if (cookie.id.toLowerCase() === "bookmarks" && cookie.accepted === true) {
                await cookie.getCookie().then(() => {
                    if (cookie.value) {
                        bookmarks_list_cookies = JSON.parse(cookie.value);
                    }
                });
                return;
            }
        }).then(() => {
            if (bookmarks_list_cookies.length > 0) {
                bookmarks_list = bookmarks_list_cookies;
            }
            else {
                bookmarks_list = bookmarks_list_config;
            }
            if (bookmarks_list.length > 0) {
                _bookmarks.bookmarks = convertJSONBookmarksToEsriBookmarks(bookmarks_list, default_thumbnail);
                _bookmarks.bookmarks.on("change", function (event) {
                    setBookmarksCookie(_cookies, _bookmarks, _localeList, default_thumbnail);
                });
                _bookmarks.on("bookmark-edit", function (event) {
                    setBookmarksCookie(_cookies, _bookmarks, _localeList, default_thumbnail);
                });
                setBookmarksCookie(_cookies, _bookmarks, _localeList, default_thumbnail);
            }
            resolve(_bookmarks);
        });
    });
}
function convertJSONBookmarksToEsriBookmarks(_bookmarks_list, _default_thumbnail) {
    var lang = getNormalizedLocale();
    let final_bookmarks = new Collection();
    _bookmarks_list.forEach(_bookmark => {
        let _centroid = getBookmarkConfigKeyValue(_bookmark, "centroid");
        let _spatialReference = getBookmarkConfigKeyValue(_bookmark, "spatialreference");
        let _thumbnailurl = getBookmarkConfigKeyValue(_bookmark, "thumbnailurl", _default_thumbnail);
        let _scale = getBookmarkConfigKeyValue(_bookmark, "scale", 2500);
        // Determine the label from lang
        let _name = null;
        if (_bookmark.label) {
            let lang_keys = Object.keys(_bookmark.label);
            if (_bookmark.label[lang]) {
                _name = _bookmark.label[lang];
            }
            else if (lang_keys.length > 0) {
                _name = _bookmark.label[lang_keys[0]];
            }
            else {
                let date = new Date();
                _name = lang === "en" ? `Bookmark_${date.getTime()}` : `Signet_${date.getTime()}`;
            }
        }
        let sr = new SpatialReference(_spatialReference);
        if (_centroid && sr && _name) {
            let point = new Point({
                hasZ: false,
                hasM: false,
                spatialReference: sr
            });
            if (sr.isGeographic === false) {
                point.longitude = _centroid.x;
                point.latitude = _centroid.y;
            }
            else {
                point.x = _centroid.x;
                point.y = _centroid.y;
            }
            let bookmark = new Bookmark({
                name: _name,
                thumbnail: _thumbnailurl,
                viewpoint: new Viewpoint({
                    targetGeometry: point,
                    scale: _scale
                })
            });
            final_bookmarks.add(bookmark);
        }
        else {
            console.log("Bookmark failed to load. Parameters are missing!");
        }
    });
    return final_bookmarks;
}
function convertEsriBookmarksToJSONBookmarks(bookmarkCollection, _localeList, defaultThumbnail) {
    var lang = getNormalizedLocale();
    let bookmarkArray = new Array();
    bookmarkCollection.forEach(bookmark => {
        var _centroid = new Centroid();
        var _thumbnailURL = "";
        if (bookmark.thumbnail.url && bookmark.thumbnail.url.includes("data:image/png")) {
            // Cookie size limit of 4096 bytes. Cannot embed Base64 imagery. Use default-thumbnail instead.
            _thumbnailURL = defaultThumbnail ? defaultThumbnail : "";
        }
        else {
            _thumbnailURL = bookmark.thumbnail.url ? bookmark.thumbnail.url : "";
        }
        if (bookmark.viewpoint.targetGeometry.spatialReference.isGeographic === true) {
            if (bookmark.viewpoint.targetGeometry.type === "point") {
                let _point = bookmark.viewpoint.targetGeometry;
                _centroid.x = _point.longitude;
                _centroid.y = _point.latitude;
            }
            else if (bookmark.viewpoint.targetGeometry.type === "polygon") {
                let _poly = bookmark.viewpoint.targetGeometry;
                _centroid.x = _poly.centroid.longitude;
                _centroid.y = _poly.centroid.latitude;
            }
            else if (bookmark.viewpoint.targetGeometry.type === "extent") {
                let _ext = bookmark.viewpoint.targetGeometry;
                _centroid.x = _ext.center.longitude;
                _centroid.y = _ext.center.latitude;
            }
        }
        else {
            if (bookmark.viewpoint.targetGeometry.type === "point") {
                let _point = bookmark.viewpoint.targetGeometry;
                _centroid.x = _point.x;
                _centroid.y = _point.y;
            }
            else if (bookmark.viewpoint.targetGeometry.type === "polygon") {
                let _poly = bookmark.viewpoint.targetGeometry;
                _centroid.x = _poly.centroid.x;
                _centroid.y = _poly.centroid.y;
            }
            else if (bookmark.viewpoint.targetGeometry.type === "extent") {
                let _ext = bookmark.viewpoint.targetGeometry;
                _centroid.x = _ext.center.x;
                _centroid.y = _ext.center.y;
            }
        }
        // _bookmark.id = bookmark.name;
        // _bookmark.label = _label;
        // _bookmark.thumbnailURL = _thumbnailURL
        // _bookmark.centroid = _centroid;
        // _bookmark.scale = bookmark.viewpoint.scale;
        // _bookmark.spatialreference = _spatialReference;
        // let jsonBookmark = JSON.stringify(_bookmark);
        let jsonBookmark = {
            "id": bookmark.name,
            "label": {},
            "thumbnailurl": _thumbnailURL,
            "centroid": {
                "x": _centroid.x,
                "y": _centroid.y
            },
            "scale": bookmark.viewpoint.scale,
            "spatialreference": {
                "wkid": bookmark.viewpoint.targetGeometry.spatialReference.wkid
            }
        };
        _localeList.forEach(locale => {
            /* Can't get label language from an esri bookmark.
            All languages are assigned the same value.*/
            jsonBookmark["label"][locale] = bookmark.name;
        });
        bookmarkArray.push(jsonBookmark);
    });
    return JSON.stringify(bookmarkArray);
}
async function wbwAsyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        // console.log("Promise: callback()");
        await callback(array[index], index, array);
    }
}
async function cookieVMAsyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        // console.log("Promise: callback()");
        await callback(array[index], index, array);
    }
}
export async function setBookmarksCookie(cookies, _esriBookmarks, _localeList, _defaultThumbnail) {
    cookies.forEach(_cookie => {
        if (_cookie.id.toLowerCase() === "bookmarks") {
            if (_cookie.accepted === true) {
                let jsonBookmarks = convertEsriBookmarksToJSONBookmarks(_esriBookmarks.bookmarks, _localeList, _defaultThumbnail);
                // console.log(`jsonBookmarks: ${jsonBookmarks}`);
                _cookie.setCookie(jsonBookmarks);
            }
            else {
                _cookie.deleteCookie();
            }
            return;
        }
    });
}
//# sourceMappingURL=WidgetBarViewModel.js.map