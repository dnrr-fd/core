// @ts-check
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import esriConfig from "@arcgis/core/config.js";
import Portal from "@arcgis/core/portal/Portal";
import PortalGroup from "@arcgis/core/portal/PortalGroup";
import PortalItem from "@arcgis/core/portal/PortalItem";
import PortalQueryResult from "@arcgis/core/portal/PortalQueryResult";
import PortalBasemapsSource from "@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource";
import WidgetBar, { widgetBarRootURL, widgetBarWidgetCloseFocusElement } from "./WidgetBar"
import { WidgetBarWidget, BookmarksWidget, _Bookmark, WidgetBarWidgetLocale, DefaultCreateOptions, ScreenshotSettings, AddLayerWidget, _Layer, _BMGGroup, _BasemapGalleryGroups, _Basemaps } from "../class/_WidgetBar";
import { BasemapGalleryWidget, _Basemap, MeasurementWidget, SketchWidget, PrintWidget, SupportWidget, Centroid, wbwObject } from "../class/_WidgetBar";
import { LegendStyle } from "../class/_Legend";
import { CookiesVM } from "../class/_Cookie";
import { getNormalizedLocale } from '@dnrr_fd/util/locale'
import { returnConfig } from "@dnrr_fd/util";

import Expand from "@arcgis/core/widgets/Expand";
import Legend from "@arcgis/core/widgets/Legend";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery";
import Sketch from "@arcgis/core/widgets/Sketch";
import Print from "@arcgis/core/widgets/Print";
import Bookmarks from "@arcgis/core/widgets/Bookmarks";
import Collection from "@arcgis/core/core/Collection";
import Bookmark from "@arcgis/core/webmap/Bookmark";
import LocalBasemapsSource from "@arcgis/core/widgets/BasemapGallery/support/LocalBasemapsSource";
import Basemap from "@arcgis/core/Basemap";
import Viewpoint from "@arcgis/core/Viewpoint";
import Point from "@arcgis/core/geometry/Point";
import Polygon from "@arcgis/core/geometry/Polygon";
import Extent from "@arcgis/core/geometry/Extent";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer";

import Support from "../support/Support";
import Button from "../button/Button";
import MeasurementDNRR from "../measurement/Measurement";
import AddLayer from "../addlayer/AddLayer"


// Import local assets
import * as legendT9n_en from '../legend/assets/t9n/en.json'
import * as legendT9n_fr from '../legend/assets/t9n/fr.json'
var legend_defaultT9n = legendT9n_en;

import * as addLayerT9n_en from '../addlayer/assets/t9n/en.json'
import * as addLayerT9n_fr from '../addlayer/assets/t9n/fr.json'
var addLayer_defaultT9n = addLayerT9n_en;

import * as bookmarksT9n_en from '../bookmarks/assets/t9n/en.json'
import * as bookmarksT9n_fr from '../bookmarks/assets/t9n/fr.json'
var bookmarks_defaultT9n = bookmarksT9n_en;

import * as basemapGalleryT9n_en from '../basemapgallery/assets/t9n/en.json'
import * as basemapGalleryT9n_fr from '../basemapgallery/assets/t9n/fr.json'
var basemapGallery_defaultT9n = basemapGalleryT9n_en;

import * as measurementT9n_en from '../measurement/assets/t9n/en.json'
import * as measurementT9n_fr from '../measurement/assets/t9n/fr.json'
var measurement_defaultT9n = measurementT9n_en;

import * as sketchT9n_en from '../sketch/assets/t9n/en.json'
import * as sketchT9n_fr from '../sketch/assets/t9n/fr.json'
var sketch_defaultT9n = sketchT9n_en;

import * as printT9n_en from '../print/assets/t9n/en.json'
import * as printT9n_fr from '../print/assets/t9n/fr.json'
var print_defaultT9n = printT9n_en;

import * as supportT9n_en from '../support/assets/t9n/en.json'
import * as supportT9n_fr from '../support/assets/t9n/fr.json'
var support_defaultT9n = supportT9n_en;

export var bookmarksWidget: Expand|null;

var widgetBarWidgets = new Array<wbwObject>();
var widgetsAssetsPath: string;
var widgetBarGroup = "widget-bar-group"
var dnrr_agol_portal = "https://nsdnr-forestry.maps.arcgis.com";
var thePortal: Portal;

