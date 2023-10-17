// @ts-check
import React from 'react';

import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { getWidgetTheme } from '@dnrr_fd/util/web';
import { Image } from "../class/_Loading"

// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css from './assets/css/loading.module.css';

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'

let t9n = t9n_en;

const css_esri = {
  esri_widget: 'esri-widget',
};

const elementIDs = {
  esriThemeID: "esriThemeID",
  loadingModalID: "loadingModalID",
  loadingContentID: "loadingContentID",
  agreementCheckboxID: "agreementCheckboxID",
  agreementConfirmID: "agreementConfirmID"
};

interface LoadingParams extends __esri.WidgetProperties {
  image?: {
    src?: string,
    height?: number
  };
}

@subclass("dnrr.forestry.widgets.loading")
class Loading extends Widget {

  constructor(params?: LoadingParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  theme!: string;

  @property()
  image!: Image;

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------
  postInitialize(): void {
    this.label = t9n.title;
    this.theme = getWidgetTheme(elementIDs.esriThemeID) as 'light'|'dark';
    
    intl.onLocaleChange(function(locale) {
      t9n = (locale === 'fr' ? t9n_fr : t9n_en);
    });

  }

  render() {
    return (
      <div id={elementIDs.loadingModalID} className={this.classes(css.default.widget_loading, css_esri.esri_widget)}>
        <div id={elementIDs.loadingContentID} className={css.default.widget_loading_content}>
          <div className={css.default.widget_loading_img__div}>
            <img src={this.image.src} title={t9n.title} alt={t9n.alt} className={css.default.widget_loading_img} height={`${this.image.height.toString()}px`} />
          </div>
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //  Private Methods
  //--------------------------------------------------------------------------
}

export default Loading;