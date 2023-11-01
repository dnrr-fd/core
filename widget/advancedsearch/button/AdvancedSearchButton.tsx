// @ts-check
import React from 'react';

import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { getWidgetTheme } from '@dnrr_fd/util/web'

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'
import { getNormalizedLocale } from "@dnrr_fd/util/locale";

let t9n = t9n_en;

const css_esri = {
  esri_widget: 'esri-widget',
  esri_widget_button: 'esri-widget--button',
  esri_component: 'esri-component',
  esri_expand__container: 'esri-expand__container',
  esri_interactive: 'esri-interactive',
  esri_icon: 'esri-icon',
  esri_icon_font_fallback_text: 'esri-icon-font-fallback-text'
};

const elementIDs = {
  esriThemeID: "esriThemeID"
};

let buttonLabel: string;
let buttonIconClass: string;

interface AdvancedSearchButtonParams extends __esri.WidgetProperties {
  id: string;
  content?: Widget;
  iconClass?: string;
  toolTip?: string;
}

@subclass("esri.widgets.advancedsearchbutton")
class AdvancedSearchButton extends Widget {

  constructor(params?: AdvancedSearchButtonParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  id!: string;

  @property()
  content!: Widget;

  @property()
  iconClass!: string;

  @property()
  toolTip!: string;

  @property()
  theme!: 'light'|'dark';


  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------
  postInitialize(): void {
    const _locale = getNormalizedLocale();
    // console.log(`_LOCALE: ${_locale}`);
    if (_locale === "en") {
      t9n = t9n_en;
    } else {
      t9n = t9n_fr;
    }

    this.label = t9n.label;
    this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme) as 'light'|'dark';

    intl.onLocaleChange(function(locale) {
      t9n = (locale === 'fr' ? t9n_fr : t9n_en);
    });

    if (this.toolTip) {
      buttonLabel = this.toolTip;
    } else if (t9n.toolTip && t9n.toolTip.length > 0) {
      buttonLabel = t9n.toolTip;
    } else if (t9n.label && t9n.label.length > 0) {
      buttonLabel = t9n.toolTip;
    } else {
      buttonLabel = "";
    }

    if (this.iconClass && this.iconClass.length > 0) {
      buttonIconClass = this.iconClass;
    } else {
      buttonIconClass = "esri-icon-review";
    }
  }

  render() {
    return (
      <div class={css_esri.esri_widget}>
        <div id={this.id} class={this.classes(css_esri.esri_widget_button, css_esri.esri_widget)} role="button" aria-label={buttonLabel} title={buttonLabel} tabIndex="0" onclick={this._button_click.bind(this)} onKeyPress={this._button_keypress.bind(this)}>
          <span id={`${this.id}_iconID`} class={this.classes(css_esri.esri_icon, buttonIconClass)} aria-hidden="true"></span>
          <span class={css_esri.esri_icon_font_fallback_text}>{buttonLabel}</span>
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //  Private Methods
  //--------------------------------------------------------------------------
  _button_click(e: MouseEvent) {
    // e.preventDefault();
    this.buttonClickAction();
  }

  _button_keypress(e: KeyboardEvent) {
    const isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    const isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      // e.preventDefault();  // Prevent the default keypress action, i.e. space = scroll
      this.buttonClickAction();
    }
  }

  private buttonClickAction() {
    if (this.content) {
      // Activate the widget content.
      this.content.visible = true;

      // Backup in case esri content.visible doesn't work
      const content_node = this.content.container as HTMLDivElement;
      if (content_node.style) {
        content_node.removeAttribute("style");
      }
    }
  }
}
export default AdvancedSearchButton;