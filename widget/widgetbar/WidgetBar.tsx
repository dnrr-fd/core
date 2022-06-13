// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import MapView from "@arcgis/core/views/MapView";

import { createWidgetsForWidgetBar, removeWidgetsFromWidgetBar } from './WidgetBarViewModel';
import { wbwObject, WidgetBarWidget } from '../class/_WidgetBar';
import { getElementPosition, getFocusableElements, getWidgetTheme } from '@dnrr_fd/util/web'
import { CookiesVM } from "../class/_Cookie";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import { getNormalizedLocale } from "@dnrr_fd/util/locale";


// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css_dark from './assets/css/dark/widgetbar.module.css';
import * as css_light from './assets/css/light/widgetbar.module.css';

export var widgetBarRootURL: string;
export var widgetBarWidgetCloseFocusElement: string|HTMLElement;

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'
import Expand from "@arcgis/core/widgets/Expand";
import Button from "../button/Button";

var t9n = t9n_en;
var css_theme = css_dark;

var _widgetBarWidgets: tsx.JSX.Element;

var afterWidgetCloseFocusElement: string|HTMLElement;

const elementIDs = {
  esriThemeID: "esriThemeID",
  widgetBarID: "_widgetBarID",
  widgetBarContainerID: "widgetBarContainerID"
};

interface WidgetBarParams extends __esri.WidgetProperties {
  afterWidgetCloseFocusElement?: string|HTMLElement;
  theme: string;
  title?: string;
  cookies?: Array<CookiesVM>;
  widgets?: Array<WidgetBarWidget>;
  localeList?: Array<string>;
  mapView: MapView;
  graphicsLayer: GraphicsLayer;
  widgetBarRootURL: string;
  activeWidget?: string;
}

@subclass("dnrr.forestry.widgets.widgetbar")
class WidgetBar extends Widget {

  constructor(params?: WidgetBarParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  afterWidgetCloseFocusElement!: string|HTMLElement;

  @property()
  theme!: string;

  @property()
  mapView!: MapView;

  @property()
  graphicsLayer!: GraphicsLayer;

  @property()
  widgetBarRootURL!: string;

  @property()
  locale!: string;

  @property()
  title!: string;

  @property()
  rendered!: boolean;

  @property()
  cookies!: Array<CookiesVM>;

  @property()
  widgets!: Array<WidgetBarWidget>;

  @property()
  localeList!: Array<string>;

  @property()
  activeWidget!: string;

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------

  async postInitialize(): Promise<void> {
    var _locale = getNormalizedLocale();
    console.log(`_LOCALE: ${_locale}`);
    if (_locale === "en") {
      t9n = t9n_en;
    } else {
      t9n = t9n_fr;
    }

    widgetBarRootURL = this.widgetBarRootURL;
    var self = this;
    var widgetBar = this as unknown as WidgetBar;
    this.rendered = false;
    afterWidgetCloseFocusElement = this.afterWidgetCloseFocusElement;

    this.label = t9n.title;

    if (this.afterWidgetCloseFocusElement) {
      widgetBarWidgetCloseFocusElement = this.afterWidgetCloseFocusElement;
    }

    //Set the initial theme
    this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme) as 'light'|'dark';
    css_theme = (this.theme === 'dark' ? css_dark : css_light);

    // Create widgetBarWidget scaffold
    _widgetBarWidgets = this.widgets.map(widget =>
      <div id={widget.id} class={self.classes(css_theme.default.widget_widgetbar_widget, css_theme.default[widget.id], css_theme.default.widget_widgetbar_visible__none)}></div>
    );

    // Watch for changes
    intl.onLocaleChange(async function(locale) {
      t9n = (locale === 'fr' ? t9n_fr : t9n_en);
      self.locale = locale;
      removeWidgetsFromWidgetBar(self.mapView);
      await createWidgetsForWidgetBar(widgetBar).then(_mapBarWidgets => {
        self.widgetStylize(_mapBarWidgets);
      });
    });

    this.watch("theme", function(theme_new: string, theme_old: string){
      if (theme_old) {
        css_theme = (theme_new === 'dark' ? css_dark : css_light);
        // self.render();
        console.log(`Watch: Theme (WidgetBar) is now ${theme_new}`);
      }
    });

    // Create widget bar widgets
    await createWidgetsForWidgetBar(widgetBar).then(_mapBarWidgets => {
      this.widgetStylize(_mapBarWidgets);
    });
  }