export async function createWidgetsForWidgetBar(widgetBar: WidgetBar): Promise<Array<wbwObject>|null> {
    var _mapView = widgetBar.mapView;
    var widgetBarWidgetArray = widgetBar.widgets;
    var _cookies = widgetBar.cookies;
    var _localeList = widgetBar.localeList;

    return new Promise(resolve => {
        widgetsAssetsPath = `${widgetBarRootURL}assets/widgets/`;
        wbwAsyncForEach(widgetBarWidgetArray, async (widget: WidgetBarWidget) => {
            if (widget.id && typeof widget.id === "string") {
                switch(widget.id.toUpperCase()) {
                    case "LEGEND":
                        await addLegend(widget as WidgetBarWidget, _mapView).then(legendWidget => {
                            if (legendWidget) {
                                legendWidget.when(() => {
                                    widgetBarWidgets.push(new wbwObject(legendWidget));
                                    // console.log("Legend widget added to array.");
                                });
                            }
                        });
                        break;
                    case "ADDLAYER":
                        await addAddLayer(widget as WidgetBarWidget, _mapView).then(addLayerWidget => {
                            if (addLayerWidget) {
                                addLayerWidget.when(() => {
                                    widgetBarWidgets.push(new wbwObject(addLayerWidget));
                                    // console.log("Bookmarks widget added to array.");
                                });
                            }
                        });
                        break;
                    case "BOOKMARKS":
                        await addBookmarks(widget as WidgetBarWidget, _mapView, _cookies, _localeList).then(bookmarksWidget => {
                            if (bookmarksWidget) {
                                bookmarksWidget.when(() => {
                                    widgetBarWidgets.push(new wbwObject(bookmarksWidget));
                                    // console.log("Bookmarks widget added to array.");
                                });
                            }
                        });
                        break;
                    case "BASEMAPGALLERY":
                        await addBasemapGallery(widget as WidgetBarWidget, _mapView, _localeList).then(basemapgalleryWidget => {
                            if (basemapgalleryWidget) {
                                basemapgalleryWidget.when(() => {
                                    widgetBarWidgets.push(new wbwObject(basemapgalleryWidget));
                                    // console.log("BasemapGallery widget added to array.");
                                });
                            }
                        });
                        break;
                    case "MEASUREMENT":
                        await addMeasurement(widget as WidgetBarWidget, _mapView).then(measurementWidget => {
                            if (measurementWidget) {
                                measurementWidget.when(() => {
                                    widgetBarWidgets.push(new wbwObject(measurementWidget));
                                    // console.log("Measurement widget added to array.");
                                });
                            }
                        });
                        break;
                    case "SKETCH":
                        await addSketch(widget as WidgetBarWidget, _mapView).then(sketchWidget => {
                            if (sketchWidget) {
                                sketchWidget.when(() => {
                                    widgetBarWidgets.push(new wbwObject(sketchWidget));
                                    // console.log("Sketch widget added to array.");
                                });
                            }
                        });
                        break;
                    case "PRINT":
                        await addPrint(widget as WidgetBarWidget, _mapView).then(printWidget => {
                            if (printWidget) {
                                widgetBarWidgets.push(new wbwObject(printWidget));
                            }
                        });
                        break;
                    case "SUPPORT":
                        await addSupport(widget as WidgetBarWidget, _mapView).then(supportWidget => {
                            if (supportWidget) {
                                widgetBarWidgets.push(new wbwObject(supportWidget, false));
                            }
                        });
                        break;
                    default:
                        console.log(`Map Widget: ${widget.id} is not configured for this application!`);
                }
            } else {
                console.log("Improper configuration of a map widget! Please check the configuration file.");
            }
        }).then(() => {
            // console.log("Resolved: createWidgetsForWidgetBar()");
            resolve(widgetBarWidgets);
        });
    })

}

