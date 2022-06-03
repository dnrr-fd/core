// @ts-check
import MapView from "@arcgis/core/views/MapView";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import esriConfig from "@arcgis/core/config.js";
import Portal from "@arcgis/core/portal/Portal";
import PortalBasemapsSource from "@arcgis/core/widgets/BasemapGallery/support/PortalBasemapsSource";
import { widgetBarRootURL, widgetBarWidgetCloseFocusElement } from "./WidgetBar"
import { WidgetBarWidget, BookmarksWidget, _Bookmark, WidgetBarWidgetLocale, DefaultCreateOptions, ScreenshotSettings, Centroid, BasemapGalleryWidget, SketchWidget, PrintWidget, SupportWidget } from "../widget/class/_WidgetBar";
import { LegendStyle } from "../widget/class/_Legend";
import { CookiesVM } from "../widget/class/_Cookie";
import { getNormalizedLocale } from '@dnrr_fd/util/locale'

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
import Polygon from "@arcgis/core/geometry/Polygon";
import Extent from "@arcgis/core/geometry/Extent";
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Support from "../widget/support/Support";
import Button from "../widget/Button/Button";

export var legendWidget = null as Expand|null;
export var bookmarksWidget = null as Expand|null;
export var basemapgalleryWidget = null as Expand|null;
export var sketchWidget = null as Expand|null;
export var printWidget = null as Expand|null;
export var supportWidget = null as Expand|null;

var widgetBarWidgets = new Array<Expand|Button>();
var widgetsAssetsPath: string;
var widgetBarGroup = "widget-bar-group"

