import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { getFocusableElements, getWidgetTheme, setStyleSheet } from '@dnrr_fd/util/web';
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css_dark from './assets/css/dark/header.module.css';
import * as css_light from './assets/css/light/header.module.css';
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
var t9n = t9n_en;
var css_theme = css_dark;
var _locale;
var _expanded = false;
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
    header_sitemenu_buttonInputID: "header_sitemenu_buttonInputID",
    header_sitemenu_buttonInputLabelID: "header_sitemenu_buttonInputLabelID",
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
var _logo;
var _links;
var _menuLinks;
var _menuThemes;
var _menuLanguages;
let Header = class Header extends Widget {
    constructor(params) {
        super(params);
    }
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    postInitialize() {
        var _locale = getNormalizedLocale();
        // console.log(`_LOCALE: ${_locale}`);
        if (_locale === "en") {
            t9n = t9n_en;
        }
        else {
            t9n = t9n_fr;
        }
        var self = this;
        this.label = this.title;
        intl.onLocaleChange(function (locale) {
            t9n = (locale === 'fr' ? t9n_fr : t9n_en);
        });
        //Set the initial theme
        this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme);
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
        }
        else {
            _menuLanguages = tsx("div", null);
        }
        this.menu.signoutlinkid = elementIDs.sitemenu_signoutLinkID;
        // Watch for changes
        this.watch("theme", function (theme_new, theme_old, propertyName, target) {
            css_theme = (theme_new === 'dark' ? css_dark : css_light);
            // // Keep the sitemenu open
            // self.toggleSiteMenu(false);
            // console.log(`Watch: Theme is now ${theme_new}`);
        });
        this.watch("logo", function (logo_new) {
            self._modifyDOMLogo(logo_new, elementIDs.header_logoID, css_theme.default.widget_header_logo);
        });
        this.watch("links", function (links_new) {
            self._modifyDOMLinks(links_new, elementIDs.header_linksID, css_theme.default.widget_header_link);
        });
        this.watch("menu", function (menu_new) {
            self._modifyDOMLinks(menu_new.menulinks, elementIDs.sitemenu_linksID, css_theme.default.widget_header_submenu_link, true);
            self._modifyDOMThemeRBs(menu_new.themes, elementIDs.sitemenu_themesID, self.theme);
            if (menu_new.showlocales === true) {
                self._modifyDOMLanguageRBs(menu_new.languages, elementIDs.sitemenu_languagesID, _locale);
            }
            else {
                self._removeDivChildNodes(elementIDs.sitemenu_languagesID);
            }
        });
    }
    render() {
        return (tsx("div", { id: elementIDs.headerID, afterCreate: this.setSiteMenu, bind: this, class: this.classes(css_theme.default.widget_header, css_theme.default.widget_header_transition, css_esri.esri_widget) },
            tsx("div", { id: elementIDs.header_foregroundID, class: css_theme.default.widget_header_fg },
                tsx("div", { id: elementIDs.header_logoTitleID, class: css_theme.default.widget_header_logo_title },
                    tsx("div", { id: elementIDs.header_logoID, class: css_theme.default.widget_header_logo }, _logo),
                    tsx("div", { id: elementIDs.header_titleID, class: css_theme.default.widget_header_title },
                        tsx("div", null,
                            tsx("h1", { class: css_theme.default.widget_header_title_title }, this.title),
                            tsx("h3", { class: css_theme.default.widget_header_title_subtitle }, this.subtitle)))),
                tsx("div", { class: css_theme.default.widget_header_links_menu },
                    tsx("div", null,
                        tsx("div", { id: elementIDs.header_linksID, class: css_theme.default.widget_header_links }, _links),
                        tsx("div", { class: css_theme.default.widget_header_menu },
                            tsx("div", { id: elementIDs.header_sitemenuID, class: this.classes(css_esri.esri_widget, css_esri.esri_widget_button, css_theme.default.widget_header_links_menu__button) },
                                tsx("input", { id: elementIDs.header_sitemenu_buttonInputID, type: 'checkbox', class: css_esri.esri_widget_button, checked: "false", tabindex: "0", onchange: this._siteMenuButton_change.bind(this) }),
                                tsx("label", { id: elementIDs.header_sitemenu_buttonInputLabelID, for: elementIDs.header_sitemenu_buttonInputID, "aria-label": t9n.sitemenu.label, title: t9n.sitemenu.label })))))),
            tsx("div", { class: css_theme.default.widget_header_bg_bg1 }),
            tsx("div", { class: css_theme.default.widget_header_bg_bg2 }),
            tsx("div", { class: css_theme.default.widget_header_bg_bg3 }),
            tsx("div", { id: elementIDs.sitemenuModalID, class: this.classes(css_theme.default.widget_header_modal, css_theme.default.widget_header_visible__hidden) },
                tsx("div", { id: elementIDs.sitemenuID, class: this.classes(css_esri.esri_widget_panel, css_theme.default.widget_header_sitemenu__content, css_theme.default.widget_header_sitemenu, css_esri.esri_widget, css_theme.default.widget_header_transition), tabindex: "0" },
                    tsx("div", { class: elementIDs.sitemenu_titleID },
                        tsx("h3", { "aria-label": t9n.sitemenu.menu.title }, t9n.sitemenu.menu.title)),
                    tsx("div", { id: elementIDs.sitemenu_linksID, class: css_theme.default.widget_header_submenu_links }, _menuLinks),
                    tsx("div", { id: elementIDs.sitemenu_languagesID, class: css_theme.default.widget_header_submenu_languages }, _menuLanguages),
                    tsx("div", { id: elementIDs.sitemenu_themesID, class: css_theme.default.widget_header_submenu_themes }, _menuThemes),
                    tsx("div", { id: elementIDs.sitemenu_signinID },
                        tsx("a", { href: "#", id: elementIDs.sitemenu_signoutLinkID, class: this.classes(css_esri.esri_widget_anchor, css_theme.default.widget_header_link__enabled), title: t9n.sitemenu.menu.signout, tabindex: "0" }, t9n.sitemenu.menu.signout))))));
    }
    //--------------------------------------------------------------------------
    //  Private Methods
    //--------------------------------------------------------------------------
    setSiteMenu(expanded) {
        var siteMenuButtonInput_node = document.getElementById(elementIDs.header_sitemenu_buttonInputID);
        siteMenuButtonInput_node.checked = _expanded;
        // var siteMenuButton_node = document.getElementById(elementIDs.header_sitemenu_buttonID);
        // var siteMenuModal_node = document.getElementById(elementIDs.sitemenuModalID);
        // var self = this;
        // if (siteMenuButton_node && siteMenuModal_node) {
        //   siteMenuButton_node.addEventListener('keydown', function (e) {
        //     let isEscapePressed = e.key === 'Escape' || e.keyCode === 27;
        //     if (!isEscapePressed) {
        //         return;
        //     } else {
        //       if (_expanded === true) {
        //         _expanded = self.toggleSiteMenu(true);
        //           // console.log(`Element (${siteMenu_node.id}) is within viewport.`);
        //       } else {
        //         return;
        //           // console.log(`Element (${siteMenu_node.id}) is NOT within viewport.`);
        //       }
        //     }
        //   });
        // }
        // if (siteMenuModal_node){
        //   siteMenuModal_node.addEventListener('keydown', function (e) {
        //     let isEscapePressed = e.key === 'Escape' || e.keyCode === 27;
        //     if (!isEscapePressed) {
        //         return;
        //     } else {
        //       _expanded = self.toggleSiteMenu(true);
        //     }
        //   });
        // }
        // _expanded = this.toggleSiteMenu(expanded);
    }
    _theme_change(themeID) {
        setStyleSheet(`https://js.arcgis.com/4.20/@arcgis/core/assets/esri/themes/${themeID}/main.css`, elementIDs.esriThemeID); // ESRI Themed CSS
        this.theme = themeID;
    }
    _getLocale() {
        let loc = intl.getLocale();
        if (loc.toLowerCase() === 'en-us' || loc.toLowerCase() === 'en') {
            _locale = 'en';
        }
        else if (loc.toLowerCase() === 'fr') {
            _locale = 'fr';
        }
        else {
            throw new Error(`The language specified ${loc} is not valid for this site!`);
        }
        return _locale;
    }
    _setLocale(localeID) {
        intl.setLocale(localeID);
        // console.log(`New Locale: ${localeID}`);
        _locale = this._getLocale();
    }
    _createReactLogo(logo, logoDivClass = null) {
        return (tsx("a", { class: css_theme.default.widget_header_logo_a, href: logo.url, title: logo.title, target: logo.target },
            tsx("img", { class: css_theme.default.widget_header_logo_img, src: logo.src, alt: logo.alt })));
    }
    _modifyDOMLogo(logo, targetID, logoDivClass = null) {
        let div_node = document.getElementById(targetID);
        let _a = div_node?.getElementsByTagName('a')[0];
        let _img = _a?.getElementsByTagName('img')[0];
        if (_a && _img) {
            _a.href = logo.url;
            _a.title = logo.title;
            _img.src = logo.src;
            _img.alt = logo.alt;
        }
    }
    _createReactLinks(linksArray, linkDivClass = null, menuLinkTag = false) {
        let postFix = "";
        if (menuLinkTag === true) {
            postFix = "_menu";
        }
        var _links = linksArray.map(link => tsx("div", { class: linkDivClass },
            tsx("a", { id: `${link.id}${postFix}`, class: css_esri.esri_widget_anchor, href: link.url, target: link.target, title: link.title, tabindex: '0' }, link.title)));
        return _links;
    }
    _modifyDOMLinks(linksArray, targetID, linkDivClass = null, menuLinkTag = false) {
        let div_node = document.getElementById(targetID);
        let _anchors = div_node?.getElementsByTagName('a');
        let postFix = "";
        if (menuLinkTag === true) {
            postFix = "_menu";
        }
        // Re-build the existing link list using the DOM
        linksArray.map(link => {
            let linkID = `${link.id}${postFix}`;
            let _a = null;
            for (let i = 0; i < _anchors.length; i++) {
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
    _createReactThemeRBs(themesArray, defaultThemeID, themeDivClass = null) {
        var _themes = themesArray.map(theme => tsx("div", { class: themeDivClass },
            tsx("input", { type: "radio", id: theme.id, checked: theme.id === defaultThemeID ? true : false, name: "set_theme", value: theme.id, title: theme.label, tabindex: "0", onchange: this._theme_change.bind(this, theme.id) }),
            tsx("label", { id: `${theme.id}_label`, for: theme.id }, theme.label),
            tsx("br", null)));
        return (tsx("fieldset", { class: css_theme.default.widget_header_sitemenu_fieldset },
            tsx("legend", { class: css_theme.default.widget_header_sitemenu_fieldset_legend, "aria-label": t9n.sitemenu.menu.theme.grouplabel }, t9n.sitemenu.menu.theme.grouplabel),
            _themes));
    }
    _modifyDOMThemeRBs(themesArray, targetID, defaultThemeID, themeDivClass = null) {
        let div_node = document.getElementById(targetID);
        let _fieldset = div_node?.getElementsByTagName('fieldset')[0];
        let _legend = _fieldset?.getElementsByTagName('legend')[0];
        if (_legend) {
            _legend.ariaLabel = t9n.sitemenu.menu.theme.grouplabel;
            _legend.innerHTML = t9n.sitemenu.menu.theme.grouplabel;
        }
        let _themeRBs = _fieldset?.getElementsByTagName('input');
        let _themeLabels = _fieldset?.getElementsByTagName('label');
        // Modify the existing theme list using the DOM
        themesArray.map(function (theme) {
            var _themeRB = null;
            var _themeLabel = null;
            for (let i = 0; i < _themeRBs.length; i++) {
                if (_themeRBs[i].id.toLowerCase() === theme.id.toLowerCase()) {
                    _themeRB = _themeRBs[i];
                }
            }
            for (let i = 0; i < _themeLabels.length; i++) {
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
    _createReactLanguageRBs(languagesArray, defaultLocaleID, localeDivClass = null) {
        var _languages = languagesArray.map(lang => tsx("div", { class: localeDivClass },
            tsx("input", { type: "radio", id: lang.id, checked: lang.id === defaultLocaleID ? true : false, name: "set_language", value: lang.id, title: lang.label, tabindex: "0", onchange: this._setLocale.bind(this, lang.id) }),
            tsx("label", { id: `${lang.id}_label`, for: lang.id }, lang.label),
            tsx("br", null)));
        return (tsx("fieldset", { class: css_theme.default.widget_header_sitemenu_fieldset },
            tsx("legend", { class: css_theme.default.widget_header_sitemenu_fieldset_legend, "aria-label": t9n.sitemenu.menu.languages.label }, t9n.sitemenu.menu.languages.label),
            _languages));
    }
    _modifyDOMLanguageRBs(languagesArray, targetID, defaultLocaleID, localeDivClass = null) {
        let div_node = document.getElementById(targetID);
        let _fieldset = div_node?.getElementsByTagName('fieldset')[0];
        let _legend = _fieldset?.getElementsByTagName('legend')[0];
        if (_legend) {
            _legend.ariaLabel = t9n.sitemenu.menu.languages.label;
            _legend.innerHTML = t9n.sitemenu.menu.languages.label;
        }
        let _langRBs = _fieldset?.getElementsByTagName('input');
        let _langLabels = _fieldset?.getElementsByTagName('label');
        // Modify the existing language list using the DOM
        languagesArray.map(function (lang) {
            var _langRB = null;
            var _langLabel = null;
            for (let i = 0; i < _langRBs.length; i++) {
                if (_langRBs[i].id.toLowerCase() === lang.id.toLowerCase()) {
                    _langRB = _langRBs[i];
                }
            }
            for (let i = 0; i < _langLabels.length; i++) {
                if (_langLabels[i].id.toLowerCase() === `${lang.id.toLowerCase()}_label`) {
                    _langLabel = _langLabels[i];
                }
            }
            if (_langRB && _langLabel) {
                _langRB.title = lang.label;
                _langRB.checked = lang.id === defaultLocaleID ? true : false;
                _langLabel.innerHTML = lang.label;
            }
        });
    }
    _removeDivChildNodes(targetID) {
        // Clear the child nodes from the parent first
        let div_node = document.getElementById(targetID);
        if (div_node) {
            while (div_node.firstChild) {
                div_node.removeChild(div_node.lastChild);
            }
        }
        return div_node;
    }
    //--------------------------------------------------------------------------
    //  Private Event Methods
    //--------------------------------------------------------------------------
    _siteMenuButton_change() {
        var sitemenuButtonInput_node = document.getElementById(elementIDs.header_sitemenu_buttonInputID);
        if (sitemenuButtonInput_node.checked) {
            _expanded = this.toggleSiteMenu(false);
        }
        else {
            _expanded = this.toggleSiteMenu(true);
        }
        console.log(`Site Menu is ${_expanded}`);
    }
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    toggleSiteMenu(expanded) {
        var isExpanded = false;
        var sitemenuModal_node = document.getElementById(elementIDs.sitemenuModalID);
        var sitemenu_node = document.getElementById(elementIDs.sitemenuID);
        var sitemenuButtonInputLabel_node = document.getElementById(elementIDs.header_sitemenu_buttonInputLabelID);
        if (sitemenuButtonInputLabel_node) {
            // var sitemenuIcon_node = document.getElementById(elementIDs.header_sitemenu_iconID)!;
            var siteMenuWidth = sitemenu_node.clientWidth;
            if (typeof expanded === "object") {
                sitemenuButtonInputLabel_node.title = t9n.sitemenu.label;
                sitemenuButtonInputLabel_node.setAttribute('aria-label', t9n.sitemenu.label);
                sitemenu_node.classList.remove(css_theme.default.widget_header_sitemenu_box_shadow);
                sitemenu_node.setAttribute('style', `transform: -webkit-translate(${siteMenuWidth + 3}px, 0px);transform: -moz-translate(${siteMenuWidth + 3}px, 0px);transform: -ms-translate(${siteMenuWidth + 3}px, 0px);transform: -o-translate(${siteMenuWidth + 3}px, 0px);transform: translate(${siteMenuWidth + 3}px, 0px);`);
                sitemenuModal_node.classList.add(css_theme.default.widget_header_visible__hidden);
                // sitemenuIcon_node.classList.add(css_esri.esri_icon_drag_horizontal);
                // sitemenuIcon_node.classList.add(css_esri.esri_expand_icon_expanded);
                // sitemenuIcon_node.classList.remove(css_esri.esri_icon_collapse);
                // sitemenuIcon_node.classList.remove(css_esri.esri_collapse_icon);
                if (this.afterMenuCloseFocusElement) {
                    if (typeof this.afterMenuCloseFocusElement === "string") {
                        getFocusableElements(document.getElementById(this.afterMenuCloseFocusElement));
                    }
                    else {
                        getFocusableElements(this.afterMenuCloseFocusElement);
                    }
                }
            }
            else {
                if (expanded === false) {
                    sitemenuButtonInputLabel_node.title = t9n.sitemenu.collapse;
                    sitemenuButtonInputLabel_node.setAttribute('aria-label', t9n.sitemenu.collapse);
                    sitemenuModal_node.classList.remove(css_theme.default.widget_header_visible__hidden);
                    sitemenu_node.setAttribute('style', `transform: -webkit-translate(0px, 0px);transform: -moz-translate(0px, 0px);transform: -ms-translate(0px, 0px);transform: -o-translate(0px, 0px);transform: translate(0px, 0px);`);
                    sitemenu_node.classList.add(css_theme.default.widget_header_sitemenu_box_shadow);
                    // sitemenuIcon_node.classList.remove(css_esri.esri_icon_drag_horizontal);
                    // sitemenuIcon_node.classList.remove(css_esri.esri_expand_icon_expanded);
                    // sitemenuIcon_node.classList.add(css_esri.esri_icon_collapse);
                    // sitemenuIcon_node.classList.add(css_esri.esri_collapse_icon);
                    isExpanded = true;
                    // elementIDs.sitemenuID is actually off page. Must include the DIV so it is easier for the user to hit <ESC> to close the menu.
                    getFocusableElements(sitemenu_node, sitemenuButtonInputLabel_node, false, `#${elementIDs.sitemenuID}, button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`);
                }
                else {
                    sitemenuButtonInputLabel_node.title = t9n.sitemenu.label;
                    sitemenuButtonInputLabel_node.setAttribute('aria-label', t9n.sitemenu.label);
                    sitemenu_node.classList.remove(css_theme.default.widget_header_sitemenu_box_shadow);
                    sitemenu_node.setAttribute('style', `transform: -webkit-translate(${siteMenuWidth + 3}px, 0px);transform: -moz-translate(${siteMenuWidth + 3}px, 0px);transform: -ms-translate(${siteMenuWidth + 3}px, 0px);transform: -o-translate(${siteMenuWidth + 3}px, 0px);transform: translate(${siteMenuWidth + 3}px, 0px);`);
                    sitemenuModal_node.classList.add(css_theme.default.widget_header_visible__hidden);
                    // sitemenuIcon_node.classList.add(css_esri.esri_icon_drag_horizontal);
                    // sitemenuIcon_node.classList.add(css_esri.esri_expand_icon_expanded);
                    // sitemenuIcon_node.classList.remove(css_esri.esri_icon_collapse);
                    // sitemenuIcon_node.classList.remove(css_esri.esri_collapse_icon);
                    if (this.afterMenuCloseFocusElement) {
                        if (typeof this.afterMenuCloseFocusElement === "string") {
                            getFocusableElements(document.getElementById(this.afterMenuCloseFocusElement));
                        }
                        else {
                            getFocusableElements(this.afterMenuCloseFocusElement);
                        }
                    }
                }
            }
        }
        return isExpanded; // Returns expanded state.
    }
};
__decorate([
    property()
], Header.prototype, "afterMenuCloseFocusElement", void 0);
__decorate([
    property()
], Header.prototype, "title", void 0);
__decorate([
    property()
], Header.prototype, "subtitle", void 0);
__decorate([
    property()
], Header.prototype, "logo", void 0);
__decorate([
    property()
], Header.prototype, "links", void 0);
__decorate([
    property()
], Header.prototype, "menu", void 0);
__decorate([
    property()
], Header.prototype, "theme", void 0);
Header = __decorate([
    subclass("dnrr.forestry.widgets.header")
], Header);
export default Header;
//# sourceMappingURL=Header.js.map