async function addLegend(widget: WidgetBarWidget, _mapView: MapView): Promise<Expand|null> {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();

        // Get the default asset from language.
        legend_defaultT9n = (lang === 'fr' ? legendT9n_fr : legendT9n_en);

        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnConfig(configFile, null).then(config => {
            var legendT9nPath = widget.t9nPath? `${widget.t9nPath}/${lang}.json`: null as string|null;
            var _legend = new Legend();
            var _legend_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config as WidgetBarWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as WidgetBarWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as WidgetBarWidget, "group", widget.group? widget.group: widgetBarGroup) as string;
            var _label: string;

            returnConfig(legendT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = legend_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults as WidgetBarWidgetLocale, "label", lang==="en"? "Legend": "Légende") as string;
            }).then(function (){
                var _style = new LegendStyle();
                _style.type = "card";
                _style.layout = "auto";

                if(window.screen.width > 992) {
                    _style.type = "classic";
                    _style.layout = "stack";
                }
                _legend.label = _label;
                _legend.view = _mapView;
                _legend.style = _style;
    
                _legend_expand.id = widget.id;
                _legend_expand.view = _mapView
                _legend_expand.visible = _visible
                _legend_expand.content = _legend
                _legend_expand.expanded = _expanded
                _legend_expand.group = _group
                _legend_expand.container = widget.id
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

async function addAddLayer(widget: WidgetBarWidget, _mapView: MapView): Promise<Expand|null> {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();

        // Get the default asset from language.
        addLayer_defaultT9n = (lang === 'fr' ? addLayerT9n_fr : addLayerT9n_en);

        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnConfig(configFile, null).then(config => {
            var addLayerT9nPath = widget.t9nPath? `${widget.t9nPath}/${lang}.json`: null as string|null;
            var _addLayer = new AddLayer();
            var _addLayer_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config as AddLayerWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as AddLayerWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as AddLayerWidget, "group", widget.group? widget.group: widgetBarGroup) as string;
            var _apiKey = getWidgetConfigKeyValue(config as AddLayerWidget, "apiKey") as string;
            var _generateURL = getWidgetConfigKeyValue(config as AddLayerWidget, "generateURL", "https://www.arcgis.com/sharing/rest/content/features/generate") as string;
            var _rootFocusElement = getWidgetConfigKeyValue(config as AddLayerWidget, "rootFocusElement", "mainID") as string;
            var _label: string;

            returnConfig(addLayerT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = addLayer_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults as WidgetBarWidgetLocale, "label", lang==="en"? "Add Layer": "Ajouter une Couche") as string;
            }).then(function (){
                _addLayer.apiKey = _apiKey;
                _addLayer.label = _label;
                _addLayer.view = _mapView;
                _addLayer.generateURL = _generateURL;
                _addLayer.rootFocusElement = _rootFocusElement;
    
                _addLayer_expand.id = widget.id;
                _addLayer_expand.view = _mapView
                _addLayer_expand.visible = _visible
                _addLayer_expand.content = _addLayer
                _addLayer_expand.expanded = _expanded
                _addLayer_expand.group = _group
                _addLayer_expand.container = widget.id
                _addLayer_expand.collapseIconClass = "esri-icon-up";
                _addLayer_expand.expandIconClass = "esri-icon-plus-circled";
    
                _mapView.when(() => {
                    _addLayer_expand.expandTooltip = `${_addLayer.label}`;
                });

                _addLayer_expand.when(() => {
                    console.log("Add Layer widget rendered.");
                    resolve(_addLayer_expand);
                });
            });
        });
    });
}

