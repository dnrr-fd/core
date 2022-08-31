// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { Email, Link } from '../class/_Common'
import { getFocusableElements, getWidgetTheme } from '@dnrr_fd/util/web'
import { getNormalizedLocale } from "@dnrr_fd/util/locale";

// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css_dark from './assets/css/dark/footer.module.css';
import * as css_light from './assets/css/light/footer.module.css';

import * as t9n_en from './assets/t9n/en.json'
import * as t9n_fr from './assets/t9n/fr.json'

var css_theme = css_dark;
var t9n = t9n_en;
var _isFooterExpanded = false;

const css_esri = {
  esri_widget: 'esri-widget',
  esri_widget_button: 'esri-widget--button',
  esri_widget_panel: 'esri-widget-panel',
  esri_widget_anchor: "esri-widget__anchor",
  esri_icon_collapse: 'esri-icon-collapse',
  esri_icon_expand: 'esri-icon-expand',
  esri_expand_icon_expanded: 'esri-expand__icon--expanded',
  esri_collapse_icon: "esri-collapse__icon",
  esri_icon_font_fallback_text: 'esri-icon-font-fallback-text'
};

const elementIDs = {
  esriThemeID: "esriThemeID",
  footerID: "footerID",
  footerModalID: "footerModalID",
  footer_foregroundID: "footer_foregroundID",
  footer_buttonBarID: "footer_buttonBarID",
  footer_buttonID: "footer_buttonID",
  footer_button_iconID: "footer_button_iconID",
  footer_titleID: "footer_titleID",
  footer_bodytextID: "footer_bodytextID",
  footer_linksID: "footer_linksID",
  footer_copyrightID: "footer_copyrightID",
};

var _links: tsx.JSX.Element;

interface FooterParams extends __esri.WidgetProperties {
  afterFooterCloseFocusElement?: string|HTMLElement;

  theme: string;

  title?: string;

  bodytext?: {
    text: string,
    contactemail: Email
  };

  links?: Array<Array<Link>>;

  copyright?: {
    text: string,
    link: Link
  };

  startExpanded?: boolean;

}

@subclass("dnrr.forestry.widgets.footer")
class Footer extends Widget {

  constructor(params?: FooterParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  afterFooterCloseFocusElement!: string|HTMLElement;

  @property()
  theme!: string;

  @property()
  locale!: string;

  @property()
  title!: string;

  @property()
  bodytext!: {
    text: string,
    contactemail: Email
  };

  @property()
  links!: Array<Array<Link>>;

  @property()
  copyright!: {
    text: string,
    link: Link
  };

  @property()
  startExpanded!: boolean;

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

    this.label = t9n.button.label;

    //Set the initial theme
    this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme) as 'light'|'dark';
    css_theme = (this.theme === 'dark' ? css_dark : css_light);

    _links = this._createReactLinks(this.links, css_theme.default.widget_footer_links__linediv, css_theme.default.widget_footer_links__linkdiv, css_theme.default.widget_footer_links__anchor);

    // Watch for changes
    intl.onLocaleChange(function(locale) {
      self.locale = locale;
      t9n = (locale === 'fr' ? t9n_fr : t9n_en);
    });

    this.watch("theme", function(theme_new: string, theme_old: string){
      css_theme = (theme_new === 'dark' ? css_dark : css_light);
      // self.render();
      // console.log(`Watch: Theme (Footer) is now ${theme_new}`);
    });

