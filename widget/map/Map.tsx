// @ts-check
import React from 'react';

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
import Extent from "@arcgis/core/geometry/Extent";
import { MapConfig, mwObject } from '../class/_Map'
import { CookiesVM } from "../class/_Cookie";
import { getWidgetTheme } from '@dnrr_fd/util/web'
import { getNormalizedLocale } from '@dnrr_fd/util/locale'
import { loadWidgetsIntoMap, removeWidgetsFromMap } from "./MapViewModel"

export let mapRootURL: string;
export let mapParentElement: HTMLElement|null;

// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css_dark from './assets/css/dark/map.module.css';
import * as css_light from './assets/css/light/map.module.css';

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'
import CookiesButton from "../cookies/button/CookiesButton";
import Cookies from "../cookies/Cookies";

let t9n = t9n_en;
let css_theme = css_dark;
const _mapView = new MapView();


const elementIDs = {
  esriThemeID: "esriThemeID",
  mapID: "_mapID",
  mapContentID: "mapContentID",
  widgetBarContainerID: "widgetBarContainerID"
};

interface MapParams extends __esri.WidgetProperties {
  theme: string;
  title?: string;
  appid: string;
  apiKey: string;
  portalUrl: string;
  signoutElement?: HTMLAnchorElement|string|null;
  cookies?: Array<CookiesVM>|undefined;
  map: MapConfig;
  mapRootURL: string;
}

@subclass("dnrr.forestry.widgets.map")
class Map extends Widget {

  constructor(params?: MapParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------

  @property()
  theme!: string;

  @property()
  locale!: string;

  @property()
  title!: string;

  @property()
  portalUrl!: string;

  @property()
  apiKey!: string;

  @property()
  appid!: string;

  @property()
  mapView!: MapView|null;

  @property()
  signoutElement!: HTMLAnchorElement|string|null;

  @property()
  cookies!: Array<CookiesVM>|undefined;

  @property()
  map!: MapConfig;

  @property()
  mapRootURL!: string;

  @property()
  headerHeight!: number;

  @property()
  mapHeight!: number;

  @property()
  mapWidgets!: Array<mwObject>|null;

  @property()
  rendered!: boolean;
 
  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------

  postInitialize(): void {
    esriConfig.apiKey = this.apiKey;
    // console.log(`API Key: ${esriConfig.apiKey}`);

    const _locale = getNormalizedLocale();
    // console.log(`_LOCALE: ${_locale}`);
    if (_locale === "en") {
      t9n = t9n_en;
    } else {
      t9n = t9n_fr;
    }

    mapRootURL = this.mapRootURL;
    const self = this;
    this.mapView = _mapView;
    let containerElement: HTMLElement|null;
    if (typeof self.container === 'string') {
      containerElement = document.getElementById(self.container as string);
    } else {
      containerElement = self.container;
    }

    if (containerElement) {
      mapParentElement = containerElement.parentElement
    } else {
      mapParentElement = null;
    }

    this.label = t9n.title;

    //Set the initial theme
    this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme) as 'light'|'dark';
    css_theme = (this.theme === 'dark' ? css_dark : css_light);

    this.rendered = false;

    esriConfig.portalUrl = this.portalUrl;
    // console.log(`Assets Path: ${esriConfig.assetsPath}`);

    const info = new OAuthInfo({
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

    intl.onLocaleChange(async function(locale) {
      t9n = (locale === 'fr' ? t9n_fr : t9n_en);
      self.locale = locale;
      info.locale = locale;

      removeWidgetsFromMap(_mapView)
      await loadWidgetsIntoMap(_mapView, self.map.widgets).then(_mapWidgets => {
        self.mapWidgets = _mapWidgets;
      });
    });

    this.watch("theme", function(theme_new: string, theme_old: string){
      if (theme_old) {
        css_theme = (theme_new === 'dark' ? css_dark : css_light);
        // self.render();
        // console.log(`Watch: Theme (Map) is now ${theme_new}`);
      }
    });
  }

  private cookiesCheck() {
    this.rendered = true;

    // Check for cookies
    this.mapWidgets?.forEach(mapWidget => {
      if (mapWidget.mWidget instanceof CookiesButton) {
        const _cookies_button = mapWidget.mWidget as CookiesButton;
        if (_cookies_button.content instanceof Cookies) {
          this.cookies = _cookies_button.content.cookiesVM;
          return;
        }
      }
    });

    // Set the extent to the cookie value
    this.cookieVMAsyncForEach(this.cookies, async (cookie: CookiesVM) => {
      if (cookie.id.toLowerCase() === "extent" && cookie.accepted === true) {
        await cookie.getCookie().then(() => {
          if (cookie.value && this.mapView) {
            this.mapView.extent = JSON.parse(cookie.value) as Extent;      
          }
        });
        return;
      }
    });
  }

  render() {
    return (
      <div id={elementIDs.mapID} className={this.classes(css_theme.default.widget_map, css_theme.default.widget_map_transition)}>
        <div id={elementIDs.mapContentID} className={css_theme.default.widget_map_content}></div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //  Private Methods
  //--------------------------------------------------------------------------

  private async _handleSignIn() {
    return new Promise(resolve => {
      const portal = new Portal();
      const self = this;
      portal.authMode = "immediate";
      portal.load().then(() => {
        if (portal.user) {
          const results = { name: portal.user.fullName, username: portal.user.username };
          // console.log(results);
          // Set up the sign-out link if the user wishes.
          let _signoutElement: HTMLAnchorElement;
          if (this.signoutElement != null && typeof this.signoutElement != "undefined") {
            if (typeof this.signoutElement === "string") {
              _signoutElement = document.getElementById(this.signoutElement) as HTMLAnchorElement;
            } else {
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

  private async _loadContent() {
    return new Promise(resolve => {
      const self = this;
      //var upper_height = document.body.clientHeight;
      const upper_height = 125;
  
      // Add the map node content.
      const map = new WebMap({
          portalItem: {
              id: this.map.id
          }
      });

      _mapView.container = document.getElementById(elementIDs.mapContentID) as HTMLDivElement;
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

      _mapView.when(async function() {
        if (typeof self.map.widgets === "object") {
          await loadWidgetsIntoMap(_mapView, self.map.widgets).then(_mapWidgets => {
            self.mapWidgets = _mapWidgets;
          });
        }
        resolve(true);
      }, function() {
        resolve(false);
      });
    });
  }

  private _handleSignOut(){
    identityManager.destroyCredentials();
    window.location.reload();    
  }

  private async cookieVMAsyncForEach(array: Array<CookiesVM>|undefined, callback: { (cookie: CookiesVM): Promise<void>; (arg0: CookiesVM, arg1: number, arg2: CookiesVM[]): Promise<void>; }) {
    if (typeof array === "object") {
      for (let index = 0; index < array.length; index++) {
        // console.log("Promise: callback()");
        await callback(array[index], index, array);
      }
    } else {
      return null;
    }
  }

  //--------------------------------------------------------------------------
  //  Private Event Methods
  //--------------------------------------------------------------------------


  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------

}
export default Map;