async function addBookmarks(widget: WidgetBarWidget, _mapView: MapView, _cookies: Array<CookiesVM>, _localeList: Array<string>): Promise<Expand|null> {
    return new Promise(resolve => {
        var configFile: string|null;
        var lang = getNormalizedLocale();

        // Get the default asset from language.
        bookmarks_defaultT9n = (lang === 'fr' ? bookmarksT9n_fr : bookmarksT9n_en);

        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnConfig(configFile, null).then(async config => {
            var bookmarksT9nPath = widget.t9nPath? `${widget.t9nPath}/${lang}.json`: null as string|null;
            var _bookmarks_expand = new Expand();
            var _bookmarks = await createBookmarks(config as BookmarksWidget, _mapView, _cookies, _localeList, `${widgetsAssetsPath}${widget.id}/img/default-thumb.png`) as Bookmarks;
            var _visible = getWidgetConfigKeyValue(config as BookmarksWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as BookmarksWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as BookmarksWidget, "group", widget.group? widget.group: widgetBarGroup) as string;
            var _label: string;

            returnConfig(bookmarksT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = bookmarks_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults as WidgetBarWidgetLocale, "label", lang==="en"? "Bookmarks": "Signets") as string;
            }).then(function (){
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

async function addBasemapGallery(widget: WidgetBarWidget, _mapView: MapView, _localeList: Array<string>): Promise<Expand|null> {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();

        // Get the default asset from language.
        basemapGallery_defaultT9n = (lang === 'fr' ? basemapGalleryT9n_fr : basemapGalleryT9n_en);

        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnConfig(configFile, null).then(config => {
            var basemapGalleryT9nPath = widget.t9nPath? `${widget.t9nPath}/${lang}.json`: null as string|null;
            var _basemapGallery_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config as BasemapGalleryWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as BasemapGalleryWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as BasemapGalleryWidget, "group", widget.group? widget.group: widgetBarGroup) as string;
            var _bmGalleryGroups = getWidgetConfigKeyValue(config as BasemapGalleryWidget, "basemapGalleryGroups") as _BasemapGalleryGroups|null;
            var _default_thumbnail = getWidgetConfigKeyValue(config as BasemapGalleryWidget, "defaultThumbnail") as string|null;
            var _apiKey = getWidgetConfigKeyValue(config as BasemapGalleryWidget, "apiKey") as string|null;
            var _label: string;

            returnConfig(basemapGalleryT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = basemapGallery_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults as WidgetBarWidgetLocale, "label", lang==="en"? "Basemap Gallery": "Bibliothèque de fonds de carte") as string;
            }).then(async function (){

                if (_apiKey) {
                    esriConfig.apiKey = _apiKey;
                }
                
                console.log("BasemapGallery widget rendered.");
                // console.log(`API Key: ${esriConfig.apiKey}`);

                var _basemapGallery: BasemapGallery;
                var _config = config  as BasemapGalleryWidget;
                esriConfig.portalUrl = dnrr_agol_portal

                thePortal = new Portal();
                thePortal.load().then(() => {
                    var _basemapArray = new Array<Basemap>();
                    var _basemapIds = new Array<string>();
                    var useCurrentBasemap = true;

                    if (_bmGalleryGroups && _bmGalleryGroups[lang]) {
                        if (_bmGalleryGroups.basemapSourcePortal && _bmGalleryGroups.basemapSourcePortal.length > 0) {
                            esriConfig.portalUrl = _bmGalleryGroups.basemapSourcePortal;
                        }
                        thePortal = new Portal();
                        thePortal.load().then(async () => {
                            var getBMArray = new Promise<void>((resolve) => {
                                _bmGalleryGroups![lang]!.forEach((_bmGallery: _BMGGroup, index: number, array: string | any[]) => {
                                    thePortal.queryGroups({
                                        query: `id: ${_bmGallery.id}`
                                    }).then(portalGroups => {
                                        portalGroups.results.forEach(function(portalGroup: PortalGroup) {
                                            portalGroup.queryItems({
                                                num: _bmGallery.maxResults,
                                                sortField: _bmGallery.sortField,
                                                sortOrder: _bmGallery.sortOrder,
                                                query: _bmGallery.query
                                            }).then(function(pqr: PortalQueryResult) {
                                                useCurrentBasemap = catalogBasemaps(pqr, _mapView, _basemapIds, _basemapArray, useCurrentBasemap);
                                            });
                                        });
                                    }).finally(() => {
                                        if (index === array.length -1) resolve();                                    
                                    });
                                });
                            });

                            getBMArray.then(() => {
                                _basemapGallery = createPortalBasemapGallery(_basemapGallery, _mapView, _label, useCurrentBasemap, _basemapArray, _basemapGallery_expand, widget, _visible, _expanded, _group, resolve);
                            });
                        });
                    } else {
                        if (_config.basemaps) {
                            let basemaps = _config.basemaps as _Basemaps;
                            var _portal = null;
                            if (basemaps.basemapSourcePortal && basemaps.basemapSourcePortal.length > 0) {
                                _portal = basemaps.basemapSourcePortal;
                                esriConfig.portalUrl = _portal;
                            }
                            if (basemaps[lang] && basemaps[lang].length > 0) {
                                let basemapArray = basemaps[lang] as Array<_Basemap>;
                                if (_portal) {
                                    var _portalbasemaps = createBasemapArray(basemapArray, _default_thumbnail);
                                    // add basemap to the array
                                    var verifyPortalBMs = new Promise<void>((resolve) => {
                                        _portalbasemaps!.forEach((pbm: Basemap, index: number, array: string | any[]) => {
                                            // Query the portal to see if the basemap exists
                                            thePortal.queryItems({
                                                query: `id: ${pbm.portalItem.id}`
                                            }).then((pqr: PortalQueryResult) => {
                                                useCurrentBasemap = catalogBasemaps(pqr, _mapView, _basemapIds, _basemapArray, useCurrentBasemap);
                                            }).finally(() => {
                                                if (index === array.length -1) resolve();                                    
                                            });
                                        })
                                    });

                                    verifyPortalBMs.then(() => {
                                        _basemapGallery = createPortalBasemapGallery(_basemapGallery, _mapView, _label, useCurrentBasemap, _basemapArray, _basemapGallery_expand, widget, _visible, _expanded, _group, resolve);
                                    });
                                } else {
                                    var _basemaps = createBasemapArray(basemapArray, _default_thumbnail, false);
                                    _basemaps.unshift(_mapView.map.basemap);
                                    _basemapGallery = createLocalBasemapGallery(_basemapGallery, _mapView, _label, _basemaps, _basemapGallery_expand, widget, _visible, _expanded, _group, resolve);
                                }
                            } else {
                                var _basemaps = [_mapView.map.basemap];
                                _basemapGallery = createLocalBasemapGallery(_basemapGallery, _mapView, _label, _basemaps, _basemapGallery_expand, widget, _visible, _expanded, _group, resolve);
                            }
                        } else {
                            var _basemaps = [_mapView.map.basemap];
                            _basemapGallery = createLocalBasemapGallery(_basemapGallery, _mapView, _label, _basemaps, _basemapGallery_expand, widget, _visible, _expanded, _group, resolve);
                        }
                    }
                });
            });
        });
    });
}

function createPortalBasemapGallery(_basemapGallery: BasemapGallery, _mapView: MapView, _label: string, useCurrentBasemap: boolean, _basemapArray: Basemap[], _basemapGallery_expand: Expand, widget: WidgetBarWidget, _visible: boolean, _expanded: boolean, _group: string, resolve: (value: Expand | PromiseLike<Expand | null> | null) => void) {
    _basemapGallery = new BasemapGallery({
        view: _mapView,
        label: _label,
        source: new PortalBasemapsSource({
            updateBasemapsCallback: function (items) {
                if (useCurrentBasemap === true) {
                    // add basemap to the array
                    _basemapArray.unshift(_mapView.map.basemap);
                }
                // Clear the default list of items
                items = _basemapArray;
                // return the array of basemaps
                return items;
            }
        })
    });
    completeBookmarkGallery(_basemapGallery_expand, widget, _mapView, _visible, _basemapGallery, _expanded, _group, resolve);
    return _basemapGallery;
}

