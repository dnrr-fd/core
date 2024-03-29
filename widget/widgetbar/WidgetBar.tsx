// @ts-check
import React from 'react';

import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import Expand from "@arcgis/core/widgets/Expand";
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import * as intl from "@arcgis/core/intl";
import MapView from "@arcgis/core/views/MapView";

import { createWidgetsForWidgetBar, removeWidgetsFromWidgetBar } from './WidgetBarViewModel';
import { wbwObject, WidgetBarWidget } from '../class/_WidgetBar';
import { getElementPosition, getFocusableElements, getWidgetTheme } from '@dnrr_fd/util/web'
import { CookiesVM } from "../class/_Cookie";
import { getNormalizedLocale } from "@dnrr_fd/util/locale";


// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css_dark from './assets/css/dark/widgetbar.module.css';
import * as css_light from './assets/css/light/widgetbar.module.css';

export let widgetBarRootURL: string;
export let widgetBarWidgetCloseFocusElement: string|HTMLElement;

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'

let t9n = t9n_en;
let css_theme = css_dark;

let _widgetBarWidgets: tsx.JSX.Element;

let afterWidgetCloseFocusElement: string|HTMLElement;

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

  @property()
  widgetBarWidgets!: Array<wbwObject>|null;

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------

  async postInitialize(): Promise<void> {
    const _locale = getNormalizedLocale();
    // console.log(`_LOCALE: ${_locale}`);
    if (_locale === "en") {
      t9n = t9n_en;
    } else {
      t9n = t9n_fr;
    }

    widgetBarRootURL = this.widgetBarRootURL;
    const self = this as WidgetBar;
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
      <div key={`${widget.id}_key`} id={widget.id} class={self.classes(css_theme.default.widget_widgetbar_widget, css_theme.default[widget.id as keyof typeof css_theme.default], css_theme.default.widget_widgetbar_visible__none)}></div>
    );

    // Watch for changes
    intl.onLocaleChange(async function(locale) {
      t9n = (locale === 'fr' ? t9n_fr : t9n_en);
      self.locale = locale;
      removeWidgetsFromWidgetBar(self.mapView);
      await createWidgetsForWidgetBar(self).then(_widgetBarWidgets => {
        self.widgetBarWidgets = _widgetBarWidgets;
        self.widgetStylize(_widgetBarWidgets);
      });
    });

    reactiveUtils.watch(() => self.theme, (theme_new: string, theme_old: string) => {
      if (theme_old) {
        css_theme = (theme_new === 'dark' ? css_dark : css_light);
        // console.log(`Watch: Theme (WidgetBar) is now ${theme_new}`);
      }
    });

    // Create widget bar widgets
    await createWidgetsForWidgetBar(self).then(_widgetBarWidgets => {
      self.widgetBarWidgets = _widgetBarWidgets;
      this.widgetStylize(_widgetBarWidgets);
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

  private widgetStylize(_widgetBarWidgets: Array<wbwObject>|null) {
    if (_widgetBarWidgets) {
      _widgetBarWidgets.forEach(wbObj => {
        // Make valid widget bar widget styling changes.
        const wbw_node = document.getElementById(wbObj.wbWidget.id) as HTMLDivElement;
        if (wbw_node) {
          const wbwccID = `${wbObj.wbWidget.id}_controls_content`;
          const wbwcc_node = document.getElementById(wbwccID) as HTMLDivElement;
          if (wbwcc_node) {
            const wbwccClass = `widget_widgetbar_widget__${wbwccID}`;
            wbwcc_node.classList.add(css_theme.default[wbwccClass as keyof typeof css_theme.default]);
          }
          wbw_node.classList.remove(css_theme.default.widget_widgetbar_visible__none);
        }
      });
      _widgetBarWidgets.forEach(wbObj => {
        // Adjust the expand menus after final render from above class changes.
        const button_node = document.getElementById(wbObj.wbWidget.id) as HTMLDivElement;
        if (button_node) {
          const wbwccID = `${wbObj.wbWidget.id}_controls_content`;
          const wbwcc_node = document.getElementById(wbwccID) as HTMLDivElement;
          if (wbwcc_node) {
            const windowWidth = window.innerWidth;
            const pos = getElementPosition(button_node);
            const right_offset = windowWidth - pos.xMax;
            wbwcc_node.setAttribute("style", "right: -" + right_offset + "px!important;");
            // console.log(`${wbObj.wbWidget.id}  Position - xMax: ${pos.xMax}, xMin: ${pos.xMin}, yMin: ${pos.yMin}, yMax: ${pos.yMax} { right: -${right_offset}px!important; }`);
          }

          if (wbObj.fireEvent === true) {
            if (wbObj.wbWidget instanceof Expand) {
              const wbwExpand = wbObj.wbWidget as Expand;
              reactiveUtils.watch(() => wbwExpand.expanded, () => {
                wbwExpand.renderNow();
                if (afterWidgetCloseFocusElement) {
                  if (typeof afterWidgetCloseFocusElement === "string") {
                    getFocusableElements(document.getElementById(afterWidgetCloseFocusElement)!);
                  } else {
                    getFocusableElements(afterWidgetCloseFocusElement);
                  }
                }
              });
            }
          }
        }
      });
    }
  }

  //--------------------------------------------------------------------------
  //  Private Event Methods
  //--------------------------------------------------------------------------

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------
}
export default WidgetBar;