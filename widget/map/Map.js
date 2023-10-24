import { __decorate } from "tslib";
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
import { getWidgetTheme } from '@dnrr_fd/util/web';
import { getNormalizedLocale } from '@dnrr_fd/util/locale';
import { loadWidgetsIntoMap, removeWidgetsFromMap } from "./MapViewModel";
export var mapRootURL;
export var mapParentElement;
// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css_dark from './assets/css/dark/map.module.css';
import * as css_light from './assets/css/light/map.module.css';
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
import CookiesButton from "../cookies/button/CookiesButton";
import Cookies from "../cookies/Cookies";
var t9n = t9n_en;
var css_theme = css_dark;
var _mapView = new MapView();
var initialExtent;
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
        // console.log(`API Key: ${esriConfig.apiKey}`);
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
                this.cookiesCheck();
            });
        })
            .catch(async () => {
            await this._handleSignIn().then(results => {
                // console.log("Resolved: loadArcGISContent() " + results);
                this.cookiesCheck();
            });
        });
        intl.onLocaleChange(async function (locale) {
            t9n = (locale === 'fr' ? t9n_fr : t9n_en);
            self.locale = locale;
            info.locale = locale;
            removeWidgetsFromMap(_mapView);
            await loadWidgetsIntoMap(_mapView, self.map.widgets).then(_mapWidgets => {
                self.mapWidgets = _mapWidgets;
            });
        });
        this.watch("theme", function (theme_new, theme_old) {
            if (theme_old) {
                css_theme = (theme_new === 'dark' ? css_dark : css_light);
                // self.render();
                // console.log(`Watch: Theme (Map) is now ${theme_new}`);
            }
        });
    }
    cookiesCheck() {
        this.rendered = true;
        // Check for cookies
        this.mapWidgets?.forEach(mapWidget => {
            if (mapWidget.mWidget instanceof CookiesButton) {
                let _cookies_button = mapWidget.mWidget;
                if (_cookies_button.content instanceof Cookies) {
                    this.cookies = _cookies_button.content.cookiesVM;
                    return;
                }
            }
        });
        // Set the extent to the cookie value
        this.cookieVMAsyncForEach(this.cookies, async (cookie) => {
            if (cookie.id.toLowerCase() === "extent" && cookie.accepted === true) {
                await cookie.getCookie().then(() => {
                    if (cookie.value && this.mapView) {
                        this.mapView.extent = JSON.parse(cookie.value);
                    }
                });
                return;
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
                if (typeof self.map.widgets === "object") {
                    await loadWidgetsIntoMap(_mapView, self.map.widgets).then(_mapWidgets => {
                        self.mapWidgets = _mapWidgets;
                    });
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
    async cookieVMAsyncForEach(array, callback) {
        if (typeof array === "object") {
            for (let index = 0; index < array.length; index++) {
                // console.log("Promise: callback()");
                await callback(array[index], index, array);
            }
        }
        else {
            return null;
        }
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
], Map.prototype, "cookies", void 0);
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
], Map.prototype, "mapWidgets", void 0);
__decorate([
    property()
], Map.prototype, "rendered", void 0);
Map = __decorate([
    subclass("dnrr.forestry.widgets.map")
], Map);
export default Map;
//# sourceMappingURL=Map.js.map