import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { getFocusableElements, getWidgetTheme } from '@dnrr_fd/util/web';
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css_dark from './assets/css/dark/footer.module.css';
import * as css_light from './assets/css/light/footer.module.css';
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
var css_theme = css_dark;
var t9n = t9n_en;
var _expanded = false;
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
var _links;
let Footer = class Footer extends Widget {
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
        this.label = t9n.button.label;
        //Set the initial theme
        this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme);
        css_theme = (this.theme === 'dark' ? css_dark : css_light);
        _links = this._createReactLinks(this.links, css_theme.default.widget_footer_links__linediv, css_theme.default.widget_footer_links__linkdiv, css_theme.default.widget_footer_links__anchor);
        // Watch for changes
        intl.onLocaleChange(function (locale) {
            self.locale = locale;
            t9n = (locale === 'fr' ? t9n_fr : t9n_en);
        });
        this.watch("theme", function (theme_new, theme_old) {
            css_theme = (theme_new === 'dark' ? css_dark : css_light);
            // self.render();
            // console.log(`Watch: Theme (Footer) is now ${theme_new}`);
        });
        this.watch("links", function (links_new, links_old) {
            if (links_old) {
                self._modifyDOMLinks(links_new, elementIDs.footer_linksID);
            }
        });
    }
    render() {
        return (tsx("div", { id: elementIDs.footerModalID, afterCreate: this.setFooter, bind: this },
            tsx("div", { id: elementIDs.footerID, class: this.classes(css_theme.default.widget_footer, css_theme.default.widget_footer_transition, css_esri.esri_widget) },
                tsx("div", { id: elementIDs.footer_buttonBarID, class: css_theme.default.widget_footer_button_bar },
                    tsx("div", { id: elementIDs.footer_buttonID, class: this.classes(css_theme.default.widget_footer_button, css_esri.esri_widget_button), role: "button", "aria-label": t9n.button.collapselabel, title: t9n.button.collapselabel, tabindex: '0', onclick: this._footerButton_click.bind(this), onkeypress: this._footerButton_keypress.bind(this) },
                        tsx("span", { id: elementIDs.footer_button_iconID, "aria-hidden": "true", class: this.classes(css_esri.esri_expand_icon_expanded, css_esri.esri_icon_expand, css_theme.default.widget_footer_transform_90_down) }),
                        tsx("span", { class: css_esri.esri_icon_font_fallback_text }, t9n.button.label))),
                tsx("div", { id: elementIDs.footer_foregroundID, class: css_theme.default.widget_footer_fg },
                    tsx("div", { id: elementIDs.footer_titleID, class: css_theme.default.widget_footer_title },
                        tsx("p", null, this.title)),
                    tsx("div", { id: elementIDs.footer_bodytextID, class: css_theme.default.widget_footer_bodytext },
                        tsx("p", null,
                            `${this.bodytext?.text ? this.bodytext.text : t9n.bodytext.text} `,
                            tsx("a", { class: this.classes(css_theme.default.widget_footer_bodytext_contact__anchor), href: `mailto:${this.bodytext?.contactemail.emailaddress ? this.bodytext.contactemail.emailaddress : t9n.bodytext.contactemail.emailaddress}?Subject=${this.bodytext?.contactemail.subjectline ? this.bodytext.contactemail.subjectline : t9n.bodytext.contactemail.subjectline}`, title: this.bodytext?.contactemail.displayedemailtext ? this.bodytext.contactemail.displayedemailtext : t9n.bodytext.contactemail.displayedemailtext, target: '_top', tabindex: '0' }, this.bodytext?.contactemail.displayedemailtext ? this.bodytext.contactemail.displayedemailtext : t9n.bodytext.contactemail.displayedemailtext))),
                    tsx("div", { id: elementIDs.footer_linksID, class: this.classes(css_theme.default.widget_footer_links) }, _links),
                    tsx("div", { id: elementIDs.footer_copyrightID, class: this.classes(css_theme.default.widget_footer_copyright) },
                        tsx("a", { class: this.classes(css_theme.default.widget_footer_copyright__anchor), href: this.copyright?.link.url ? this.copyright.link.url : t9n.copyright.link.url, title: this.copyright?.link.title ? this.copyright.link.title : t9n.copyright.link.title, target: this.copyright?.link.target ? this.copyright.link.target : t9n.copyright.link.target }, this.copyright?.link.title ? this.copyright.link.title : t9n.copyright.link.title))),
                tsx("div", { class: css_theme.default.widget_footer_bg_bg1 }),
                tsx("div", { class: css_theme.default.widget_footer_bg_bg1a }),
                tsx("div", { class: css_theme.default.widget_footer_bg_bg2 }),
                tsx("div", { class: css_theme.default.widget_footer_bg_bg2a }),
                tsx("div", { class: css_theme.default.widget_footer_bg_bg3 }),
                tsx("div", { class: css_theme.default.widget_footer_bg_bg3a }),
                tsx("div", { class: css_theme.default.widget_footer_bg_bg4 }),
                tsx("div", { class: css_theme.default.widget_footer_bg_bg4a }))));
    }
    //--------------------------------------------------------------------------
    //  Private Methods
    //--------------------------------------------------------------------------
    setFooter(expanded) {
        var footerButton_node = document.getElementById(elementIDs.footer_buttonID);
        var footerModal_node = document.getElementById(elementIDs.footerModalID);
        var self = this;
        if (footerButton_node && footerModal_node) {
            footerButton_node.addEventListener('keydown', function (e) {
                let isEscapePressed = e.key === 'Escape' || e.keyCode === 27;
                if (!isEscapePressed) {
                    return;
                }
                else {
                    if (_expanded === true) {
                        _expanded = self.toggleFooter(true);
                        // console.log(`Element (${siteMenu_node.id}) is within viewport.`);
                    }
                    else {
                        return;
                        // console.log(`Element (${siteMenu_node.id}) is NOT within viewport.`);
                    }
                }
            });
        }
        if (footerModal_node) {
            footerModal_node.addEventListener('keydown', function (e) {
                let isEscapePressed = e.key === 'Escape' || e.keyCode === 27;
                if (!isEscapePressed) {
                    return;
                }
                else {
                    _expanded = self.toggleFooter(true);
                }
            });
        }
        _expanded = this.toggleFooter(expanded);
    }
    _createReactLinks(linksArray, linkLineDivClass = null, linkDivClass = null, anchorClass = null) {
        var _links = linksArray.map(links => tsx("div", { class: linkLineDivClass }, links.map(link => tsx("div", { class: linkDivClass },
            tsx("a", { id: link.id, class: anchorClass, href: link.url, target: link.target, title: link.title, tabindex: '0' }, link.title)))));
        return _links;
    }
    _modifyDOMLinks(linksArray, targetID, linkLineDivClass = null, linkDivClass = null, anchorClass = null) {
        let div_node = document.getElementById(targetID);
        let _anchors = div_node?.getElementsByTagName('a');
        // Re-build the existing link list using the DOM
        linksArray.map(links => {
            links.map(link => {
                var _a = null;
                for (let i = 0; i < _anchors.length; i++) {
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
    _footerButton_click(e) {
        e.preventDefault(); // Prevent the default keypress action, i.e. space = scroll
        _expanded = this.toggleFooter(_expanded);
        // console.log(`Footer is ${_expanded}`);
    }
    _footerButton_keypress(e) {
        let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
        let isSpacePressed = e.key === 'Space' || e.keyCode === 32;
        if (isEnterPressed || isSpacePressed) {
            e.preventDefault(); // Prevent the default keypress action, i.e. space = scroll
            _expanded = this.toggleFooter(_expanded);
            // console.log(`Footer is ${_expanded}`);
        }
    }
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    toggleFooter(expanded) {
        var isExpanded = false;
        var footerModal_node = document.getElementById(elementIDs.footerModalID);
        var footer_node = document.getElementById(elementIDs.footerID);
        var footerButton_node = document.getElementById(elementIDs.footer_buttonID);
        if (footerButton_node) {
            var footerIcon_node = document.getElementById(elementIDs.footer_button_iconID);
            var footerHeight = footer_node.clientHeight;
            if (typeof expanded === "object") {
                footerButton_node.title = t9n.button.label;
                footerButton_node.setAttribute('aria-label', t9n.button.label);
                footer_node.setAttribute('style', `transform: translate(0px, ${footerHeight}px);`);
                footerModal_node.classList.remove(css_theme.default.widget_footer_modal);
                footerIcon_node.classList.add(css_esri.esri_icon_expand);
                footerIcon_node.classList.add(css_esri.esri_expand_icon_expanded);
                footerIcon_node.classList.remove(css_esri.esri_icon_collapse);
                footerIcon_node.classList.remove(css_esri.esri_collapse_icon);
                footer_node.classList.remove(css_theme.default.widget_footer_box_shadow);
                if (this.afterFooterCloseFocusElement) {
                    if (typeof this.afterFooterCloseFocusElement === "string") {
                        getFocusableElements(document.getElementById(this.afterFooterCloseFocusElement));
                    }
                    else {
                        getFocusableElements(this.afterFooterCloseFocusElement);
                    }
                }
            }
            else {
                if (expanded === false) {
                    footerButton_node.title = t9n.button.collapselabel;
                    footerButton_node.setAttribute('aria-label', t9n.button.collapselabel);
                    footer_node.setAttribute('style', `transform: translate(0px, 0px);`);
                    footerModal_node.classList.add(css_theme.default.widget_footer_modal);
                    footer_node.classList.add(css_theme.default.widget_footer_box_shadow);
                    footerIcon_node.classList.remove(css_esri.esri_icon_expand);
                    footerIcon_node.classList.remove(css_esri.esri_expand_icon_expanded);
                    footerIcon_node.classList.add(css_esri.esri_icon_collapse);
                    footerIcon_node.classList.add(css_esri.esri_collapse_icon);
                    isExpanded = true;
                    // elementIDs.sitemenuID is actually off page.
                    getFocusableElements(footer_node, null, false, `button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`);
                }
                else {
                    footerButton_node.title = t9n.button.label;
                    footerButton_node.setAttribute('aria-label', t9n.button.label);
                    footer_node.setAttribute('style', `transform: translate(0px, ${footerHeight}px);`);
                    footerModal_node.classList.remove(css_theme.default.widget_footer_modal);
                    footer_node.classList.remove(css_theme.default.widget_footer_box_shadow);
                    footerIcon_node.classList.add(css_esri.esri_icon_expand);
                    footerIcon_node.classList.add(css_esri.esri_expand_icon_expanded);
                    footerIcon_node.classList.remove(css_esri.esri_icon_collapse);
                    footerIcon_node.classList.remove(css_esri.esri_collapse_icon);
                    if (this.afterFooterCloseFocusElement) {
                        if (typeof this.afterFooterCloseFocusElement === "string") {
                            getFocusableElements(document.getElementById(this.afterFooterCloseFocusElement));
                        }
                        else {
                            getFocusableElements(this.afterFooterCloseFocusElement);
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
], Footer.prototype, "afterFooterCloseFocusElement", void 0);
__decorate([
    property()
], Footer.prototype, "theme", void 0);
__decorate([
    property()
], Footer.prototype, "locale", void 0);
__decorate([
    property()
], Footer.prototype, "title", void 0);
__decorate([
    property()
], Footer.prototype, "bodytext", void 0);
__decorate([
    property()
], Footer.prototype, "links", void 0);
__decorate([
    property()
], Footer.prototype, "copyright", void 0);
Footer = __decorate([
    subclass("dnrr.forestry.widgets.footer")
], Footer);
export default Footer;
//# sourceMappingURL=Footer.js.map