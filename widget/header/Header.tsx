// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import Accessor from '@arcgis/core/core/Accessor';
import * as intl from "@arcgis/core/intl";

import { Locale, Logo, Menu, Theme } from "../class/_Header"
import { Link } from "../class/_Common"
import { getFocusableElements, getWidgetTheme, setStyleSheet } from '@dnrr_fd/util/web'
import { getNormalizedLocale } from "@dnrr_fd/util/locale";

// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css_dark from './assets/css/dark/header.module.css';
import * as css_light from './assets/css/light/header.module.css';

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'

var t9n = t9n_en;
var css_theme = css_dark;
var _locale: 'en'|'fr';
var _isSiteMenuExpanded = false;

const css_esri = {
  esri_widget: 'esri-widget',
  esri_widget_button: 'esri-widget--button',
  esri_widget_panel: 'esri-widget-panel',
  esri_widget_anchor: "esri-widget__anchor",
  esri_icon_collapse: 'esri-icon-collapse',
  esri_icon_drag_horizontal: 'esri-icon-drag-horizontal',
  esri_icon_font_fallback_text: 'esri-icon-font-fallback-text',
  esri_expand_icon_expanded: 'esri-expand__icon--expanded',
  esri_collapse_icon: "esri-collapse__icon"
};

const elementIDs = {
  esriThemeID: "esriThemeID",
  headerID: "headerID",
  header_foregroundID: "header_foregroundID",
  header_logoTitleID: "header_logoTitleID",
  header_logoID: "header_logoID",
  header_titleID: "header_titleID",
  header_linksID: "header_linksID",
  header_sitemenuID: "header_sitemenuID",
  header_sitemenu_buttonID: "header_sitemenu_buttonID",
  header_sitemenu_iconID: "header_sitemenu_iconID",

  sitemenuID: "sitemenuID",
  sitemenuModalID: "sitemenuModalID",
  sitemenu_titleID: "sitemenu_titleID",
  sitemenu_linksID: "sitemenu_linksID",
  sitemenu_aboutID: "sitemenu_aboutID",
  sitemenu_languagesID: "sitemenu_languagesID",
  sitemenu_themesID: "sitemenu_themesID",
  sitemenu_signinID: "sitemenu_signinID",
  sitemenu_signoutLinkID: "sitemenu_signoutLinkID",

  sitemenu_themePostfixID: "_themeID",
  submenu_localePostfixID: "_localeID"
};

var _logo: tsx.JSX.Element;
var _links: tsx.JSX.Element;
var _menuLinks: tsx.JSX.Element;
var _menuThemes: tsx.JSX.Element;
var _menuLanguages: tsx.JSX.Element;

interface HeaderParams extends __esri.WidgetProperties {
  afterMenuCloseFocusElement?: string|HTMLElement;

  theme: string;

  title?: string;

  subtitle?: string;

  logo?: Logo;

  links?: Array<Link>;

  menu?: {
      menulinks?: Array<Link>,
      themes?: Array<Theme>,
      showlocales?: boolean,
      languages?: Array<Locale>,
      startExpanded?: boolean
  };
}

@subclass("dnrr.forestry.widgets.header")
class Header extends Widget {

  constructor(params?: HeaderParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  afterMenuCloseFocusElement!: string|HTMLElement;

  @property()
  title!: string;

  @property()
  subtitle!: string;

  @property()
  logo!: Logo;

  @property()
  links!: Array<Link>;

  @property()
  menu!: Menu;

  @property()
  theme!: string;

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

    var self = this;
    this.label = this.title;

    intl.onLocaleChange(function(locale) {
      t9n = (locale === 'fr' ? t9n_fr : t9n_en);
    });

    //Set the initial theme
    this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme) as 'light'|'dark';
    css_theme = (this.theme === 'dark' ? css_dark : css_light);
    
    // Insert logo
    _logo = this._createReactLogo(this.logo);

    // Insert header links
    _links = this._createReactLinks(this.links, css_theme.default.widget_header_link);

    // Insert menu links
    _menuLinks = this._createReactLinks(this.menu.menulinks, css_theme.default.widget_header_submenu_link, true);

    // Insert available themes
    _menuThemes = this._createReactThemeRBs(this.menu.themes, this.theme);

