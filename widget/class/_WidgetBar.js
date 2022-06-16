import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
export class wbwObject {
    constructor(wbWidget, fireEvent = true) {
        this.wbWidget = wbWidget;
        this.fireEvent = fireEvent;
    }
}
__decorate([
    property()
], wbwObject.prototype, "wbWidget", void 0);
__decorate([
    property()
], wbwObject.prototype, "fireEvent", void 0);
let WidgetBarWidget = class WidgetBarWidget extends Accessor {
};
__decorate([
    property()
], WidgetBarWidget.prototype, "id", void 0);
__decorate([
    property()
], WidgetBarWidget.prototype, "visible", void 0);
__decorate([
    property()
], WidgetBarWidget.prototype, "config", void 0);
__decorate([
    property()
], WidgetBarWidget.prototype, "t9nPath", void 0);
__decorate([
    property()
], WidgetBarWidget.prototype, "expanded", void 0);
__decorate([
    property()
], WidgetBarWidget.prototype, "group", void 0);
WidgetBarWidget = __decorate([
    subclass('WidgetBarClasses.WidgetBarWidget')
], WidgetBarWidget);
export { WidgetBarWidget };
let BookmarksWidget = class BookmarksWidget extends WidgetBarWidget {
};
__decorate([
    property()
], BookmarksWidget.prototype, "editingEnabled", void 0);
__decorate([
    property()
], BookmarksWidget.prototype, "defaultCreateOptions", void 0);
__decorate([
    property()
], BookmarksWidget.prototype, "bookmarks", void 0);
BookmarksWidget = __decorate([
    subclass('WidgetBarClasses.BookmarksWidget')
], BookmarksWidget);
export { BookmarksWidget };
let BasemapGalleryWidget = class BasemapGalleryWidget extends WidgetBarWidget {
};
__decorate([
    property()
], BasemapGalleryWidget.prototype, "basemapSourcePortal", void 0);
BasemapGalleryWidget = __decorate([
    subclass('WidgetBarClasses.BasemapGalleryWidget')
], BasemapGalleryWidget);
export { BasemapGalleryWidget };
let MeasurementWidget = class MeasurementWidget extends WidgetBarWidget {
};
__decorate([
    property()
], MeasurementWidget.prototype, "measurement_map_location", void 0);
__decorate([
    property()
], MeasurementWidget.prototype, "measurement_index_position", void 0);
MeasurementWidget = __decorate([
    subclass('WidgetBarClasses.MeasurementWidget')
], MeasurementWidget);
export { MeasurementWidget };
let SketchWidget = class SketchWidget extends WidgetBarWidget {
};
__decorate([
    property()
], SketchWidget.prototype, "mode", void 0);
SketchWidget = __decorate([
    subclass('WidgetBarClasses.SketchWidget')
], SketchWidget);
export { SketchWidget };
let PrintWidget = class PrintWidget extends WidgetBarWidget {
};
__decorate([
    property()
], PrintWidget.prototype, "printServiceURL", void 0);
PrintWidget = __decorate([
    subclass('WidgetBarClasses.PrintWidget')
], PrintWidget);
export { PrintWidget };
let SupportWidget = class SupportWidget extends WidgetBarWidget {
};
__decorate([
    property()
], SupportWidget.prototype, "serviceURL", void 0);
__decorate([
    property()
], SupportWidget.prototype, "privateKey", void 0);
SupportWidget = __decorate([
    subclass('WidgetBarClasses.SupportWidget')
], SupportWidget);
export { SupportWidget };
let ButtonWidget = class ButtonWidget extends WidgetBarWidget {
};
__decorate([
    property()
], ButtonWidget.prototype, "content", void 0);
__decorate([
    property()
], ButtonWidget.prototype, "iconClass", void 0);
__decorate([
    property()
], ButtonWidget.prototype, "toolTip", void 0);
ButtonWidget = __decorate([
    subclass('WidgetBarClasses.ButtonWidget')
], ButtonWidget);
export { ButtonWidget };
let _Bookmark = class _Bookmark extends Accessor {
};
__decorate([
    property()
], _Bookmark.prototype, "id", void 0);
__decorate([
    property()
], _Bookmark.prototype, "label", void 0);
__decorate([
    property()
], _Bookmark.prototype, "thumbnailURL", void 0);
__decorate([
    property()
], _Bookmark.prototype, "centroid", void 0);
__decorate([
    property()
], _Bookmark.prototype, "scale", void 0);
__decorate([
    property()
], _Bookmark.prototype, "spatialreference", void 0);
_Bookmark = __decorate([
    subclass('WidgetBarClasses._Bookmark')
], _Bookmark);
export { _Bookmark };
let BookmarkLabel = class BookmarkLabel {
};
__decorate([
    property()
], BookmarkLabel.prototype, "en", void 0);
__decorate([
    property()
], BookmarkLabel.prototype, "fr", void 0);
BookmarkLabel = __decorate([
    subclass('WidgetBarClasses.BookmarkLabel')
], BookmarkLabel);
export { BookmarkLabel };
let Centroid = class Centroid {
};
__decorate([
    property()
], Centroid.prototype, "x", void 0);
__decorate([
    property()
], Centroid.prototype, "y", void 0);
Centroid = __decorate([
    subclass('WidgetBarClasses.Centroid')
], Centroid);
export { Centroid };
let DefaultCreateOptions = class DefaultCreateOptions {
};
__decorate([
    property()
], DefaultCreateOptions.prototype, "takeScreenshot", void 0);
__decorate([
    property()
], DefaultCreateOptions.prototype, "captureViewpoint", void 0);
__decorate([
    property()
], DefaultCreateOptions.prototype, "screenshotSettings", void 0);
DefaultCreateOptions = __decorate([
    subclass('WidgetBarClasses.DefaultCreateOptions')
], DefaultCreateOptions);
export { DefaultCreateOptions };
let ScreenshotSettings = class ScreenshotSettings {
};
__decorate([
    property()
], ScreenshotSettings.prototype, "width", void 0);
__decorate([
    property()
], ScreenshotSettings.prototype, "height", void 0);
ScreenshotSettings = __decorate([
    subclass('WidgetBarClasses.ScreenshotSettings')
], ScreenshotSettings);
export { ScreenshotSettings };
let WidgetBarWidgetLocale = class WidgetBarWidgetLocale {
};
__decorate([
    property()
], WidgetBarWidgetLocale.prototype, "id", void 0);
__decorate([
    property()
], WidgetBarWidgetLocale.prototype, "label", void 0);
WidgetBarWidgetLocale = __decorate([
    subclass('WidgetBarClasses.WidgetBarWidgetLocale')
], WidgetBarWidgetLocale);
export { WidgetBarWidgetLocale };
//# sourceMappingURL=_WidgetBar.js.map