    this.watch("links", function(links_new: Array<Array<Link>>, links_old: Array<Array<Link>>){
      if (links_old) {
        self._modifyDOMLinks(links_new, elementIDs.footer_linksID);
      }
    });
  }

  render() {
    return (
      <div id={elementIDs.footerModalID} afterCreate={this.setFooter} bind={this}>
        <div id={elementIDs.footerID} class={this.classes(css_theme.default.widget_footer, css_theme.default.widget_footer_transition, css_esri.esri_widget)}>
          <div id={elementIDs.footer_buttonBarID} class={css_theme.default.widget_footer_button_bar}>
            <div id={elementIDs.footer_buttonID} class={this.classes(css_theme.default.widget_footer_button, css_esri.esri_widget_button)} role="button" aria-label={t9n.button.collapselabel} title={t9n.button.collapselabel} tabindex='0' onclick={this._footerButton_click.bind(this)} onkeypress={this._footerButton_keypress.bind(this)}>
              <span id={elementIDs.footer_button_iconID} aria-hidden="true" class={this.classes(css_esri.esri_expand_icon_expanded, css_esri.esri_icon_expand, css_theme.default.widget_footer_transform_90_down)}></span>
              <span class={css_esri.esri_icon_font_fallback_text}>{t9n.button.label}</span>
            </div>
          </div>
          <div id={elementIDs.footer_foregroundID} class={css_theme.default.widget_footer_fg}>
            <div id={elementIDs.footer_titleID} class={css_theme.default.widget_footer_title}>
              <p>{this.title}</p>
            </div>
            <div id={elementIDs.footer_bodytextID} class={css_theme.default.widget_footer_bodytext}>
              <p>{`${this.bodytext?.text? this.bodytext.text: t9n.bodytext.text} `}{<a class={this.classes(css_theme.default.widget_footer_bodytext_contact__anchor, css_theme.default.widget_footer__ignore)} href={`mailto:${this.bodytext?.contactemail.emailaddress? this.bodytext.contactemail.emailaddress: t9n.bodytext.contactemail.emailaddress}?Subject=${this.bodytext?.contactemail.subjectline? this.bodytext.contactemail.subjectline: t9n.bodytext.contactemail.subjectline}`} title={this.bodytext?.contactemail.displayedemailtext? this.bodytext.contactemail.displayedemailtext: t9n.bodytext.contactemail.displayedemailtext} target='_top' tabindex='0' >{this.bodytext?.contactemail.displayedemailtext? this.bodytext.contactemail.displayedemailtext: t9n.bodytext.contactemail.displayedemailtext}</a>}</p>
            </div>
            <div id={elementIDs.footer_linksID} class={this.classes(css_theme.default.widget_footer_links)}>
              {_links}
            </div>
            <div id={elementIDs.footer_copyrightID} class={this.classes(css_theme.default.widget_footer_copyright)}>
              <a class={this.classes(css_theme.default.widget_footer_copyright__anchor, css_theme.default.widget_footer__ignore)} href={this.copyright?.link.url? this.copyright.link.url: t9n.copyright.link.url} title={this.copyright?.link.title? this.copyright.link.title: t9n.copyright.link.title} target={this.copyright?.link.target? this.copyright.link.target: t9n.copyright.link.target}>{this.copyright?.link.title? this.copyright.link.title: t9n.copyright.link.title}</a>
            </div>
          </div>
          <div class={css_theme.default.widget_footer_bg_bg1}></div>
          <div class={css_theme.default.widget_footer_bg_bg1a}></div>
          <div class={css_theme.default.widget_footer_bg_bg2}></div>
          <div class={css_theme.default.widget_footer_bg_bg2a}></div>
          <div class={css_theme.default.widget_footer_bg_bg3}></div>
          <div class={css_theme.default.widget_footer_bg_bg3a}></div>
          <div class={css_theme.default.widget_footer_bg_bg4}></div>
          <div class={css_theme.default.widget_footer_bg_bg4a}></div>
        </div>
      </div>
    );
  }

  //--------------------------------------------------------------------------
  //  Private Methods
  //--------------------------------------------------------------------------
  private setFooter(expandFooter: boolean|Element) {
    var footerButton_node = document.getElementById(elementIDs.footer_buttonID);
    var footerModal_node = document.getElementById(elementIDs.footerModalID);
    var ef = (typeof expandFooter === "boolean"? expandFooter: this.startExpanded? this.startExpanded: false);
    var self = this;

    if (footerButton_node && footerModal_node) {
      if (typeof expandFooter === "object") {
        // This is the initial rendering setup.
        if (this.startExpanded === false) {
          footerModal_node.classList.add(css_theme.default.widget_footer_visible__hidden);
        }

        // Set event listeners
        footerModal_node.addEventListener('keydown', function (e) {
          let isEscapePressed = e.key === 'Escape' || e.keyCode === 27;
          if (!isEscapePressed) {
              return;
          } else {
            _isFooterExpanded = self.toggleFooter(false);
          }
        });

        footerButton_node.addEventListener('keydown', function (e) {
          let isEscapePressed = e.key === 'Escape' || e.keyCode === 27;
  
          if (!isEscapePressed) {
              return;
          } else {
            if (_isFooterExpanded === true) {
              _isFooterExpanded = self.toggleFooter(false);
                // console.log(`Element (${footer_node.id}) is within viewport.`);
            } else {
              return;
                // console.log(`Element (${footer_node.id}) is NOT within viewport.`);
            }
          }
        });
      }

      _isFooterExpanded = this.toggleFooter(ef);
    }
  }

  private _createReactLinks(linksArray: Array<Array<Link>>, linkLineDivClass=null as string|null, linkDivClass=null as string|null, anchorClass=null as string|null) {
    var _links = linksArray.map(links => 
      <div class={linkLineDivClass}>
        {links.map(link => 
          <div class={linkDivClass}>
            <a id={link.id} class={this.classes(anchorClass, css_theme.default.widget_footer__ignore)} href={link.url} target={link.target} title={link.title} tabindex='0' >{link.title}</a>
          </div>
        )}
      </div>
    );

    return _links;
  }

  private _modifyDOMLinks(linksArray: Array<Array<Link>>, targetID: string, linkLineDivClass=null as string|null, linkDivClass=null as string|null, anchorClass=null as string|null) {
    let div_node = document.getElementById(targetID);
    let _anchors = div_node?.getElementsByTagName('a') as HTMLCollectionOf<HTMLAnchorElement>;

    // Re-build the existing link list using the DOM
    linksArray.map(links => {
      links.map(link => {
        var _a = null as HTMLAnchorElement|null;
        for (let i=0; i<_anchors.length; i++) {
          if (_anchors[i].id.toLowerCase() === link.id.toLowerCase()) {
            _a = _anchors[i];
          }
        }
        if (_a) {
          _a.href = link.url;
          _a.title = link.title;
          _a.innerHTML = link.title;
        }
      });
    });
  }

  //--------------------------------------------------------------------------
  //  Private Event Methods
  //--------------------------------------------------------------------------

  private _footerButton_click(e: MouseEvent) {
    e.preventDefault();  // Prevent the default keypress action, i.e. space = scroll
    let ef = (_isFooterExpanded === true? false: true)
    _isFooterExpanded = this.toggleFooter(ef);
    // console.log(`Footer is ${_expanded}`);
  }

  private _footerButton_keypress(e: KeyboardEvent) {
    let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
    let isSpacePressed = e.key === 'Space' || e.keyCode === 32;

    if (isEnterPressed || isSpacePressed) {
      e.preventDefault();  // Prevent the default keypress action, i.e. space = scroll
      let ef = (_isFooterExpanded === true? false: true)
      _isFooterExpanded = this.toggleFooter(ef);
      // console.log(`Footer is ${_expanded}`);
    }
  }

  //--------------------------------------------------------------------------
  //  Public Methods
  //--------------------------------------------------------------------------

  toggleFooter(_expandFooter: boolean) {
    var isExpanded = false;
    var footerModal_node = document.getElementById(elementIDs.footerModalID)!;
    var footer_node = document.getElementById(elementIDs.footerID)!;
    var footerButton_node = document.getElementById(elementIDs.footer_buttonID)!;

    if (footerButton_node) {
      var footerIcon_node = document.getElementById(elementIDs.footer_button_iconID)!;
      var footerHeight = footer_node.clientHeight as number;

      if (_expandFooter === true) {
        footerButton_node.title = t9n.button.collapselabel;
        footerButton_node.setAttribute('aria-label', t9n.button.collapselabel);
        footerModal_node.classList.remove(css_theme.default.widget_footer_visible__hidden);
        footer_node.setAttribute('style', `transform: -webkit-translate(0px, 0px);transform: -moz-translate(0px, 0px);transform: -ms-translate(0px, 0px);transform: -o-translate(0px, 0px);transform: translate(0px, 0px);`);
        footer_node.classList.add(css_theme.default.widget_footer_box_shadow);
        footerIcon_node.classList.remove(css_esri.esri_icon_expand);
        footerIcon_node.classList.remove(css_esri.esri_expand_icon_expanded);
        footerIcon_node.classList.add(css_esri.esri_icon_collapse);
        footerIcon_node.classList.add(css_esri.esri_collapse_icon);
        isExpanded = true;
        // elementIDs.footerID is actually off page. Must include the DIV so it is easier for the user to hit <ESC> to close the menu.
        getFocusableElements(footer_node, footerButton_node, false, `#${elementIDs.footerID}, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`);
      }
      else {
        footerButton_node.title = t9n.button.label;
        footerButton_node.setAttribute('aria-label', t9n.button.label);
        footer_node.classList.remove(css_theme.default.widget_footer_box_shadow);
        footer_node.setAttribute('style', `transform: -webkit-translate(0px, ${footerHeight}px);transform: -moz-translate(0px, ${footerHeight}px);transform: -ms-translate(0px, ${footerHeight}px);transform: -o-translate(0px, ${footerHeight}px);transform: translate(0px, ${footerHeight}px);`);
        footerModal_node.classList.add(css_theme.default.widget_footer_visible__hidden);
        footerIcon_node.classList.add(css_esri.esri_icon_expand);
        footerIcon_node.classList.add(css_esri.esri_expand_icon_expanded);
        footerIcon_node.classList.remove(css_esri.esri_icon_collapse);
        footerIcon_node.classList.remove(css_esri.esri_collapse_icon);
        if (this.afterFooterCloseFocusElement) {
          if (typeof this.afterFooterCloseFocusElement === "string") {
            getFocusableElements(document.getElementById(this.afterFooterCloseFocusElement)!, null, true, `button:not(.${css_theme.default.widget_footer__ignore}), [href]:not(.${css_theme.default.widget_footer__ignore}), input:not(.${css_theme.default.widget_footer__ignore}), select:not(.${css_theme.default.widget_footer__ignore}), textarea:not(.${css_theme.default.widget_footer__ignore}), [tabindex]:not([tabindex="-1"]):not(.${css_theme.default.widget_footer__ignore}):not(.esri-attribution__sources)`);
          } else {
            getFocusableElements(this.afterFooterCloseFocusElement, null, true, `button:not(.${css_theme.default.widget_footer__ignore}), [href]:not(.${css_theme.default.widget_footer__ignore}), input:not(.${css_theme.default.widget_footer__ignore}), select:not(.${css_theme.default.widget_footer__ignore}), textarea:not(.${css_theme.default.widget_footer__ignore}), [tabindex]:not([tabindex="-1"]):not(.${css_theme.default.widget_footer__ignore}):not(.esri-attribution__sources)`);
          }
        }
      }
    }

    // if (footerButton_node) {
    //   var footerIcon_node = document.getElementById(elementIDs.footer_button_iconID)!;
    //   var footerHeight = footer_node.clientHeight as number;

    //   if (typeof _expandFooter === "object") {
    //     footerButton_node.title = t9n.button.label;
    //     footerButton_node.setAttribute('aria-label', t9n.button.label);
    //     footer_node.setAttribute('style', `transform: translate(0px, ${footerHeight}px);`);
    //     footerModal_node.classList.remove(css_theme.default.widget_footer_modal);
    //     footerIcon_node.classList.add(css_esri.esri_icon_expand);
    //     footerIcon_node.classList.add(css_esri.esri_expand_icon_expanded);
    //     footerIcon_node.classList.remove(css_esri.esri_icon_collapse);
    //     footerIcon_node.classList.remove(css_esri.esri_collapse_icon);
    //     footer_node.classList.remove(css_theme.default.widget_footer_box_shadow);
    //     if (this.afterFooterCloseFocusElement) {
    //       if (typeof this.afterFooterCloseFocusElement === "string") {
    //         getFocusableElements(document.getElementById(this.afterFooterCloseFocusElement)!, null, true, `button:not(.${css_theme.default.widget_footer__ignore}), [href]:not(.${css_theme.default.widget_footer__ignore}), input:not(.${css_theme.default.widget_footer__ignore}), select:not(.${css_theme.default.widget_footer__ignore}), textarea:not(.${css_theme.default.widget_footer__ignore}), [tabindex]:not([tabindex="-1"]):not(.esri-attribution__sources):not(.${css_theme.default.widget_footer__ignore}):not(.esri-attribution__sources)`);
    //       } else {
    //         getFocusableElements(this.afterFooterCloseFocusElement, null, true, `button:not(.${css_theme.default.widget_footer__ignore}), [href]:not(.${css_theme.default.widget_footer__ignore}), input:not(.${css_theme.default.widget_footer__ignore}), select:not(.${css_theme.default.widget_footer__ignore}), textarea:not(.${css_theme.default.widget_footer__ignore}), [tabindex]:not([tabindex="-1"]):not(.esri-attribution__sources):not(.${css_theme.default.widget_footer__ignore}):not(.esri-attribution__sources)`);
    //       }
    //     }
    //   } else {
    //     if (_expandFooter === false) {
    //       footerButton_node.title = t9n.button.collapselabel;
    //       footerButton_node.setAttribute('aria-label', t9n.button.collapselabel);
    //       footer_node.setAttribute('style', `transform: translate(0px, 0px);`);
    //       footerModal_node.classList.add(css_theme.default.widget_footer_modal);
    //       footer_node.classList.add(css_theme.default.widget_footer_box_shadow);
    //       footerIcon_node.classList.remove(css_esri.esri_icon_expand);
    //       footerIcon_node.classList.remove(css_esri.esri_expand_icon_expanded);
    //       footerIcon_node.classList.add(css_esri.esri_icon_collapse);
    //       footerIcon_node.classList.add(css_esri.esri_collapse_icon);
    //       isExpanded = true;

    //       getFocusableElements(footer_node, null, false, `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`);
    //     }
    //     else {
    //       footerButton_node.title = t9n.button.label;
    //       footerButton_node.setAttribute('aria-label', t9n.button.label);
    //       footer_node.setAttribute('style', `transform: translate(0px, ${footerHeight}px);`);
    //       footerModal_node.classList.remove(css_theme.default.widget_footer_modal);
    //       footer_node.classList.remove(css_theme.default.widget_footer_box_shadow);
    //       footerIcon_node.classList.add(css_esri.esri_icon_expand);
    //       footerIcon_node.classList.add(css_esri.esri_expand_icon_expanded);
    //       footerIcon_node.classList.remove(css_esri.esri_icon_collapse);
    //       footerIcon_node.classList.remove(css_esri.esri_collapse_icon);
    //       if (this.afterFooterCloseFocusElement) {
    //         if (typeof this.afterFooterCloseFocusElement === "string") {
    //           getFocusableElements(document.getElementById(this.afterFooterCloseFocusElement)!, null, true, `button:not(.${css_theme.default.widget_footer__ignore}), [href]:not(.${css_theme.default.widget_footer__ignore}), input:not(.${css_theme.default.widget_footer__ignore}), select:not(.${css_theme.default.widget_footer__ignore}), textarea:not(.${css_theme.default.widget_footer__ignore}), [tabindex]:not([tabindex="-1"]):not(.esri-attribution__sources):not(.${css_theme.default.widget_footer__ignore}):not(.esri-attribution__sources)`);
    //         } else {
    //           getFocusableElements(this.afterFooterCloseFocusElement, null, true, `button:not(.${css_theme.default.widget_footer__ignore}), [href]:not(.${css_theme.default.widget_footer__ignore}), input:not(.${css_theme.default.widget_footer__ignore}), select:not(.${css_theme.default.widget_footer__ignore}), textarea:not(.${css_theme.default.widget_footer__ignore}), [tabindex]:not([tabindex="-1"]):not(.esri-attribution__sources):not(.${css_theme.default.widget_footer__ignore}):not(.esri-attribution__sources)`);
    //         }
    //       }
    //     }
    //   }
    // }

    return isExpanded;  // Returns expanded state.
  }
}
export default Footer;