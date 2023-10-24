// @ts-check
import React from 'react';

import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { getWidgetTheme, ariaDisable, getFocusableElements } from '@dnrr_fd/util/web'
import { getNormalizedLocale } from "@dnrr_fd/util/locale";

// Import Assets
import * as css from './assets/css/disclaimer.module.css';

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'

var t9n = t9n_en;

const css_esri = {
  esri_widget: 'esri-widget',
  esri_button: 'esri-button',
  esri_button_third: 'esri-button--third',
  esri_button_disabled: 'esri-button--disabled'
};

const elementIDs = {
  esriThemeID: "esriThemeID",
  disclaimerModalID: "disclaimerModalID",
  disclaimerContentID: "disclaimerContentID",
  disclaimerAgreementCheckboxID: "disclaimerAgreementCheckboxID",
  disclaimerAgreementConfirmID: "disclaimerAgreementConfirmID"
};

interface DisclaimerParams extends __esri.WidgetProperties {
  afterDestroyFocusElement?: string|HTMLElement;
}

@subclass("dnrr.forestry.widgets.disclaimer")
class Disclaimer extends Widget {

  constructor(params?: DisclaimerParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  afterDestroyFocusElement!: string|HTMLElement;

  @property()
  theme!: 'light'|'dark';

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------
  postInitialize(): void {
    var _locale = getNormalizedLocale();
    // console.log(`_LOCALE: ${_locale}`);
    if (_locale === "en") {
      t9n = t9n_en;
    } else {
      t9n = t9n_fr;
    }

    this.label = t9n.title;
    this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme) as 'light'|'dark';
  
    intl.onLocaleChange(function(locale) {
      t9n = (locale === 'fr' ? t9n_fr : t9n_en);
    });
}

  render() {
    var message = t9n.messages.map(p => <p>{p.map(obj => this._getElemValue(obj.element, obj.value))} </p>)

    return (
      <div id={this.id}>
        <div id={elementIDs.disclaimerModalID} afterCreate={this.setElementFocus} bind={this} class={css.default.widget_disclaimer_modal}>
          <div id={elementIDs.disclaimerContentID} class={this.classes(css.default.widget_disclaimer, css.default.widget_disclaimer_content, css_esri.esri_widget)}>
            <div class={css.default.widget_disclaimer_title__div}>
              <h1 role='heading' ariaLevel='1'>{t9n.title}</h1>
            </div>
            <div class={css.default.widget_disclaimer_message__div}>
              <div>{message}</div>
            </div>
            <div class={css.default.widget_disclaimer_checkbox__div}>
              <input id={elementIDs.disclaimerAgreementCheckboxID} type='checkbox' value='agree' class={css.default.widget_disclaimer_checkbox} ariaLabel={t9n.agreeText} title={t9n.agreeText} onclick={this._agreementCheckbox_click.bind(this)}/>
              <label for={elementIDs.disclaimerAgreementCheckboxID} class={css.default.widget_disclaimer_checkbox__label}>{t9n.agreeText}</label>
            </div>
            <div class={css.default.widget_disclaimer_button__div}>
              <button id={elementIDs.disclaimerAgreementConfirmID} type="button" class={this.classes(css.default.widget_disclaimer_button__disabled, css_esri.esri_button, css_esri.esri_button_third, css_esri.esri_button_disabled)} aria-disabled='true' onclick={this._confirmButton_click.bind(this)}>{t9n.confirmButtonText}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //  Private Methods
  //--------------------------------------------------------------------------
  private async setElementFocus () {
    const main_containerNode = document.getElementById(elementIDs.disclaimerModalID) as HTMLDivElement;
    // Add all the elements inside modal which you want to make focusable
    getFocusableElements(main_containerNode);
  }


  // Event Listener Callbacks.
  private _agreementCheckbox_click () {
    const agreementCheckbox = document.getElementById(elementIDs.disclaimerAgreementCheckboxID) as HTMLInputElement;
    const confirmButton = document.getElementById(elementIDs.disclaimerAgreementConfirmID) as HTMLInputElement;

    this._checkboxAction(agreementCheckbox, confirmButton);
  }

  private async _confirmButton_click (e: MouseEvent) {
    const confirmButton = document.getElementById(elementIDs.disclaimerAgreementConfirmID) as HTMLInputElement;
    
    if (confirmButton.ariaDisabled === "true") {
      e.preventDefault();
    } else {
      this.destroy();
      if (this.afterDestroyFocusElement) {
        if (typeof this.afterDestroyFocusElement === "string") {
          getFocusableElements(document.getElementById(this.afterDestroyFocusElement)!);
        } else {
          getFocusableElements(this.afterDestroyFocusElement);
        }
      }
    }
  }

  // Private Methods
  private _checkboxAction(agreementCheckbox: HTMLInputElement, confirmButton: HTMLInputElement) {
    if (agreementCheckbox.checked === true) {
      ariaDisable(confirmButton, [css.default.widget_disclaimer_button__disabled, css_esri.esri_button_disabled], false);
    } else {
      ariaDisable(confirmButton, [css.default.widget_disclaimer_button__disabled, css_esri.esri_button_disabled], true);
    }
  }

  private _getElemValue (element:string, value: string) {
    if (element.toLowerCase() === "b") {
      return <b>{value}</b>
    } else {
      return value
    }
  }
}

export default Disclaimer;