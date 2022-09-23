import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
let MapWidget = class MapWidget extends Accessor {
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
let ScaleBarWidget = class ScaleBarWidget extends MapWidget {
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
let SearchWidget = class SearchWidget extends MapWidget {
};
__decorate([
    property()
], SearchWidget.prototype, "sources", void 0);
SearchWidget = __decorate([
    subclass('MapClasses.SearchWidget')
], SearchWidget);
export { SearchWidget };
let MapWidgetLocale = class MapWidgetLocale {
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
let SearchConfig = class SearchConfig extends Accessor {
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
//# sourceMappingURL=_Map.js.map