    // Insert available languages
    if (this.menu.showlocales === true) {
      _menuLanguages = this._createReactLanguageRBs(this.menu.languages, _locale);
    } else {
      _menuLanguages = <div></div>;
    }

    this.menu.signoutlinkid = elementIDs.sitemenu_signoutLinkID

    // Watch for changes
    this.watch("theme", function(theme_new: string, theme_old: string, propertyName: string, target: Accessor){
      css_theme = (theme_new === 'dark' ? css_dark : css_light);
      // console.log(`Watch: Theme is now ${theme_new}`);
    });

    this.watch("logo", function(logo_new: Logo){
      self._modifyDOMLogo(logo_new, elementIDs.header_logoID, css_theme.default.widget_header_logo);
    });

    this.watch("links", function(links_new: Array<Link>){
      self._modifyDOMLinks(links_new, elementIDs.header_linksID, css_theme.default.widget_header_link);
    });

    this.watch("menu", function(menu_new: Menu){
      self._modifyDOMLinks(menu_new.menulinks, elementIDs.sitemenu_linksID, css_theme.default.widget_header_submenu_link, true);

      self._modifyDOMThemeRBs(menu_new.themes, elementIDs.sitemenu_themesID, self.theme);
      
      if (menu_new.showlocales === true) {
        self._modifyDOMLanguageRBs(menu_new.languages, elementIDs.sitemenu_languagesID, _locale);
      } else {
        self._removeDivChildNodes(elementIDs.sitemenu_languagesID);
      }
    });

  }

  render() {
    return (
      <div id={elementIDs.headerID} afterCreate={this.setSiteMenu} bind={this} class={this.classes(css_theme.default.widget_header, css_theme.default.widget_header_transition, css_esri.esri_widget)}>
        <div id={elementIDs.header_foregroundID} class={css_theme.default.widget_header_fg}>
          <div id={elementIDs.header_logoTitleID} class={css_theme.default.widget_header_logo_title}>
            <div id={elementIDs.header_logoID} class={css_theme.default.widget_header_logo}>
              {_logo}
            </div>
            <div id={elementIDs.header_titleID} class={css_theme.default.widget_header_title}>
              <div>
                <h1 class={css_theme.default.widget_header_title_title}>{this.title}</h1>
                <h3 class={css_theme.default.widget_header_title_subtitle}>{this.subtitle}</h3>
              </div>
            </div>
          </div>
          <div class={css_theme.default.widget_header_links_menu}>
            <div>
              <div id={elementIDs.header_linksID} class={css_theme.default.widget_header_links}>
                {_links}
              </div>
              <div class={css_theme.default.widget_header_menu}>
                <div id={elementIDs.header_sitemenuID} class={this.classes(css_esri.esri_widget, css_theme.default.widget_header_links_menu__button)}>
                  <div id={elementIDs.header_sitemenu_buttonID} class={css_esri.esri_widget_button} role="button" aria-label={t9n.sitemenu.collapse} title={t9n.sitemenu.collapse} tabindex="0" onclick={this._siteMenuButton_click.bind(this)} onkeypress={this._siteMenuButton_keypress.bind(this)}>
                    <span id={elementIDs.header_sitemenu_iconID} class={this.classes(css_esri.esri_icon_drag_horizontal, css_esri.esri_expand_icon_expanded)} aria-hidden="true"></span>
                    <span class={css_esri.esri_icon_font_fallback_text}>{t9n.sitemenu.collapse}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class={css_theme.default.widget_header_bg_bg1}></div>
        <div class={css_theme.default.widget_header_bg_bg2}></div>
        <div class={css_theme.default.widget_header_bg_bg3}></div>
        <div id={elementIDs.sitemenuModalID} class={this.classes(css_theme.default.widget_header_modal)}>
          <div id={elementIDs.sitemenuID} class={this.classes(css_esri.esri_widget_panel, css_theme.default.widget_header_sitemenu__content, css_theme.default.widget_header_sitemenu, css_esri.esri_widget, css_theme.default.widget_header_transition, css_theme.default.widget_header_sitemenu__ignore)} tabindex="0">
            <div class={elementIDs.sitemenu_titleID}>
              <h3 aria-label={t9n.sitemenu.menu.title}>{t9n.sitemenu.menu.title}</h3>
            </div>
            <div id={elementIDs.sitemenu_linksID} class={css_theme.default.widget_header_submenu_links}>
              {_menuLinks}
            </div>
            <div id={elementIDs.sitemenu_languagesID} class={css_theme.default.widget_header_submenu_languages}>
              {_menuLanguages}
            </div>
            <div id={elementIDs.sitemenu_themesID} class={css_theme.default.widget_header_submenu_themes}>
              {_menuThemes}
            </div>
            <div id={elementIDs.sitemenu_signinID}>
              <a href="#" id={elementIDs.sitemenu_signoutLinkID} class={this.classes(css_esri.esri_widget_anchor, css_theme.default.widget_header_link__enabled, css_theme.default.widget_header_sitemenu__ignore)} title={t9n.sitemenu.menu.signout} tabindex="0">{t9n.sitemenu.menu.signout}</a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //  Private Methods
  //--------------------------------------------------------------------------

  private setSiteMenu(expandSiteMenu: boolean|Element) {
    var siteMenuButton_node = document.getElementById(elementIDs.header_sitemenu_buttonID);
    var siteMenuModal_node = document.getElementById(elementIDs.sitemenuModalID);
    var esm = (typeof expandSiteMenu === "boolean"? expandSiteMenu: this.menu.startExpanded? this.menu.startExpanded: false);
    var self = this;

    if (siteMenuButton_node && siteMenuModal_node) {
        if (typeof expandSiteMenu === "object") {
          // This is the initial rendering setup.
          if (this.menu.startExpanded === false) {
            siteMenuModal_node.classList.add(css_theme.default.widget_header_visible__hidden);
          }

          // Set event listeners
          siteMenuModal_node.addEventListener('keydown', function (e) {
            let isEscapePressed = e.key === 'Escape' || e.keyCode === 27;
            if (!isEscapePressed) {
                return;
            } else {
              _isSiteMenuExpanded = self.toggleSiteMenu(false);
            }
          });

          siteMenuButton_node.addEventListener('keydown', function (e) {
            let isEscapePressed = e.key === 'Escape' || e.keyCode === 27;
    
            if (!isEscapePressed) {
                return;
            } else {
              if (_isSiteMenuExpanded === true) {
                _isSiteMenuExpanded = self.toggleSiteMenu(false);
                  // console.log(`Element (${siteMenu_node.id}) is within viewport.`);
              } else {
                return;
                  // console.log(`Element (${siteMenu_node.id}) is NOT within viewport.`);
              }
            }
          });
        }

        _isSiteMenuExpanded = this.toggleSiteMenu(esm);

    }
  }

  private _theme_change(themeID: 'light'|'dark') {
    setStyleSheet(`https://js.arcgis.com/4.20/@arcgis/core/assets/esri/themes/${themeID}/main.css`, elementIDs.esriThemeID); // ESRI Themed CSS
    this.theme = themeID;
  }
  
  private _getLocale() {
    let loc = intl.getLocale();
    if (loc.toLowerCase() === 'en-us' || loc.toLowerCase() === 'en') {
      _locale = 'en';
    } else if (loc.toLowerCase() === 'fr'){
      _locale = 'fr';
    } else {
      throw new Error(`The language specified ${loc} is not valid for this site!`);
    }
    return _locale;
  }

  private _setLocale(localeID: string) {
    intl.setLocale(localeID);
    // console.log(`New Locale: ${localeID}`);
    _locale = this._getLocale();
  }
  
  private _createReactLogo(logo: Logo, logoDivClass=null as string|null) {
    return (
      <a class={css_theme.default.widget_header_logo_a} href={logo.url} title={logo.title} tabindex='0' target={logo.target}>
        <img class={css_theme.default.widget_header_logo_img} src={logo.src} alt={logo.alt} />
      </a>
);
  }

  private _modifyDOMLogo(logo: Logo, targetID: string, logoDivClass=null as string|null) {
    let div_node = document.getElementById(targetID);
    let _a = div_node?.getElementsByTagName('a')[0] as HTMLAnchorElement;
    let _img = _a?.getElementsByTagName('img')[0] as HTMLImageElement;

    if (_a && _img) {
      _a.href = logo.url;
      _a.title = logo.title;
      _img.src = logo.src;
      _img.alt = logo.alt;
    }
  }

  private _createReactLinks(linksArray: Array<Link>, linkDivClass=null as string|null, menuLinkTag=false) {
    let postFix = "";
    if (menuLinkTag === true) {
      postFix = "_menu"
      var _links = linksArray.map(link => 
        <div class={linkDivClass}>
          <a id={`${link.id}${postFix}`} class={this.classes(css_esri.esri_widget_anchor, css_theme.default.widget_header_sitemenu__ignore)} href={link.url} target={link.target} title={link.title} tabindex='0' >{link.title}</a>
        </div>
      );
    } else {
      var _links = linksArray.map(link => 
        <div class={linkDivClass}>
          <a id={`${link.id}${postFix}`} class={css_esri.esri_widget_anchor} href={link.url} target={link.target} title={link.title} tabindex='0' >{link.title}</a>
        </div>
      );
    }

    return _links;
  }

  private _modifyDOMLinks(linksArray: Array<Link>, targetID: string, linkDivClass=null as string|null, menuLinkTag=false) {
    let div_node = document.getElementById(targetID);
    let _anchors = div_node?.getElementsByTagName('a') as HTMLCollectionOf<HTMLAnchorElement>;

    let postFix = "";
    if (menuLinkTag === true) {
      postFix = "_menu"
    }

    // Re-build the existing link list using the DOM
    linksArray.map(link => {
      let linkID = `${link.id}${postFix}`
      let _a = null as HTMLAnchorElement|null;
      for (let i=0; i<_anchors.length; i++) {
        if (_anchors[i].id.toLowerCase() === linkID.toLowerCase()) {
          _a = _anchors[i];
        }
      }
      if (_a) {
        _a.href = link.url;
        _a.title = link.title;
        _a.innerHTML = link.title;
      }
    });
  }

  private _createReactThemeRBs(themesArray: Array<Theme>, defaultThemeID: string, themeDivClass=null as string|null) {
    var _themes = themesArray.map(theme => 
      <div class={themeDivClass}>
        <input type="radio" id={theme.id} class={css_theme.default.widget_header_sitemenu__ignore} checked={theme.id === defaultThemeID ? true : false} name="set_theme" value={theme.id} title={theme.label} tabindex="0" onchange={this._theme_change.bind(this, theme.id as 'light'|'dark')} />
        <label id={`${theme.id}_label`} for={theme.id}>{theme.label}</label>
        <br />
      </div>
    );

    return (
      <fieldset class={css_theme.default.widget_header_sitemenu_fieldset}>
        <legend class={css_theme.default.widget_header_sitemenu_fieldset_legend} aria-label={t9n.sitemenu.menu.theme.grouplabel}>{t9n.sitemenu.menu.theme.grouplabel}</legend>
        {_themes}
      </fieldset>
    );
  }

  private _modifyDOMThemeRBs(themesArray: Array<Theme>, targetID: string, defaultThemeID: string, themeDivClass=null as string|null) {
    let div_node = document.getElementById(targetID);
    let _fieldset = div_node?.getElementsByTagName('fieldset')[0];
    let _legend = _fieldset?.getElementsByTagName('legend')[0];

    if (_legend) {
      _legend.ariaLabel = t9n.sitemenu.menu.theme.grouplabel;
      _legend.innerHTML = t9n.sitemenu.menu.theme.grouplabel;
    }

    let _themeRBs = _fieldset?.getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;
    let _themeLabels = _fieldset?.getElementsByTagName('label') as HTMLCollectionOf<HTMLLabelElement>;

    // Modify the existing theme list using the DOM
    themesArray.map(function(theme){
      var _themeRB = null as HTMLInputElement|null;
      var _themeLabel = null as HTMLLabelElement|null;
      for (let i=0; i<_themeRBs.length; i++) {
        if (_themeRBs[i].id.toLowerCase() === theme.id.toLowerCase()) {
          _themeRB = _themeRBs[i];
        }
      }

      for (let i=0; i<_themeLabels.length; i++) {
        if (_themeLabels[i].id.toLowerCase() === `${theme.id.toLowerCase()}_label`) {
          _themeLabel = _themeLabels[i];
        }
      }

      if (_themeRB && _themeLabel) {
        _themeRB.title = theme.label;
        _themeRB.checked = theme.id === defaultThemeID ? true : false;
        _themeLabel.innerHTML = theme.label;
      }
    });
  }

  private _createReactLanguageRBs(languagesArray: Array<Locale>, defaultLocaleID: string, localeDivClass=null as string|null) {
    var _languages = languagesArray.map(lang => 
      <div class={localeDivClass}>
        <input type="radio" id={lang.id} class={css_theme.default.widget_header_sitemenu__ignore} checked={lang.id === defaultLocaleID ? true : false} name="set_language" value={lang.id} title={lang.label} tabindex="0" onchange={this._setLocale.bind(this, lang.id)} />
        <label id={`${lang.id}_label`} for={lang.id}>{lang.label}</label>
        <br />
      </div>
    );

    return (
      <fieldset class={css_theme.default.widget_header_sitemenu_fieldset}>
        <legend class={css_theme.default.widget_header_sitemenu_fieldset_legend} aria-label={t9n.sitemenu.menu.languages.label}>{t9n.sitemenu.menu.languages.label}</legend>
        {_languages}
      </fieldset>
    );
  }

  private _modifyDOMLanguageRBs(languagesArray: Array<Locale>, targetID: string, defaultLocaleID: string, localeDivClass=null as string|null) {
    let div_node = document.getElementById(targetID);
    let _fieldset = div_node?.getElementsByTagName('fieldset')[0];
    let _legend = _fieldset?.getElementsByTagName('legend')[0];

    if (_legend) {
      _legend.ariaLabel = t9n.sitemenu.menu.languages.label;
      _legend.innerHTML = t9n.sitemenu.menu.languages.label;
    }

    let _langRBs = _fieldset?.getElementsByTagName('input') as HTMLCollectionOf<HTMLInputElement>;
    let _langLabels = _fieldset?.getElementsByTagName('label') as HTMLCollectionOf<HTMLLabelElement>;

    // Modify the existing language list using the DOM
    languagesArray.map(function(lang){
      var _langRB = null as HTMLInputElement|null;
      var _langLabel = null as HTMLLabelElement|null;
      for (let i=0; i<_langRBs.length; i++) {
        if (_langRBs[i].id.toLowerCase() === lang.id.toLowerCase()) {
          _langRB = _langRBs[i];
        }
      }

      for (let i=0; i<_langLabels.length; i++) {
        if (_langLabels[i].id.toLowerCase() === `${lang.id.toLowerCase()}_label`) {
          _langLabel = _langLabels[i];
        }
      }

      if (_langRB && _langLabel) {
        _langRB.title = lang.label;
        // _langRB.checked = lang.id === defaultLocaleID ? true : false;
        _langLabel.innerHTML = lang.label;
      }
    });
  }

  private _removeDivChildNodes(targetID: string) {
    // Clear the child nodes from the parent first
    let div_node = document.getElementById(targetID) as HTMLDivElement;
    if (div_node) {
      while (div_node.firstChild) {
        div_node.removeChild(div_node.lastChild!);
      }
    }
    return div_node;
  }

  //--------------------------------------------------------------------------
  //  Private Event Methods
  //--------------------------------------------------------------------------

  private _siteMenuButton_click(e: MouseEvent) {
    e.preventDefault();  // Prevent the default keypress action, i.e. space = scroll
    let esm = (_isSiteMenuExpanded === true? false: true)
    _isSiteMenuExpanded = this.toggleSiteMenu(esm);
    console.log(`Site Menu is ${_isSiteMenuExpanded}`);
  }

  private _siteMenuButton_keypress(e: KeyboardEvent) {
    let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      e.preventDefault();  // Prevent the default keypress action, i.e. space = scroll
      let esm = (_isSiteMenuExpanded === true? false: true)
      _isSiteMenuExpanded = this.toggleSiteMenu(esm);
      console.log(`Site Menu is ${_isSiteMenuExpanded}`);
    }
  }

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------

  toggleSiteMenu(_expandSiteMenu: boolean) {
    var isExpanded = false;
    var sitemenuModal_node = document.getElementById(elementIDs.sitemenuModalID)!;
    var sitemenu_node = document.getElementById(elementIDs.sitemenuID)!;
    var sitemenuButton_node = document.getElementById(elementIDs.header_sitemenu_buttonID)!;

    if (sitemenuButton_node) {
      var sitemenuIcon_node = document.getElementById(elementIDs.header_sitemenu_iconID)!;
      var siteMenuWidth = sitemenu_node.clientWidth as number;

      if (_expandSiteMenu === true) {
        sitemenuButton_node.title = t9n.sitemenu.collapse;
        sitemenuButton_node.setAttribute('aria-label', t9n.sitemenu.collapse);
        sitemenuModal_node.classList.remove(css_theme.default.widget_header_visible__hidden);
        // sitemenu_node.classList.remove(css_theme.default.widget_header_sitemenu_closed__content);
        // sitemenu_node.classList.add(css_theme.default.widget_header_sitemenu_open__content);
        sitemenu_node.setAttribute('style', `transform: -webkit-translate(0px, 0px);transform: -moz-translate(0px, 0px);transform: -ms-translate(0px, 0px);transform: -o-translate(0px, 0px);transform: translate(0px, 0px);`);
        sitemenu_node.classList.add(css_theme.default.widget_header_sitemenu_box_shadow);
        sitemenuIcon_node.classList.remove(css_esri.esri_icon_drag_horizontal);
        sitemenuIcon_node.classList.remove(css_esri.esri_expand_icon_expanded);
        sitemenuIcon_node.classList.add(css_esri.esri_icon_collapse);
        sitemenuIcon_node.classList.add(css_esri.esri_collapse_icon);
        isExpanded = true;
        // elementIDs.sitemenuID is actually off page. Must include the DIV so it is easier for the user to hit <ESC> to close the menu.
        getFocusableElements(sitemenu_node, sitemenuButton_node, false, `#${elementIDs.sitemenuID}, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`);
      }
      else {
        sitemenuButton_node.title = t9n.sitemenu.label;
        sitemenuButton_node.setAttribute('aria-label', t9n.sitemenu.label);
        sitemenu_node.classList.remove(css_theme.default.widget_header_sitemenu_box_shadow);
        // sitemenu_node.classList.add(css_theme.default.widget_header_sitemenu_closed__content);
        // sitemenu_node.classList.remove(css_theme.default.widget_header_sitemenu_open__content);
        sitemenu_node.setAttribute('style', `transform: -webkit-translate(${siteMenuWidth+3}px, 0px);transform: -moz-translate(${siteMenuWidth+3}px, 0px);transform: -ms-translate(${siteMenuWidth+3}px, 0px);transform: -o-translate(${siteMenuWidth+3}px, 0px);transform: translate(${siteMenuWidth+3}px, 0px);`);
        sitemenuModal_node.classList.add(css_theme.default.widget_header_visible__hidden);
        sitemenuIcon_node.classList.add(css_esri.esri_icon_drag_horizontal);
        sitemenuIcon_node.classList.add(css_esri.esri_expand_icon_expanded);
        sitemenuIcon_node.classList.remove(css_esri.esri_icon_collapse);
        sitemenuIcon_node.classList.remove(css_esri.esri_collapse_icon);
        if (this.afterMenuCloseFocusElement) {
          if (typeof this.afterMenuCloseFocusElement === "string") {
            getFocusableElements(document.getElementById(this.afterMenuCloseFocusElement)!, null, true, `button:not(.${css_theme.default.widget_header_sitemenu__ignore}), [href]:not(.${css_theme.default.widget_header_sitemenu__ignore}), input:not(.${css_theme.default.widget_header_sitemenu__ignore}), select:not(.${css_theme.default.widget_header_sitemenu__ignore}), textarea:not(.${css_theme.default.widget_header_sitemenu__ignore}), [tabindex]:not([tabindex="-1"]):not(.${css_theme.default.widget_header_sitemenu__ignore}):not(.esri-attribution__sources)`);
          } else {
            getFocusableElements(this.afterMenuCloseFocusElement, null, true, `button:not(.${css_theme.default.widget_header_sitemenu__ignore}), [href]:not(.${css_theme.default.widget_header_sitemenu__ignore}), input:not(.${css_theme.default.widget_header_sitemenu__ignore}), select:not(.${css_theme.default.widget_header_sitemenu__ignore}), textarea:not(.${css_theme.default.widget_header_sitemenu__ignore}), [tabindex]:not([tabindex="-1"]):not(.${css_theme.default.widget_header_sitemenu__ignore}):not(.esri-attribution__sources)`);
          }
        }
      }
    }

    return isExpanded;  // Returns expanded state.
  }
}
export default Header;