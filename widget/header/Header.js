import { __decorate } from "tslib";
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as reactiveUtils from '@arcgis/core/core/reactiveUtils';
import * as intl from "@arcgis/core/intl";
import { getFocusableElements, getWidgetTheme, setStyleSheet } from '@dnrr_fd/util/web';
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css_dark from './assets/css/dark/header.module.css';
import * as css_light from './assets/css/light/header.module.css';
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
let t9n = t9n_en;
let css_theme = css_dark;
let _locale;
let _isSiteMenuExpanded = false;
let self;
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
let _logo;
let _links;
let _menuLinks;
let _menuThemes;
let _menuLanguages;
let Header = class Header extends Widget {
    constructor(params) {
        super(params);
    }
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    postInitialize() {
        const _locale = getNormalizedLocale();
        // console.log(`_LOCALE: ${_locale}`);
        if (_locale === "en") {
            t9n = t9n_en;
        }
        else {
            t9n = t9n_fr;
        }
        self = this;
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
        reactiveUtils.watch(() => self.theme, (theme) => {
            css_theme = (theme === 'dark' ? css_dark : css_light);
        });
        reactiveUtils.watch(() => self.logo, (logo) => {
            self._modifyDOMLogo(logo, elementIDs.header_logoID, css_theme.default.widget_header_logo);
        });
        reactiveUtils.watch(() => self.links, (links) => {
            self._modifyDOMLinks(links, elementIDs.header_linksID, css_theme.default.widget_header_link);
        });
        reactiveUtils.watch(() => self.menu, (menu) => {
            self._modifyDOMLinks(menu.menulinks, elementIDs.sitemenu_linksID, css_theme.default.widget_header_submenu_link, true);
            self._modifyDOMThemeRBs(menu.themes, elementIDs.sitemenu_themesID, self.theme);
            if (menu.showlocales === true) {
                self._modifyDOMLanguageRBs(menu.languages, elementIDs.sitemenu_languagesID, _locale);
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
                            tsx("div", { id: elementIDs.header_sitemenuID, class: this.classes(css_esri.esri_widget, css_theme.default.widget_header_links_menu__button) },
                                tsx("div", { id: elementIDs.header_sitemenu_buttonID, class: css_esri.esri_widget_button, role: "button", "aria-label": t9n.sitemenu.collapse, title: t9n.sitemenu.collapse, tabIndex: "0", onclick: this._siteMenuButton_click.bind(this), onKeyPress: this._siteMenuButton_keypress.bind(this) },
                                    tsx("span", { id: elementIDs.header_sitemenu_iconID, class: this.classes(css_esri.esri_icon_drag_horizontal, css_esri.esri_expand_icon_expanded), "aria-hidden": "true" }),
                                    tsx("span", { class: css_esri.esri_icon_font_fallback_text }, t9n.sitemenu.collapse))))))),
            tsx("div", { class: css_theme.default.widget_header_bg_bg1 }),
            tsx("div", { class: css_theme.default.widget_header_bg_bg2 }),
            tsx("div", { class: css_theme.default.widget_header_bg_bg3 }),
            tsx("div", { id: elementIDs.sitemenuModalID, class: this.classes(css_theme.default.widget_header_modal) },
                tsx("div", { id: elementIDs.sitemenuID, class: this.classes(css_esri.esri_widget_panel, css_theme.default.widget_header_sitemenu__content, css_theme.default.widget_header_sitemenu, css_esri.esri_widget, css_theme.default.widget_header_transition, css_theme.default.widget_header_sitemenu__ignore), tabIndex: "0" },
                    tsx("div", { class: elementIDs.sitemenu_titleID },
                        tsx("h3", { "aria-label": t9n.sitemenu.menu.title }, t9n.sitemenu.menu.title)),
                    tsx("div", { id: elementIDs.sitemenu_linksID, class: css_theme.default.widget_header_submenu_links }, _menuLinks),
                    tsx("div", { id: elementIDs.sitemenu_languagesID, class: css_theme.default.widget_header_submenu_languages }, _menuLanguages),
                    tsx("div", { id: elementIDs.sitemenu_themesID, class: css_theme.default.widget_header_submenu_themes }, _menuThemes),
                    tsx("div", { id: elementIDs.sitemenu_signinID },
                        tsx("a", { href: "#", id: elementIDs.sitemenu_signoutLinkID, class: this.classes(css_esri.esri_widget_anchor, css_theme.default.widget_header_link__enabled, css_theme.default.widget_header_sitemenu__ignore), title: t9n.sitemenu.menu.signout, tabIndex: "0" }, t9n.sitemenu.menu.signout))))));
    }
    //--------------------------------------------------------------------------
    //  Private Methods
    //--------------------------------------------------------------------------
    setSiteMenu(expandSiteMenu) {
        const siteMenuButton_node = document.getElementById(elementIDs.header_sitemenu_buttonID);
        const siteMenuModal_node = document.getElementById(elementIDs.sitemenuModalID);
        const esm = (typeof expandSiteMenu === "boolean" ? expandSiteMenu : this.menu.startExpanded ? this.menu.startExpanded : false);
        if (siteMenuButton_node && siteMenuModal_node) {
            if (typeof expandSiteMenu === "object") {
                // This is the initial rendering setup.
                if (this.menu.startExpanded === false) {
                    siteMenuModal_node.classList.add(css_theme.default.widget_header_visibility__hidden);
                }
                // Set event listeners
                siteMenuModal_node.addEventListener('keydown', function (e) {
                    const isEscapePressed = e.key === 'Escape' || e.keyCode === 27;
                    if (!isEscapePressed) {
                        return;
                    }
                    else {
                        _isSiteMenuExpanded = self.toggleSiteMenu(false);
                    }
                });
                siteMenuButton_node.addEventListener('keydown', function (e) {
                    const isEscapePressed = e.key === 'Escape' || e.keyCode === 27;
                    if (!isEscapePressed) {
                        return;
                    }
                    else {
                        if (_isSiteMenuExpanded === true) {
                            _isSiteMenuExpanded = self.toggleSiteMenu(false);
                            // console.log(`Element (${siteMenu_node.id}) is within viewport.`);
                        }
                        else {
                            return;
                            // console.log(`Element (${siteMenu_node.id}) is NOT within viewport.`);
                        }
                    }
                });
            }
            _isSiteMenuExpanded = this.toggleSiteMenu(esm);
        }
    }
    _theme_change(themeID) {
        setStyleSheet(`https://js.arcgis.com/4.20/@arcgis/core/assets/esri/themes/${themeID}/main.css`, elementIDs.esriThemeID); // ESRI Themed CSS
        this.theme = themeID;
    }
    _getLocale() {
        const loc = intl.getLocale();
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
        return (tsx("a", { class: css_theme.default.widget_header_logo_a, href: logo.url, title: logo.title, tabIndex: '0', target: logo.target },
            tsx("img", { class: css_theme.default.widget_header_logo_img, src: logo.src, alt: logo.alt })));
    }
    _modifyDOMLogo(logo, targetID, logoDivClass = null) {
        const div_node = document.getElementById(targetID);
        const _a = div_node?.getElementsByTagName('a')[0];
        const _img = _a?.getElementsByTagName('img')[0];
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
            const _links = linksArray.map(link => tsx("div", { key: `${link.id}_key`, class: linkDivClass },
                tsx("a", { id: `${link.id}${postFix}`, class: this.classes(css_esri.esri_widget_anchor, css_theme.default.widget_header_sitemenu__ignore), href: link.url, target: link.target, title: link.title, tabIndex: '0' }, link.title)));
        }
        else {
            const _links = linksArray.map(link => tsx("div", { key: `${link.id}_key`, class: linkDivClass },
                tsx("a", { id: `${link.id}${postFix}`, class: css_esri.esri_widget_anchor, href: link.url, target: link.target, title: link.title, tabIndex: '0' }, link.title)));
        }
        return _links;
    }
    _modifyDOMLinks(linksArray, targetID, linkDivClass = null, menuLinkTag = false) {
        const div_node = document.getElementById(targetID);
        const _anchors = div_node?.getElementsByTagName('a');
        let postFix = "";
        if (menuLinkTag === true) {
            postFix = "_menu";
        }
        // Re-build the existing link list using the DOM
        linksArray.map(link => {
            const linkID = `${link.id}${postFix}`;
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
        const _themes = themesArray.map(theme => tsx("div", { key: `${theme.id}_key`, class: themeDivClass },
            tsx("input", { type: "radio", id: theme.id, class: css_theme.default.widget_header_sitemenu__ignore, checked: theme.id === defaultThemeID ? true : false, name: "set_theme", value: theme.id, title: theme.label, tabIndex: "0", onChange: this._theme_change.bind(this, theme.id) }),
            tsx("label", { id: `${theme.id}_label`, htmlFor: theme.id }, theme.label),
            tsx("br", null)));
        return (tsx("fieldset", { class: css_theme.default.widget_header_sitemenu_fieldset },
            tsx("legend", { class: css_theme.default.widget_header_sitemenu_fieldset_legend, "aria-label": t9n.sitemenu.menu.theme.grouplabel }, t9n.sitemenu.menu.theme.grouplabel),
            _themes));
    }
    _modifyDOMThemeRBs(themesArray, targetID, defaultThemeID, themeDivClass = null) {
        const div_node = document.getElementById(targetID);
        const _fieldset = div_node?.getElementsByTagName('fieldset')[0];
        const _legend = _fieldset?.getElementsByTagName('legend')[0];
        if (_legend) {
            _legend.ariaLabel = t9n.sitemenu.menu.theme.grouplabel;
            _legend.innerHTML = t9n.sitemenu.menu.theme.grouplabel;
        }
        const _themeRBs = _fieldset?.getElementsByTagName('input');
        const _themeLabels = _fieldset?.getElementsByTagName('label');
        // Modify the existing theme list using the DOM
        themesArray.map(function (theme) {
            let _themeRB = null;
            let _themeLabel = null;
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
        const _languages = languagesArray.map(lang => tsx("div", { key: `${lang.id}_key`, class: localeDivClass },
            tsx("input", { type: "radio", id: lang.id, class: css_theme.default.widget_header_sitemenu__ignore, checked: lang.id === defaultLocaleID ? true : false, name: "set_language", value: lang.id, title: lang.label, tabIndex: "0", onChange: this._setLocale.bind(this, lang.id) }),
            tsx("label", { id: `${lang.id}_label`, htmlFor: lang.id }, lang.label),
            tsx("br", null)));
        return (tsx("fieldset", { class: css_theme.default.widget_header_sitemenu_fieldset },
            tsx("legend", { class: css_theme.default.widget_header_sitemenu_fieldset_legend, "aria-label": t9n.sitemenu.menu.languages.label }, t9n.sitemenu.menu.languages.label),
            _languages));
    }
    _modifyDOMLanguageRBs(languagesArray, targetID, defaultLocaleID, localeDivClass = null) {
        const div_node = document.getElementById(targetID);
        const _fieldset = div_node?.getElementsByTagName('fieldset')[0];
        const _legend = _fieldset?.getElementsByTagName('legend')[0];
        if (_legend) {
            _legend.ariaLabel = t9n.sitemenu.menu.languages.label;
            _legend.innerHTML = t9n.sitemenu.menu.languages.label;
        }
        const _langRBs = _fieldset?.getElementsByTagName('input');
        const _langLabels = _fieldset?.getElementsByTagName('label');
        // Modify the existing language list using the DOM
        languagesArray.map(function (lang) {
            let _langRB = null;
            let _langLabel = null;
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
                // _langRB.checked = lang.id === defaultLocaleID ? true : false;
                _langLabel.innerHTML = lang.label;
            }
        });
    }
    _removeDivChildNodes(targetID) {
        // Clear the child nodes from the parent first
        const div_node = document.getElementById(targetID);
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
    _siteMenuButton_click(e) {
        e.preventDefault(); // Prevent the default keypress action, i.e. space = scroll
        const esm = (_isSiteMenuExpanded === true ? false : true);
        _isSiteMenuExpanded = this.toggleSiteMenu(esm);
        console.log(`Site Menu is ${_isSiteMenuExpanded}`);
    }
    _siteMenuButton_keypress(e) {
        const isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
        const isSpacePressed = e.key === 'Space' || e.keyCode === 32;
        if (isEnterPressed || isSpacePressed) {
            e.preventDefault(); // Prevent the default keypress action, i.e. space = scroll
            const esm = (_isSiteMenuExpanded === true ? false : true);
            _isSiteMenuExpanded = this.toggleSiteMenu(esm);
            console.log(`Site Menu is ${_isSiteMenuExpanded}`);
        }
    }
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    toggleSiteMenu(_expandSiteMenu) {
        let isExpanded = false;
        const sitemenuModal_node = document.getElementById(elementIDs.sitemenuModalID);
        const sitemenu_node = document.getElementById(elementIDs.sitemenuID);
        const sitemenuButton_node = document.getElementById(elementIDs.header_sitemenu_buttonID);
        if (sitemenuButton_node) {
            const sitemenuIcon_node = document.getElementById(elementIDs.header_sitemenu_iconID);
            const siteMenuWidth = sitemenu_node.clientWidth;
            if (_expandSiteMenu === true) {
                sitemenuButton_node.title = t9n.sitemenu.collapse;
                sitemenuButton_node.setAttribute('aria-label', t9n.sitemenu.collapse);
                sitemenuModal_node.classList.remove(css_theme.default.widget_header_visibility__hidden);
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
                getFocusableElements(sitemenu_node, sitemenuButton_node, false, `#${elementIDs.sitemenuID}, button, [href], input, select, textarea, [tabindex]:not([tabIndex="-1"])`);
            }
            else {
                sitemenuButton_node.title = t9n.sitemenu.label;
                sitemenuButton_node.setAttribute('aria-label', t9n.sitemenu.label);
                sitemenu_node.classList.remove(css_theme.default.widget_header_sitemenu_box_shadow);
                // sitemenu_node.classList.add(css_theme.default.widget_header_sitemenu_closed__content);
                // sitemenu_node.classList.remove(css_theme.default.widget_header_sitemenu_open__content);
                sitemenu_node.setAttribute('style', `transform: -webkit-translate(${siteMenuWidth + 3}px, 0px);transform: -moz-translate(${siteMenuWidth + 3}px, 0px);transform: -ms-translate(${siteMenuWidth + 3}px, 0px);transform: -o-translate(${siteMenuWidth + 3}px, 0px);transform: translate(${siteMenuWidth + 3}px, 0px);`);
                sitemenuModal_node.classList.add(css_theme.default.widget_header_visibility__hidden);
                sitemenuIcon_node.classList.add(css_esri.esri_icon_drag_horizontal);
                sitemenuIcon_node.classList.add(css_esri.esri_expand_icon_expanded);
                sitemenuIcon_node.classList.remove(css_esri.esri_icon_collapse);
                sitemenuIcon_node.classList.remove(css_esri.esri_collapse_icon);
                if (this.afterMenuCloseFocusElement) {
                    if (typeof this.afterMenuCloseFocusElement === "string") {
                        getFocusableElements(document.getElementById(this.afterMenuCloseFocusElement), null, true, `button:not(.${css_theme.default.widget_header_sitemenu__ignore}), [href]:not(.${css_theme.default.widget_header_sitemenu__ignore}), input:not(.${css_theme.default.widget_header_sitemenu__ignore}), select:not(.${css_theme.default.widget_header_sitemenu__ignore}), textarea:not(.${css_theme.default.widget_header_sitemenu__ignore}), [tabindex]:not([tabIndex="-1"]):not(.${css_theme.default.widget_header_sitemenu__ignore}):not(.esri-attribution__sources)`);
                    }
                    else {
                        getFocusableElements(this.afterMenuCloseFocusElement, null, true, `button:not(.${css_theme.default.widget_header_sitemenu__ignore}), [href]:not(.${css_theme.default.widget_header_sitemenu__ignore}), input:not(.${css_theme.default.widget_header_sitemenu__ignore}), select:not(.${css_theme.default.widget_header_sitemenu__ignore}), textarea:not(.${css_theme.default.widget_header_sitemenu__ignore}), [tabindex]:not([tabIndex="-1"]):not(.${css_theme.default.widget_header_sitemenu__ignore}):not(.esri-attribution__sources)`);
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