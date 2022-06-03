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