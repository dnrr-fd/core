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
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Color from "@arcgis/core/Color";
import Popup from "@arcgis/core/widgets/Popup";
import { MapConfig } from '../class/_Map'
import { getWidgetTheme } from '@dnrr_fd/util/web'
import { getNormalizedLocale } from '@dnrr_fd/util/locale'
import { loadWidgetsIntoMap, removeWidgetsFromMap } from "./MapViewModel"

export var mapRootURL: string;
export var mapParentElement: HTMLElement|null;

// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css_dark from './assets/css/dark/map.module.css';
import * as css_light from './assets/css/light/map.module.css';

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'

var t9n = t9n_en;
var css_theme = css_dark;
var _mapView = new MapView();

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
  portalUrl: string;
  signoutElement?: HTMLAnchorElement|string|null;
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
  appid!: string;

  @property()
  mapView!: MapView|null;

  @property()
  signoutElement!: HTMLAnchorElement|string|null;

  @property()
  map!: MapConfig;

  @property()
  mapRootURL!: string;

  @property()
  headerHeight!: number;

  @property()
  mapHeight!: number;

  @property()
  rendered!: boolean;

  @property()
  graphicsLayer!: GraphicsLayer;
 
  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------

  postInitialize(): void {
    mapRootURL = this.mapRootURL;
    var self = this;
    var _locale = getNormalizedLocale();
    this.mapView = _mapView;
    var containerElement: HTMLElement|null;
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
    console.log(`Assets Path: ${esriConfig.assetsPath}`);

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
            console.log("Resolved: loadArcGISContent() " + results);
            this.rendered = true;
        });
    })
    .catch(async () => {
        await this._handleSignIn().then(results => {
            console.log("Resolved: loadArcGISContent() " + results);
            this.rendered = true;
        });
    });

    intl.onLocaleChange(function(locale) {
      t9n = (locale === 'fr' ? t9n_fr : t9n_en);
      self.locale = locale;
      info.locale = locale;

      removeWidgetsFromMap(_mapView)
      loadWidgetsIntoMap(_mapView, self.map.widgets);
    });

    this.watch("theme", function(theme_new: string, theme_old: string){
      if (theme_old) {
        css_theme = (theme_new === 'dark' ? css_dark : css_light);
        // self.render();
        console.log(`Watch: Theme (Map) is now ${theme_new}`);
      }
    });
  }

  render() {
    return (
      <div id={elementIDs.mapID} class={this.classes(css_theme.default.widget_map, css_theme.default.widget_map_transition)}>
        <div id={elementIDs.mapContentID} class={css_theme.default.widget_map_content}></div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //  Private Methods
  //--------------------------------------------------------------------------

  private async _handleSignIn() {
    return new Promise(resolve => {
      var portal = new Portal();
      var self = this;
      portal.authMode = "immediate";
      portal.load().then(() => {
        const results = { name: portal.user.fullName, username: portal.user.username };
        console.log(results);

        // Set up the sign-out link if the user wishes.
        var _signoutElement: HTMLAnchorElement;
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
      var self = this;
      //var upper_height = document.body.clientHeight;
      var upper_height = 125;
  
      var graphicsLayer = new GraphicsLayer();
      this.graphicsLayer = graphicsLayer;
      
      // Add the map node content.
      const map = new WebMap({
          portalItem: {
              id: this.map.id
          },
          layers: [graphicsLayer]
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
          await loadWidgetsIntoMap(_mapView, self.map.widgets);
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

  //--------------------------------------------------------------------------
  //  Private Event Methods
  //--------------------------------------------------------------------------

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------

}
export default Map;