function createLocalBasemapGallery(_basemapGallery: BasemapGallery, _mapView: MapView, _label: string, _basemaps: Basemap[], _basemapGallery_expand: Expand, widget: WidgetBarWidget, _visible: boolean, _expanded: boolean, _group: string, resolve: (value: Expand | PromiseLike<Expand | null> | null) => void) {
    _basemapGallery = new BasemapGallery({
        view: _mapView,
        label: _label,
        source: new LocalBasemapsSource({
            basemaps: _basemaps
        })
    });
    completeBookmarkGallery(_basemapGallery_expand, widget, _mapView, _visible, _basemapGallery, _expanded, _group, resolve);
    return _basemapGallery;
}

function catalogBasemaps(pqr: PortalQueryResult, _mapView: MapView, _basemapIds: string[], _basemapArray: Basemap[], useCurrentBasemap: boolean) {
    pqr.results.forEach(function (portalItem: PortalItem) {
        var pID = portalItem.id;
        var pTitle = portalItem.title.toLowerCase();
        var cTitle = _mapView.map.basemap.title.toLowerCase();
        if (!_basemapIds.includes(pID)) {
            _basemapIds.push(pID);
            _basemapArray.push(new Basemap({
                portalItem: portalItem
            }));
        } else {
            console.log(`Basemap: ${portalItem.title} already exists and will not be added.`);
        }

        if (pTitle == cTitle) {
            useCurrentBasemap = false;
            console.log(`Basemap: ${portalItem.title} already exists in the current map.`);
        }
    });
    return useCurrentBasemap;
}

function completeBookmarkGallery(_basemapGallery_expand: Expand, widget: WidgetBarWidget, _mapView: MapView, _visible: boolean, _basemapGallery: BasemapGallery, _expanded: boolean, _group: string, resolve: (value: Expand | PromiseLike<Expand | null> | null) => void) {
    _basemapGallery_expand.id = widget.id;
    _basemapGallery_expand.view = _mapView;
    _basemapGallery_expand.visible = _visible;
    _basemapGallery_expand.content = _basemapGallery;
    _basemapGallery_expand.expanded = _expanded;
    _basemapGallery_expand.group = _group;
    _basemapGallery_expand.container = widget.id;
    _basemapGallery_expand.collapseIconClass = "esri-icon-up";

    _mapView.when(() => {
        _basemapGallery_expand.expandTooltip = `${_basemapGallery.label}`;
    });

    _basemapGallery_expand.when(() => {
        _basemapGallery.source.basemaps.forEach(basemap => {
            basemap.baseLayers.forEach(layer => {
                var lyr = layer as MapImageLayer;
                console.log(`Layer URL (${lyr.id}): ${lyr.url}`);
            });
        });
        resolve(_basemapGallery_expand);
    });
}