  render() {
    return (
      <div id={elementIDs.widgetBarID} afterCreate={this._setRendered} bind={this} class={this.classes(css_theme.default.widget_widgetbar, css_theme.default.widget_widgetbar_box_shadow, css_theme.default.widget_widgetbar_transition)}>
        <div class={css_theme.default.widget_widgetbar_bg}>
          <div class={css_theme.default.widget_widgetbar_bg__header}>
            <div class={css_theme.default.widget_widgetbar_bg__bg1}></div>
            <div class={css_theme.default.widget_widgetbar_bg__bg2}></div>
          </div>
        </div>
        <div id={elementIDs.widgetBarContainerID} class={this.classes(css_theme.default.widget_widgetbar_fg, css_theme.default.widget_widgetbar_fg__container)}>
          {_widgetBarWidgets}
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //  Private Methods
  //--------------------------------------------------------------------------

  private _setRendered() {
      this.rendered = true;
  }

  private widgetStylize(_mapBarWidgets: Array<wbwObject>|null) {
    if (_mapBarWidgets) {
      _mapBarWidgets.forEach(wbObj => {
        // Make valid widget bar widget styling changes.
        var wbw_node = document.getElementById(wbObj.wbWidget.id) as HTMLDivElement;
        if (wbw_node) {
          var wbwccID = `${wbObj.wbWidget.id}_controls_content`;
          var wbwcc_node = document.getElementById(wbwccID) as HTMLDivElement;
          if (wbwcc_node) {
            var wbwccClass = `widget_widgetbar_widget__${wbwccID}`;
            wbwcc_node.classList.add(css_theme.default[wbwccClass]);
          }
          wbw_node.classList.remove(css_theme.default.widget_widgetbar_visible__none);
        }
      });
      _mapBarWidgets.forEach(wbObj => {
        // Adjust the expand menus after final render from above class changes.
        var button_node = document.getElementById(wbObj.wbWidget.id) as HTMLDivElement;
        if (button_node) {
          var wbwccID = `${wbObj.wbWidget.id}_controls_content`;
          var wbwcc_node = document.getElementById(wbwccID) as HTMLDivElement;
          if (wbwcc_node) {
            var windowWidth = window.innerWidth;
            var pos = getElementPosition(button_node);
            var right_offset = windowWidth - pos.xMax;
            wbwcc_node.setAttribute("style", "right: -" + right_offset + "px!important;");
            // console.log(`${wbObj.wbWidget.id}  Position - xMax: ${pos.xMax}, xMin: ${pos.xMin}, yMin: ${pos.yMin}, yMax: ${pos.yMax} { right: -${right_offset}px!important; }`);
          }

          if (wbObj.fireEvent === true) {
            if (wbObj.wbWidget instanceof Expand) {
              wbObj.wbWidget.watch("expanded", function(expanded_new: boolean, expanded_old: boolean){
                wbObj.wbWidget.renderNow();
                if (expanded_new === true) {
                  console.log(`${wbObj.wbWidget.id.toUpperCase()} widget expanded`);
                } else {
                  console.log(`${wbObj.wbWidget.id.toUpperCase()} widget collapsed`);
                }

                if (afterWidgetCloseFocusElement) {
                  if (typeof afterWidgetCloseFocusElement === "string") {
                    getFocusableElements(document.getElementById(afterWidgetCloseFocusElement)!);
                  } else {
                    getFocusableElements(afterWidgetCloseFocusElement);
                  }
                }
              });
            }
            // // Get focusable elements including widget.
            // button_node.addEventListener('click', evt => {
            //   this._setFocus(wbObj);
            // });

            // button_node.addEventListener('keypress', evt => {
            //   let isEnterPressed = evt.key === 'Enter' || evt.keyCode === 13;
            //   let isSpacePressed = evt.key === 'Space' || evt.keyCode === 32;
          
            //   if (isEnterPressed || isSpacePressed) {
            //     this._setFocus(wbObj);
            //   }
            // });
          }
        }
      });
    }
  }

  // private _setFocus(_wbObj: wbwObject) {
  //   console.log(`${_wbObj.wbWidget.id.toUpperCase()} widget clicked`);
  //   if (afterWidgetCloseFocusElement) {
  //     if (typeof afterWidgetCloseFocusElement === "string") {
  //       getFocusableElements(document.getElementById(afterWidgetCloseFocusElement)!);
  //     } else {
  //       getFocusableElements(afterWidgetCloseFocusElement);
  //     }
  //   }
  // }

  //--------------------------------------------------------------------------
  //  Private Event Methods
  //--------------------------------------------------------------------------

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------
}
export default WidgetBar;