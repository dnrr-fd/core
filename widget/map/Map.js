import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import Portal from "@arcgis/core/portal/Portal";
import esriConfig from "@arcgis/core/config";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import identityManager from "@arcgis/core/identity/IdentityManager";
import MapView from "@arcgis/core/views/MapView";
import WebMap from "@arcgis/core/WebMap";
import Color from "@arcgis/core/Color";
import Popup from "@arcgis/core/widgets/Popup";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";
import { MapExtentObject } from '../class/_Map';
import { getWidgetTheme } from '@dnrr_fd/util/web';
import { getNormalizedLocale } from '@dnrr_fd/util/locale';
import { loadWidgetsIntoMap, removeWidgetsFromMap } from "./MapViewModel";
export var mapRootURL;
export var mapParentElement;
export var mapExtentArray = new Array();
// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css_dark from './assets/css/dark/map.module.css';
import * as css_light from './assets/css/light/map.module.css';
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
var t9n = t9n_en;
var css_theme = css_dark;
var _mapView = new MapView();
var mapExtentObject = new MapExtentObject();
const elementIDs = {
    esriThemeID: "esriThemeID",
    mapID: "_mapID",
    mapContentID: "mapContentID",
    widgetBarContainerID: "widgetBarContainerID"
};
let Map = class Map extends Widget {
    constructor(params) {
        super(params);
    }
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    postInitialize() {
        esriConfig.apiKey = this.apiKey;
        console.log(`API Key: ${esriConfig.apiKey}`);
        var _locale = getNormalizedLocale();
        // console.log(`_LOCALE: ${_locale}`);
        if (_locale === "en") {
            t9n = t9n_en;
        }
        else {
            t9n = t9n_fr;
        }
        mapRootURL = this.mapRootURL;
        var self = this;
        this.mapView = _mapView;
        var containerElement;
        if (typeof self.container === 'string') {
            containerElement = document.getElementById(self.container);
        }
        else {
            containerElement = self.container;
        }
        if (containerElement) {
            mapParentElement = containerElement.parentElement;
        }
        else {
            mapParentElement = null;
        }
        this.label = t9n.title;
        //Set the initial theme
        this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme);
        css_theme = (this.theme === 'dark' ? css_dark : css_light);
        this.rendered = false;
        esriConfig.portalUrl = this.portalUrl;
        // console.log(`Assets Path: ${esriConfig.assetsPath}`);
        var info = new OAuthInfo({
            appId: this.appid,
            portalUrl: this.map.portalUrl,
            locale: _locale,
            popup: false // Optionally, you can choose to have the sign-in window display in a separate popup window
        });
        identityManager.registerOAuthInfos([info]);
        identityManager.checkSignInStatus(info.portalUrl + "/sharing")
            .then(async () => {
            await this._handleSignIn().then(results => {
                // console.log("Resolved: loadArcGISContent() " + results);
                this.rendered = true;
            });
        })
            .catch(async () => {
            await this._handleSignIn().then(results => {
                // console.log("Resolved: loadArcGISContent() " + results);
                this.rendered = true;
            });
        });
        intl.onLocaleChange(function (locale) {
            t9n = (locale === 'fr' ? t9n_fr : t9n_en);
            self.locale = locale;
            info.locale = locale;
            removeWidgetsFromMap(_mapView);
            loadWidgetsIntoMap(_mapView, self.map.widgets);
        });
        this.watch("theme", function (theme_new, theme_old) {
            if (theme_old) {
                css_theme = (theme_new === 'dark' ? css_dark : css_light);
                // self.render();
                // console.log(`Watch: Theme (Map) is now ${theme_new}`);
            }
        });
    }
    render() {
        return (tsx("div", { id: elementIDs.mapID, class: this.classes(css_theme.default.widget_map, css_theme.default.widget_map_transition) },
            tsx("div", { id: elementIDs.mapContentID, class: css_theme.default.widget_map_content })));
    }
    //--------------------------------------------------------------------------
    //  Private Methods
    //--------------------------------------------------------------------------
    async _handleSignIn() {
        return new Promise(resolve => {
            var portal = new Portal();
            var self = this;
            portal.authMode = "immediate";
            portal.load().then(() => {
                if (portal.user) {
                    let results = { name: portal.user.fullName, username: portal.user.username };
                    // console.log(results);
                    // Set up the sign-out link if the user wishes.
                    var _signoutElement;
                    if (this.signoutElement != null && typeof this.signoutElement != "undefined") {
                        if (typeof this.signoutElement === "string") {
                            _signoutElement = document.getElementById(this.signoutElement);
                        }
                        else {
                            _signoutElement = this.signoutElement;
                        }
                        _signoutElement.addEventListener("click", function () {
                            self._handleSignOut();
                        });
                    }
                }
                this._loadContent().then(results => {
                    if (results === false) {
                        throw new Error();
                    }
                    resolve(true);
                });
            });
        });
    }
    async _loadContent() {
        return new Promise(resolve => {
            var self = this;
            //var upper_height = document.body.clientHeight;
            var upper_height = 125;
            // Add the map node content.
            const map = new WebMap({
                portalItem: {
                    id: this.map.id
                }
            });
            _mapView.container = document.getElementById(elementIDs.mapContentID);
            _mapView.map = map;
            _mapView.highlightOptions = {
                fillOpacity: this.map.highlightOptions.fillOpacity,
                color: new Color(this.map.highlightOptions.color)
            };
            _mapView.popup = new Popup({
                dockEnabled: true,
                dockOptions: {
                    position: this.map.popupLocation,
                    breakpoint: false
                }
            });
            _mapView.constraints = {
                minZoom: 0
            };
            _mapView.ui.components = this.map.defaultWidgets;
            _mapView.padding.top = upper_height;
            _mapView.padding.bottom = 0;
            _mapView.padding.left = 0;
            _mapView.padding.right = 0;
            _mapView.when(async function () {
                // Get the current extents and scale
                mapExtentObject.extent = _mapView.extent;
                mapExtentObject.scale = _mapView.scale;
                mapExtentArray.push(mapExtentObject);
                console.log(mapExtentObject.toString());
                // Watch for any changes in extent
                reactiveUtils.watch(() => !_mapView.stationary, (stationary, wasStationary) => {
                    if (wasStationary) {
                        mapExtentObject.scale = _mapView.scale;
                        mapExtentObject.extent = _mapView.extent;
                        console.log(`New Extent Object:`);
                        console.log(mapExtentObject.toString());
                        mapExtentArray.push(mapExtentObject);
                    }
                    return "";
                });
                if (typeof self.map.widgets === "object") {
                    await loadWidgetsIntoMap(_mapView, self.map.widgets);
                }
                resolve(true);
            }, function () {
                resolve(false);
            });
        });
    }
    _handleSignOut() {
        identityManager.destroyCredentials();
        window.location.reload();
    }
};
__decorate([
    property()
], Map.prototype, "theme", void 0);
__decorate([
    property()
], Map.prototype, "locale", void 0);
__decorate([
    property()
], Map.prototype, "title", void 0);
__decorate([
    property()
], Map.prototype, "portalUrl", void 0);
__decorate([
    property()
], Map.prototype, "apiKey", void 0);
__decorate([
    property()
], Map.prototype, "appid", void 0);
__decorate([
    property()
], Map.prototype, "mapView", void 0);
__decorate([
    property()
], Map.prototype, "signoutElement", void 0);
__decorate([
    property()
], Map.prototype, "map", void 0);
__decorate([
    property()
], Map.prototype, "mapRootURL", void 0);
__decorate([
    property()
], Map.prototype, "headerHeight", void 0);
__decorate([
    property()
], Map.prototype, "mapHeight", void 0);
__decorate([
    property()
], Map.prototype, "rendered", void 0);
Map = __decorate([
    subclass("dnrr.forestry.widgets.map")
], Map);
export default Map;
//# sourceMappingURL=Map.js.map