export async function createWidgetsForWidgetBar(_mapView: MapView, widgetBarWidgetArray: Array<WidgetBarWidget>, _cookies: Array<CookiesVM>, _localeList: Array<string>, graphicsLayer: GraphicsLayer): Promise<Array<Expand|Button>|null> {
    return new Promise(resolve => {
        widgetsAssetsPath = `${widgetBarRootURL}assets/widgets/`;
        wbwAsyncForEach(widgetBarWidgetArray, async (widget: WidgetBarWidget) => {
            if (widget.id && typeof widget.id === "string") {
                switch(widget.id.toUpperCase()) {
                    case "LEGEND":
                        await addLegend(widget as WidgetBarWidget, _mapView).then(legendWidget => {
                            if (legendWidget) {
                                legendWidget.when(() => {
                                    widgetBarWidgets.push(legendWidget);
                                    console.log("Legend widget added to array.");
                                });
                            }
                        });
                        break;
                    case "BOOKMARKS":
                        await addBookmarks(widget as WidgetBarWidget, _mapView, _cookies, _localeList).then(bookmarksWidget => {
                            if (bookmarksWidget) {
                                bookmarksWidget.when(() => {
                                    widgetBarWidgets.push(bookmarksWidget);
                                    console.log("Bookmarks widget added to array.");
                                });
                            }
                        });
                        break;
                    case "BASEMAPGALLERY":
                        await addBasemapGallery(widget as WidgetBarWidget, _mapView).then(basemapgalleryWidget => {
                            if (basemapgalleryWidget) {
                                basemapgalleryWidget.when(() => {
                                    widgetBarWidgets.push(basemapgalleryWidget);
                                    console.log("BasemapGallery widget added to array.");
                                });
                            }
                        });
                        break;
                    case "SKETCH":
                        await addSketch(widget as WidgetBarWidget, _mapView, graphicsLayer).then(sketchWidget => {
                            if (sketchWidget) {
                                sketchWidget.when(() => {
                                    widgetBarWidgets.push(sketchWidget);
                                    console.log("Sketch widget added to array.");
                                });
                            }
                        });
                        break;
                    case "PRINT":
                        await addPrint(widget as WidgetBarWidget, _mapView).then(printWidget => {
                            if (printWidget) {
                                widgetBarWidgets.push(printWidget);
                            }
                        });
                        break;
                    case "SUPPORT":
                        await addSupport(widget as WidgetBarWidget, _mapView).then(supportWidget => {
                            if (supportWidget) {
                                widgetBarWidgets.push(supportWidget);
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
            console.log("Resolved: createWidgetsForWidgetBar()");
            resolve(widgetBarWidgets);
        });
    })

}

async function addLegend(widget: WidgetBarWidget, _mapView: MapView): Promise<Expand|null> {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();
        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(config => {
            var legendT9nPath = `${widgetsAssetsPath}${widget.id}/t9n/${widget.id}_${lang}.json`;
            var _legend = new Legend();
            var _legend_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config as WidgetBarWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as WidgetBarWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as WidgetBarWidget, "group", widget.group? widget.group: widgetBarGroup) as string;
            var _label: string;

            returnWidgetConfig(legendT9nPath, legendT9nPath).then(t9nResults => {
                _label = getWidgetLocaleConfigKeyValue(t9nResults as WidgetBarWidgetLocale, "label", lang==="en"? "Legend": "Légende") as string;
            }).then(function (){
                // var newClassList = JSON.parse(JSON.stringify(_widgetClassList));
                // newClassList.push(widget.id);
                // createReactDiv(widgetBarContainer, widget.id, newClassList);

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

async function addBookmarks(widget: WidgetBarWidget, _mapView: MapView, _cookies: Array<CookiesVM>, _localeList: Array<string>): Promise<Expand|null> {
    return new Promise(resolve => {
        var configFile: string|null;
        var lang = getNormalizedLocale();
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(async config => {
            var basemapGalleryT9nPath = `${widgetsAssetsPath}${widget.id}/t9n/${widget.id}_${lang}.json`;
            var _bookmarks_expand = new Expand();
            var _bookmarks = await createBookmarks(config as BookmarksWidget, _mapView, _cookies, _localeList, `${widgetsAssetsPath}${widget.id}/img/default-thumb.png`) as Bookmarks;
            var _visible = getWidgetConfigKeyValue(config as BookmarksWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as BookmarksWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as BookmarksWidget, "group", widget.group? widget.group: widgetBarGroup) as string;
            var _label: string;

            returnWidgetConfig(basemapGalleryT9nPath, basemapGalleryT9nPath).then(t9nResults => {
                _label = getWidgetLocaleConfigKeyValue(t9nResults as WidgetBarWidgetLocale, "label", lang==="en"? "Bookmarks": "Signets") as string;
            }).then(function (){
                // var newClassList = JSON.parse(JSON.stringify(_widgetClassList));
                // newClassList.push(widget.id);
                // createReactDiv(widgetBarContainer, widget.id, newClassList);

                _bookmarks_expand.id = widget.id;
                _bookmarks_expand.view = _mapView;
                _bookmarks_expand.visible = _visible;
                _bookmarks_expand.content = _bookmarks;
                _bookmarks_expand.expanded = _expanded;
                _bookmarks_expand.group = _group;
                _bookmarks_expand.container = widget.id;
                _bookmarks_expand.collapseIconClass = "esri-icon-up";

                _mapView.when(() => {
                    //layerList_Expand.expandTooltip = `${layerList_Expand.label} ${layerList.label}`;
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

async function addBasemapGallery(widget: WidgetBarWidget, _mapView: MapView): Promise<Expand|null> {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();
        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(config => {
            var basemapGalleryT9nPath = `${widgetsAssetsPath}${widget.id}/t9n/${widget.id}_${lang}.json`;
            var _basemapGallery_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config as BasemapGalleryWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as BasemapGalleryWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as BasemapGalleryWidget, "group", widget.group? widget.group: widgetBarGroup) as string;
            var _portal = getWidgetConfigKeyValue(config as BasemapGalleryWidget, "basemapsourceportal", esriConfig.portalUrl) as string;
            var _label: string;

            returnWidgetConfig(basemapGalleryT9nPath, basemapGalleryT9nPath).then(t9nResults => {
                _label = getWidgetLocaleConfigKeyValue(t9nResults as WidgetBarWidgetLocale, "label", lang==="en"? "Basemap Gallery": "Bibliothèque de fonds de carte") as string;
            }).then(function (){
                var _basemapGallery = new BasemapGallery({
                    view: _mapView,
                    source: {
                        portal: new Portal({
                            url: _portal
                        })
                    } as PortalBasemapsSource,
                    label: _label
                });
    
                _basemapGallery_expand.id = widget.id;
                _basemapGallery_expand.view = _mapView
                _basemapGallery_expand.visible = _visible
                _basemapGallery_expand.content = _basemapGallery
                _basemapGallery_expand.expanded = _expanded
                _basemapGallery_expand.group = _group
                _basemapGallery_expand.container = widget.id
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

async function addSketch(widget: WidgetBarWidget, _mapView: MapView, _graphicsLayer: GraphicsLayer): Promise<Expand|null> {
    return new Promise(resolve => {
        var lang = getNormalizedLocale();
        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(config => {
            var sketchT9nPath = `${widgetsAssetsPath}${widget.id}/t9n/${widget.id}_${lang}.json`;
            var _sketch = new Sketch();
            var _sketch_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config as SketchWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as SketchWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as SketchWidget, "group", widget.group? widget.group: widgetBarGroup) as string;
            var _mode = getWidgetConfigKeyValue(config as SketchWidget, "mode", "update") as "update"|"single"|"continuous";
            var _label: string;

            returnWidgetConfig(sketchT9nPath, sketchT9nPath).then(t9nResults => {
                _label = getWidgetLocaleConfigKeyValue(t9nResults as WidgetBarWidgetLocale, "label", lang==="en"? "Sketch": "Dessin") as string;
            }).then(function (){

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
        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(config => {
            var printT9nPath = `${widgetsAssetsPath}${widget.id}/t9n/${widget.id}_${lang}.json`;
            var _print = new Print();
            var _print_expand = new Expand();
            var _visible = getWidgetConfigKeyValue(config as PrintWidget, "visible", widget.visible? widget.visible: true) as boolean;
            var _expanded = getWidgetConfigKeyValue(config as PrintWidget, "expanded", widget.expanded? widget.expanded: false) as boolean;
            var _group = getWidgetConfigKeyValue(config as PrintWidget, "group", widget.group? widget.group: widgetBarGroup) as string;
            var _psURL = getWidgetConfigKeyValue(config as PrintWidget, "printServiceURL", "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task") as string;
            var _label: string;

            returnWidgetConfig(printT9nPath, printT9nPath).then(t9nResults => {
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
        var configFile: string|null;
        if (widget.config && typeof widget.config === "string") {
            configFile = widget.config;
        } else {
            configFile = null;
        }
        
        returnWidgetConfig(configFile, `${widgetsAssetsPath}${widget.id}/config/${widget.id}_config.json`).then(config => {
            var supportT9nPath = `${widgetsAssetsPath}${widget.id}/t9n/${widget.id}_${lang}.json`;

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

            returnWidgetConfig(supportT9nPath, supportT9nPath).then(t9nResults => {
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
    widgetBarWidgets.forEach(widget => {
        if (widget) {
            var widget_node = document.getElementById(widget.id) as HTMLDivElement;
            widget_node.innerHTML = "";
        }
    });
    widgetBarWidgets = [];
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

async function createBookmarks(_config: BookmarksWidget, _view: MapView, _cookies: Array<CookiesVM>, _localeList: Array<string>, default_thumbnail: string) {
    return new Promise(resolve => {
        var _editingEnabled = getWidgetConfigKeyValue(_config, "editingEnabled", true);
        var defaultCreateOptions = new DefaultCreateOptions();
        var screenshotSettings = new ScreenshotSettings();
        screenshotSettings.width = 100;
        screenshotSettings.height = 100;
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

function convertJSONBookmarksToEsriBookmarks(_bookmarks_list: Array<_Bookmark>, _default_thumbnail: string) {
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

        if(bookmark.viewpoint.targetGeometry.spatialReference.isGeographic === true) {
            if(bookmark.viewpoint.targetGeometry.type === "point") {
                let _point = bookmark.viewpoint.targetGeometry as Point;
                _centroid.x = _point.longitude;
                _centroid.y = _point.latitude;
            } else if (bookmark.viewpoint.targetGeometry.type === "polygon") {
                let _poly = bookmark.viewpoint.targetGeometry as Polygon;
                _centroid.x = _poly.centroid.longitude;
                _centroid.y = _poly.centroid.latitude;
            } else if (bookmark.viewpoint.targetGeometry.type === "extent") {
                let _ext = bookmark.viewpoint.targetGeometry as Extent;
                _centroid.x = _ext.center.longitude;
                _centroid.y = _ext.center.latitude;
            }
        } else {
            if(bookmark.viewpoint.targetGeometry.type === "point") {
                let _point = bookmark.viewpoint.targetGeometry as Point;
                _centroid.x = _point.x;
                _centroid.y = _point.y;
            } else if (bookmark.viewpoint.targetGeometry.type === "polygon"){
                let _poly = bookmark.viewpoint.targetGeometry as Polygon;
                _centroid.x = _poly.centroid.x;
                _centroid.y = _poly.centroid.y;
            } else if (bookmark.viewpoint.targetGeometry.type === "extent") {
                let _ext = bookmark.viewpoint.targetGeometry as Extent;
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
        console.log("Promise: callback()");
        await callback(array[index], index, array);
    }
}

async function cookieVMAsyncForEach(array: Array<CookiesVM>, callback: { (cookie: CookiesVM): Promise<void>; (arg0: CookiesVM, arg1: number, arg2: CookiesVM[]): any; }) {
    for (let index = 0; index < array.length; index++) {
        console.log("Promise: callback()");
        await callback(array[index], index, array);
    }
}

export async function setBookmarksCookie(cookies: Array<CookiesVM>, _esriBookmarks: Bookmarks, _localeList: Array<string>, _defaultThumbnail: string) {
    cookies.forEach(_cookie => {
        if (_cookie.id.toLowerCase() === "bookmarks") {
            if (_cookie.accepted === true) {
                let jsonBookmarks = convertEsriBookmarksToJSONBookmarks(_esriBookmarks.bookmarks, _localeList, _defaultThumbnail)
                console.log(`jsonBookmarks: ${jsonBookmarks}`);
                _cookie.setCookie(jsonBookmarks);
            } else {
                _cookie.deleteCookie();
            }
            return;
        }
    });
}