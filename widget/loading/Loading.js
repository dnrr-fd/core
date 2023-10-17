import { __decorate } from "tslib";
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import * as intl from "@arcgis/core/intl";
import { getWidgetTheme } from '@dnrr_fd/util/web';
// Import Assets
/* https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module */
import * as css from './assets/css/loading.module.css';
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
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
let Loading = class Loading extends Widget {
    constructor(params) {
        super(params);
    }
    //----------------------------------
    //  Properties
    //----------------------------------
    theme;
    image;
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    postInitialize() {
        this.label = t9n.title;
        this.theme = getWidgetTheme(elementIDs.esriThemeID);
        intl.onLocaleChange(function (locale) {
            t9n = (locale === 'fr' ? t9n_fr : t9n_en);
        });
    }
    render() {
        return (tsx("div", { id: elementIDs.loadingModalID, className: this.classes(css.default.widget_loading, css_esri.esri_widget) },
            tsx("div", { id: elementIDs.loadingContentID, className: css.default.widget_loading_content },
                tsx("div", { className: css.default.widget_loading_img__div },
                    tsx("img", { src: this.image.src, title: t9n.title, alt: t9n.alt, className: css.default.widget_loading_img, height: `${this.image.height.toString()}px` })))));
    }
};
__decorate([
    property()
], Loading.prototype, "theme", void 0);
__decorate([
    property()
], Loading.prototype, "image", void 0);
Loading = __decorate([
    subclass("dnrr.forestry.widgets.loading")
], Loading);
export default Loading;
//# sourceMappingURL=Loading.js.map