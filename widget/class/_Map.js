import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
export class WebObject {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    type;
    value;
}
__decorate([
    property()
], WebObject.prototype, "type", void 0);
__decorate([
    property()
], WebObject.prototype, "value", void 0);
export class WebUrlObject {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
    type;
    value;
}
__decorate([
    property()
], WebUrlObject.prototype, "type", void 0);
__decorate([
    property()
], WebUrlObject.prototype, "value", void 0);
export class mwObject {
    constructor(mWidget, fireEvent = true) {
        this.mWidget = mWidget;
        this.fireEvent = fireEvent;
    }
    mWidget;
    fireEvent;
}
__decorate([
    property()
], mwObject.prototype, "mWidget", void 0);
__decorate([
    property()
], mwObject.prototype, "fireEvent", void 0);
let MapWidget = class MapWidget extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    id;
    visible;
    map_location;
    index_position;
    config;
    t9nPath;
};
__decorate([
    property()
], MapWidget.prototype, "id", void 0);
__decorate([
    property()
], MapWidget.prototype, "visible", void 0);
__decorate([
    property()
], MapWidget.prototype, "map_location", void 0);
__decorate([
    property()
], MapWidget.prototype, "index_position", void 0);
__decorate([
    property()
], MapWidget.prototype, "config", void 0);
__decorate([
    property()
], MapWidget.prototype, "t9nPath", void 0);
MapWidget = __decorate([
    subclass('MapClasses.MapWidget')
], MapWidget);
export { MapWidget };
let CookiesWidget = class CookiesWidget extends MapWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    expanded;
    privacyPolicy;
    contactUs;
    position;
    cookies;
};
__decorate([
    property()
], CookiesWidget.prototype, "expanded", void 0);
__decorate([
    property()
], CookiesWidget.prototype, "privacyPolicy", void 0);
__decorate([
    property()
], CookiesWidget.prototype, "contactUs", void 0);
__decorate([
    property()
], CookiesWidget.prototype, "position", void 0);
__decorate([
    property()
], CookiesWidget.prototype, "cookies", void 0);
CookiesWidget = __decorate([
    subclass('MapClasses.CookiesWidget')
], CookiesWidget);
export { CookiesWidget };
let ExtentNavigationWidget = class ExtentNavigationWidget extends MapWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    horizontal_align_buttons;
};
__decorate([
    property()
], ExtentNavigationWidget.prototype, "horizontal_align_buttons", void 0);
ExtentNavigationWidget = __decorate([
    subclass('MapClasses.ExtentNavigationWidget')
], ExtentNavigationWidget);
export { ExtentNavigationWidget };
let ScaleBarWidget = class ScaleBarWidget extends MapWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    unit;
    style;
};
__decorate([
    property()
], ScaleBarWidget.prototype, "unit", void 0);
__decorate([
    property()
], ScaleBarWidget.prototype, "style", void 0);
ScaleBarWidget = __decorate([
    subclass('MapClasses.ScaleBarWidget')
], ScaleBarWidget);
export { ScaleBarWidget };
let LayerListWidget = class LayerListWidget extends MapWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    expanded;
    group;
};
__decorate([
    property()
], LayerListWidget.prototype, "expanded", void 0);
__decorate([
    property()
], LayerListWidget.prototype, "group", void 0);
LayerListWidget = __decorate([
    subclass('MapClasses.LayerListWidget')
], LayerListWidget);
export { LayerListWidget };
let AdvancedSearchWidget = class AdvancedSearchWidget extends MapWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    expanded;
    advancedSearchContainer;
    rootFocusElement;
};
__decorate([
    property()
], AdvancedSearchWidget.prototype, "expanded", void 0);
__decorate([
    property()
], AdvancedSearchWidget.prototype, "advancedSearchContainer", void 0);
__decorate([
    property()
], AdvancedSearchWidget.prototype, "rootFocusElement", void 0);
AdvancedSearchWidget = __decorate([
    subclass('MapClasses.AdvancedSearchWidget')
], AdvancedSearchWidget);
export { AdvancedSearchWidget };
export class SearchWidgetSource {
    constructor(id, url, searchFields, outFields, exactMatch, maxResults, maxSuggestions) {
        this.id = id;
        this.url = url;
        this.searchFields = searchFields;
        this.outFields = outFields;
        this.exactMatch = exactMatch;
        this.maxResults = maxResults;
        this.maxSuggestions = maxSuggestions;
    }
    id;
    url;
    searchFields;
    outFields;
    exactMatch;
    maxResults;
    maxSuggestions;
}
__decorate([
    property()
], SearchWidgetSource.prototype, "id", void 0);
__decorate([
    property()
], SearchWidgetSource.prototype, "url", void 0);
__decorate([
    property()
], SearchWidgetSource.prototype, "searchFields", void 0);
__decorate([
    property()
], SearchWidgetSource.prototype, "outFields", void 0);
__decorate([
    property()
], SearchWidgetSource.prototype, "exactMatch", void 0);
__decorate([
    property()
], SearchWidgetSource.prototype, "maxResults", void 0);
__decorate([
    property()
], SearchWidgetSource.prototype, "maxSuggestions", void 0);
export class SearchWidgetSourceT9n {
    constructor(id, label, placeholder, popuptemplatetitle, suggestionTemplate) {
        this.id = id;
        this.label = label;
        this.placeholder = placeholder;
        this.popuptemplatetitle = popuptemplatetitle;
        this.suggestionTemplate = suggestionTemplate;
    }
    id;
    label;
    placeholder;
    popuptemplatetitle;
    suggestionTemplate;
}
__decorate([
    property()
], SearchWidgetSourceT9n.prototype, "id", void 0);
__decorate([
    property()
], SearchWidgetSourceT9n.prototype, "label", void 0);
__decorate([
    property()
], SearchWidgetSourceT9n.prototype, "placeholder", void 0);
__decorate([
    property()
], SearchWidgetSourceT9n.prototype, "popuptemplatetitle", void 0);
__decorate([
    property()
], SearchWidgetSourceT9n.prototype, "suggestionTemplate", void 0);
export class CookiesWidgetSourceT9n {
    constructor(id, label) {
        this.id = id;
        this.label = label;
    }
    id;
    label;
}
__decorate([
    property()
], CookiesWidgetSourceT9n.prototype, "id", void 0);
__decorate([
    property()
], CookiesWidgetSourceT9n.prototype, "label", void 0);
let SearchWidget = class SearchWidget extends MapWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    sources;
};
__decorate([
    property()
], SearchWidget.prototype, "sources", void 0);
SearchWidget = __decorate([
    subclass('MapClasses.SearchWidget')
], SearchWidget);
export { SearchWidget };
let MapWidgetLocale = class MapWidgetLocale {
    //----------------------------------
    //  Properties
    //----------------------------------
    id;
    label;
};
__decorate([
    property()
], MapWidgetLocale.prototype, "id", void 0);
__decorate([
    property()
], MapWidgetLocale.prototype, "label", void 0);
MapWidgetLocale = __decorate([
    subclass('MapClasses.MapWidgetLocale')
], MapWidgetLocale);
export { MapWidgetLocale };
let MapWidgetSearch = class MapWidgetSearch {
    //----------------------------------
    //  Properties
    //----------------------------------
    id;
    label;
    allPlaceholder;
    sources;
};
__decorate([
    property()
], MapWidgetSearch.prototype, "id", void 0);
__decorate([
    property()
], MapWidgetSearch.prototype, "label", void 0);
__decorate([
    property()
], MapWidgetSearch.prototype, "allPlaceholder", void 0);
__decorate([
    property()
], MapWidgetSearch.prototype, "sources", void 0);
MapWidgetSearch = __decorate([
    subclass('MapClasses.MapWidgetSearch')
], MapWidgetSearch);
export { MapWidgetSearch };
let MapWidgetCookies = class MapWidgetCookies {
    //----------------------------------
    //  Properties
    //----------------------------------
    id;
    label;
    allPlaceholder;
    cookies;
};
__decorate([
    property()
], MapWidgetCookies.prototype, "id", void 0);
__decorate([
    property()
], MapWidgetCookies.prototype, "label", void 0);
__decorate([
    property()
], MapWidgetCookies.prototype, "allPlaceholder", void 0);
__decorate([
    property()
], MapWidgetCookies.prototype, "cookies", void 0);
MapWidgetCookies = __decorate([
    subclass('MapClasses.MapWidgetCookies')
], MapWidgetCookies);
export { MapWidgetCookies };
let SearchConfig = class SearchConfig extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    id;
    version;
    visible;
    sources;
};
__decorate([
    property()
], SearchConfig.prototype, "id", void 0);
__decorate([
    property()
], SearchConfig.prototype, "version", void 0);
__decorate([
    property()
], SearchConfig.prototype, "visible", void 0);
__decorate([
    property()
], SearchConfig.prototype, "sources", void 0);
SearchConfig = __decorate([
    subclass('MapClasses.MapConfig')
], SearchConfig);
export { SearchConfig };
let MapConfig = class MapConfig extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    id;
    visible;
    portalUrl;
    apiKey;
    popupLocation;
    highlightOptions;
    defaultWidgets;
    widgets;
};
__decorate([
    property()
], MapConfig.prototype, "id", void 0);
__decorate([
    property()
], MapConfig.prototype, "visible", void 0);
__decorate([
    property()
], MapConfig.prototype, "portalUrl", void 0);
__decorate([
    property()
], MapConfig.prototype, "apiKey", void 0);
__decorate([
    property()
], MapConfig.prototype, "popupLocation", void 0);
__decorate([
    property()
], MapConfig.prototype, "highlightOptions", void 0);
__decorate([
    property()
], MapConfig.prototype, "defaultWidgets", void 0);
__decorate([
    property()
], MapConfig.prototype, "widgets", void 0);
MapConfig = __decorate([
    subclass('MapClasses.MapConfig')
], MapConfig);
export { MapConfig };
let MapExtentObject = class MapExtentObject extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    extent;
    scale;
    toString() {
        return stringifyMapExtentObject(this);
    }
};
__decorate([
    property()
], MapExtentObject.prototype, "extent", void 0);
__decorate([
    property()
], MapExtentObject.prototype, "scale", void 0);
MapExtentObject = __decorate([
    subclass('MapClasses.MapExtentObject')
], MapExtentObject);
export { MapExtentObject };
export function stringifyMapExtentObject(meo) {
    if (meo) {
        return (`xmin: ${(Math.round(meo.extent.xmin * 100) / 100).toFixed(4)},
ymin: ${(Math.round(meo.extent.ymin * 100) / 100).toFixed(4)},
xmax: ${(Math.round(meo.extent.xmax * 100) / 100).toFixed(4)},
ymax: ${(Math.round(meo.extent.ymax * 100) / 100).toFixed(4)},
spatialReference: ${meo.extent.spatialReference.wkid},
scale: ${(Math.round(meo.scale * 100) / 100).toFixed(0)}`);
    }
    return "";
}
//# sourceMappingURL=_Map.js.map