async function addMeasurement(widget: WidgetBarWidget, _mapView: MapView): Promise<Expand|null> {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();

        // Get the default asset from language.
        measurement_defaultT9n = (lang === 'fr' ? measurementT9n_fr : measurementT9n_en);

        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnConfig(configFile, null).then( config => {
            var measurementT9nPath = widget.t9nPath? `${widget.t9nPath}/${lang}.json`: null as string|null;
            var _measurement = new MeasurementDNRR();
            var _measurement_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config as MeasurementWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as MeasurementWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as MeasurementWidget, "group", widget.group? widget.group: widgetBarGroup) as string;
            var _map_location = getWidgetConfigKeyValue(config as MeasurementWidget, "measurement_map_location", "bottom-right") as "top-right"|"top-left"|"bottom-right"|"bottom-left";
            var _index_pos = getWidgetConfigKeyValue(config as MeasurementWidget, "measurement_index_position", 0) as number;
            var _label: string;

            returnConfig(measurementT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = sketch_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults as WidgetBarWidgetLocale, "label", lang==="en"? "Sketch": "Dessin") as string;
            }).then(function (){

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
                _measurement_expand.expandIconClass = "esri-icon-measure";
    
                _measurement_expand.watch("expanded", function(measurementExpandedValue) {
                    if (measurementExpandedValue === false) {
                        _measurement.clear();
                    }
                });

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

async function addSketch(widget: WidgetBarWidget, _mapView: MapView): Promise<Expand|null> {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();

        // Get the default asset from language.
        sketch_defaultT9n = (lang === 'fr' ? sketchT9n_fr : sketchT9n_en);

        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnConfig(configFile, null).then( config => {
            var sketchT9nPath = widget.t9nPath? `${widget.t9nPath}/${lang}.json`: null as string|null;
            var _sketch = new Sketch();
            var _sketch_expand = new Expand();
            var _graphicsLayer = new GraphicsLayer();
            var _visible = getWidgetConfigKeyValue(config as SketchWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as SketchWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as SketchWidget, "group", widget.group? widget.group: widgetBarGroup) as string;
            var _mode = getWidgetConfigKeyValue(config as SketchWidget, "mode", "update") as "update"|"single"|"continuous";
            var _label: string;
            var _layerTitle: string;

            returnConfig(sketchT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = sketch_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults as WidgetBarWidgetLocale, "label", lang==="en"? "Sketch": "Dessin") as string;
                _layerTitle = getWidgetLocaleConfigKeyValue(t9nResults as WidgetBarWidgetLocale, "layerTitle", lang==="en"? "Sketch Layer": "Couche de Dessin") as string;
            }).then(function (){
                _graphicsLayer.title = _layerTitle;
                _sketch.label = _label;
                _sketch.view = _mapView;
                _sketch.layer = _graphicsLayer;
                _sketch.creationMode = _mode;
    
                _sketch_expand.id = widget.id;
                _sketch_expand.view = _mapView
                _sketch_expand.visible = _visible
                _sketch_expand.content = _sketch
                _sketch_expand.expanded = _expanded
                _sketch_expand.group = _group
                _sketch_expand.container = widget.id
                _sketch_expand.collapseIconClass = "esri-icon-up";

                _sketch_expand.watch("expanded", function(sketchExpandedValue) {
                    if (sketchExpandedValue === true) {
                        _mapView.map.add(_graphicsLayer);
                    } else {
                        _mapView.map.remove(_graphicsLayer);
                    }
                });

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

async function addPrint(widget: WidgetBarWidget, _mapView: MapView): Promise<Expand|null> {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();

        // Get the default asset from language.
        print_defaultT9n = (lang === 'fr' ? printT9n_fr : printT9n_en);

        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnConfig(configFile, null).then( config => {
            var printT9nPath = widget.t9nPath? `${widget.t9nPath}/${lang}.json`: null as string|null;
            var _print = new Print();
            var _print_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config as PrintWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as PrintWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as PrintWidget, "group", widget.group? widget.group: widgetBarGroup) as string;
            var _psURL = getWidgetConfigKeyValue(config as PrintWidget, "printServiceURL", "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task") as string;
            var _label: string;

            returnConfig(printT9nPath, null).then(t9nResults => {
                if (t9nResults === null) {
                    console.log(`No T9n config file passed for ${widget.id}. Using core default instead.`);
                    t9nResults = print_defaultT9n;
                }
                _label = getWidgetLocaleConfigKeyValue(t9nResults as WidgetBarWidgetLocale, "label", lang==="en"? "Print": "Imprimer") as string;
            }).then(function (){

                _print.label = _label;
                _print.view = _mapView;
                _print.printServiceUrl = _psURL;
    
                _print_expand.id = widget.id;
                _print_expand.view = _mapView
                _print_expand.visible = _visible
                _print_expand.content = _print
                _print_expand.expanded = _expanded
                _print_expand.group = _group
                _print_expand.container = widget.id
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

async function addSupport(widget: WidgetBarWidget, _mapView: MapView): Promise<Button|null> {
    return new Promise(resolve => {
        var _supportID = "supportID";
        var lang = getNormalizedLocale();

        // Get the default asset from language.
        support_defaultT9n = (lang === 'fr' ? supportT9n_fr : supportT9n_en);

        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnConfig(configFile, null).then( config => {
            var supportT9nPath = widget.t9nPath? `${widget.t9nPath}/${lang}.json`: null as string|null;
            var _visible = getWidgetConfigKeyValue(config as SupportWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _container = getWidgetConfigKeyValue(config as SupportWidget, "container", _supportID) as string;
            var _sURL = getWidgetConfigKeyValue(config as SupportWidget, "serviceURL", "https://nsgi-uat.cio.gov.ns.ca/feedback-api/api/SendFeedback") as string;
            var _pKey = getWidgetConfigKeyValue(config as SupportWidget, "privateKey", "TRdf4t5WpLhWRxPe") as string;
            var _label: string;

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
                _label = getWidgetLocaleConfigKeyValue(t9nResults as WidgetBarWidgetLocale, "label", lang==="en"? "Support Form": "Formulaire d'assistance") as string;
            }).then(function (){

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

export function removeWidgetsFromWidgetBar(_mapView: MapView) {
    widgetBarWidgets.forEach(wbwObj => {
        if (wbwObj) {
            var widget_node = document.getElementById(wbwObj.wbWidget.id) as HTMLDivElement;
            widget_node.innerHTML = "";
        }
    });
    widgetBarWidgets = [];
}

function getWidgetConfigKeyValue(widget: WidgetBarWidget, configKey: string, defaultValue=null as string|number|boolean|null) {
    if (widget) {
        var keys = Object.keys(widget);
        if (keys.includes(configKey)) {
            return widget[configKey];
        }
    }
    return defaultValue;
}

function getBookmarkConfigKeyValue(bookmark: _Bookmark, configKey: string, defaultValue=null as string|number|boolean|null) {
    if (bookmark) {
        var keys = Object.keys(bookmark);
        if (keys.includes(configKey)) {
            return bookmark[configKey];
        }
    }
    return defaultValue;
}

function getWidgetLocaleConfigKeyValue(widgetLocale: WidgetBarWidgetLocale, configKey: string, defaultValue=null as string|number|boolean|null) {
    if (widgetLocale) {
        var keys = Object.keys(widgetLocale);
        if (keys.includes(configKey)) {
            return widgetLocale[configKey];
        }
    }
    return defaultValue;
}

async function createBookmarks(_config: BookmarksWidget, _view: MapView, _cookies: Array<CookiesVM>, _localeList: Array<string>, default_thumbnail: string): Promise<Bookmarks> {
    return new Promise(resolve => {
        var _editingEnabled = getWidgetConfigKeyValue(_config, "editingEnabled", true);
        var defaultCreateOptions = new DefaultCreateOptions();
        var screenshotSettings = new ScreenshotSettings();
        screenshotSettings.width = 100;
        screenshotSettings.height = 62;
        defaultCreateOptions.takeScreenshot = true;
        defaultCreateOptions.captureViewpoint = true;
        defaultCreateOptions.screenshotSettings = screenshotSettings;

        var _defaultCreateOptions = getWidgetConfigKeyValue(_config, "defaultCreateOptions", null) as DefaultCreateOptions|null;
        if (_defaultCreateOptions === null) {
            _defaultCreateOptions = defaultCreateOptions
        }
        var _bookmarks = new Bookmarks({
            view: _view,
            editingEnabled: _editingEnabled as boolean,
            defaultCreateOptions: _defaultCreateOptions
        });

        var bookmarks_list = new Array<_Bookmark>();
        var bookmarks_list_config = new Array<_Bookmark>();
        var bookmarks_list_cookies = new Array<_Bookmark>();

        // Default bookmarks from config file
        if (_config.bookmarks) {
            bookmarks_list_config = _config.bookmarks;
        }

        // Bookmarks from cookies
        cookieVMAsyncForEach(_cookies, async (cookie: CookiesVM) => {
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
            } else {
                bookmarks_list = bookmarks_list_config;
            }
        
            if(bookmarks_list.length > 0) {
                _bookmarks.bookmarks = convertJSONBookmarksToEsriBookmarks(bookmarks_list, default_thumbnail) as Collection<Bookmark>;
        
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

function createBasemapArray(basemapArray: Array<_Basemap>, default_thumbnail: string|null, isPortal=true as boolean): Array<Basemap> {
    var basemapResults = new Array<Basemap>();
    basemapArray.map (baseMap => {
        var _basemap: Basemap;
        var _title = baseMap.title? baseMap.title: baseMap.id? baseMap.id: "";
        var _portalItem = new PortalItem();

        if (baseMap.portalItem) {
            _portalItem = baseMap.portalItem;
        }

        var _spatialReference = new SpatialReference();
        if (baseMap.spatialReference) {
            _spatialReference = baseMap.spatialReference;
        }

        _basemap = new Basemap({
            id: baseMap.id,
            title: _title,
            thumbnailUrl: baseMap.thumbnailURL? baseMap.thumbnailURL : default_thumbnail? default_thumbnail: undefined,
            spatialReference: _spatialReference? _spatialReference: undefined
        });

        if (baseMap.layers && baseMap.layers.length > 0) {
            var _layers = new Collection<MapImageLayer>();
            var _refLayers = new Collection<MapImageLayer>();

            baseMap.layers.map(layer => {
                if (layer.url && typeof layer.url === "string") {
                    var lyr = getLayer(layer)
                    if (lyr) {
                        if (layer.isReference && layer.isReference === true) {
                            _refLayers.add(lyr);
                        } else {
                            _layers.add(lyr);
                        }
                    }
                }
            });
        
            _basemap.baseLayers = _layers;
            _basemap.referenceLayers = _refLayers;
        };

        if (isPortal === true) {
            _basemap.portalItem = _portalItem;
        }

        basemapResults.push(_basemap);
    });

    return basemapResults;
}

function getLayer(_layer: _Layer): MapImageLayer {
    var _title = _layer.title? _layer.title: _layer.id? _layer.id: "";
    var lyr = undefined;

    lyr = new MapImageLayer({
        id: _layer.id,
        title: _title,
        opacity: _layer.opacity,
        visible: _layer.visibility,
        url: _layer.url
    });

    // console.log(`Layer LoadError (${lyr.id}): ${lyr.loadError}`);
    return lyr;
}

export function convertJSONBookmarksToEsriBookmarks(_bookmarks_list: Array<_Bookmark>, _default_thumbnail: string) {
    var lang = getNormalizedLocale();
    let final_bookmarks = new Collection();

    _bookmarks_list.forEach(_bookmark => {
        let _centroid = getBookmarkConfigKeyValue(_bookmark, "centroid");
        let _spatialReference = getBookmarkConfigKeyValue(_bookmark, "spatialreference");
        let _thumbnailurl = getBookmarkConfigKeyValue(_bookmark, "thumbnailurl", _default_thumbnail);
        let _scale = getBookmarkConfigKeyValue(_bookmark, "scale", 2500);

        // Determine the label from lang
        let _name = null as string|null;
        if (_bookmark.label) {
            let lang_keys = Object.keys(_bookmark.label);
            if (_bookmark.label[lang]) {
                _name = _bookmark.label[lang];
            } else if (lang_keys.length > 0) {
                _name = _bookmark.label[lang_keys[0]];
            } else {
                let date = new Date();
                _name = lang === "en"? `Bookmark_${date.getTime()}`: `Signet_${date.getTime()}`;
            }
        }

        let sr = new SpatialReference(_spatialReference);

        if (_centroid && sr && _name) {
            let point = new Point({
                hasZ: false,
                hasM: false,
                spatialReference: sr
            });
            
            if(sr.isGeographic === false) {
                point.longitude = _centroid.x;
                point.latitude = _centroid.y;
            } else {
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
        } else {
            console.log("Bookmark failed to load. Parameters are missing!");
        }
    });
    return final_bookmarks;
}

function convertEsriBookmarksToJSONBookmarks(bookmarkCollection: Collection<Bookmark>, _localeList: Array<string>, defaultThumbnail: string) {
    var lang = getNormalizedLocale();
    let bookmarkArray = new Array<Object>();
    bookmarkCollection.forEach(bookmark => {
        var _centroid = new Centroid();
        var _thumbnailURL = "";

        if(bookmark.thumbnail.url && bookmark.thumbnail.url.includes("data:image/png")) {
            // Cookie size limit of 4096 bytes. Cannot embed Base64 imagery. Use default-thumbnail instead.
            _thumbnailURL = defaultThumbnail? defaultThumbnail: "";
        } else {
            _thumbnailURL = bookmark.thumbnail.url? bookmark.thumbnail.url: "";
        }

        if(bookmark.viewpoint.targetGeometry.type === "point") {
            let _point = bookmark.viewpoint.targetGeometry as Point;
            if (_point.longitude) {
                _centroid.x = _point.longitude;
                _centroid.y = _point.latitude;
            } else {
                _centroid.x = _point.x;
                _centroid.y = _point.y;
            }
        } else if (bookmark.viewpoint.targetGeometry.type === "polygon") {
            let _poly = bookmark.viewpoint.targetGeometry as Polygon;
            if (_poly.centroid.longitude) {
                _centroid.x = _poly.centroid.longitude;
                _centroid.y = _poly.centroid.latitude;
            } else {
                _centroid.x = _poly.centroid.x;
                _centroid.y = _poly.centroid.y;
            }
        } else if (bookmark.viewpoint.targetGeometry.type === "extent") {
            let _ext = bookmark.viewpoint.targetGeometry as Extent;
            if (_ext.center.longitude) {
                _centroid.x = _ext.center.longitude;
                _centroid.y = _ext.center.latitude;
            } else {
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

    return JSON.stringify(bookmarkArray)
}

async function wbwAsyncForEach(array: Array<WidgetBarWidget>, callback: { (widget: WidgetBarWidget): Promise<void>; (arg0: WidgetBarWidget, arg1: number, arg2: WidgetBarWidget[]): any; }) {
    for (let index = 0; index < array.length; index++) {
        // console.log("Promise: callback()");
        await callback(array[index], index, array);
    }
}

async function cookieVMAsyncForEach(array: Array<CookiesVM>, callback: { (cookie: CookiesVM): Promise<void>; (arg0: CookiesVM, arg1: number, arg2: CookiesVM[]): any; }) {
    for (let index = 0; index < array.length; index++) {
        // console.log("Promise: callback()");
        await callback(array[index], index, array);
    }
}

export async function setBookmarksCookie(cookies: Array<CookiesVM>, _esriBookmarks: Bookmarks, _localeList: Array<string>, _defaultThumbnail: string) {
    cookies.forEach(_cookie => {
        if (_cookie.id.toLowerCase() === "bookmarks") {
            if (_cookie.accepted === true) {
                let jsonBookmarks = convertEsriBookmarksToJSONBookmarks(_esriBookmarks.bookmarks, _localeList, _defaultThumbnail)
                // console.log(`jsonBookmarks: ${jsonBookmarks}`);
                _cookie.setCookie(jsonBookmarks);
            } else {
                _cookie.deleteCookie();
            }
            return;
        }
    });
}