// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import Widget from "@arcgis/core/widgets/Widget";
import Expand from "@arcgis/core/widgets/Expand";
import Button from "../button/Button";

export class wbwObject {
    constructor(wbWidget: Expand|Button, fireEvent = true as boolean) {
        this.wbWidget = wbWidget;
        this.fireEvent = fireEvent;
    }

    @property()
    wbWidget!: Expand|Button;

    @property()
    fireEvent!: boolean;
}

@subclass('WidgetBarClasses.WidgetBarWidget')
export class WidgetBarWidget extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    id!: string;

    @property()
    visible!: boolean|null;

    @property()
    config!: string|null;

    @property()
    t9nPath!: string|null;

    @property()
    expanded!: boolean|null;

    @property()
    group!: string|null;

}

@subclass('WidgetBarClasses.BookmarksWidget')
export class BookmarksWidget extends WidgetBarWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    editingEnabled!: boolean;

    @property()
    defaultCreateOptions!: DefaultCreateOptions;

    @property()
    bookmarks!: Array<_Bookmark>;
}

@subclass('WidgetBarClasses.BasemapGalleryWidget')
export class BasemapGalleryWidget extends WidgetBarWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    basemapSourcePortal!: string;
}

@subclass('WidgetBarClasses.SketchWidget')
export class SketchWidget extends WidgetBarWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    mode!: string;
}

@subclass('WidgetBarClasses.PrintWidget')
export class PrintWidget extends WidgetBarWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    printServiceURL!: string;
}

@subclass('WidgetBarClasses.SupportWidget')
export class SupportWidget extends WidgetBarWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    serviceURL!: string;

    @property()
    privateKey!: string;
}

@subclass('WidgetBarClasses.ButtonWidget')
export class ButtonWidget extends WidgetBarWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    content!: string|Widget|Node;

    @property()
    iconClass!: string;

    @property()
    toolTip!: string;
  }

@subclass('WidgetBarClasses._Bookmark')
export class _Bookmark extends Accessor {
    @property()
    id!: string;

    @property()
    label!: BookmarkLabel;

    @property()
    thumbnailURL!: string;

    @property()
    centroid!: Centroid;

    @property()
    scale!: number;

    @property()
    spatialreference!: SpatialReference;

}

@subclass('WidgetBarClasses.BookmarkLabel')
export class BookmarkLabel {
    @property()
    en!: string;

    @property()
    fr!: string;

}

@subclass('WidgetBarClasses.Centroid')
export class Centroid {
    @property()
    x!: number;

    @property()
    y!: number;

}

@subclass('WidgetBarClasses.DefaultCreateOptions')
export class DefaultCreateOptions {
    @property()
    takeScreenshot!: boolean;

    @property()
    captureViewpoint!: boolean;

    @property()
    screenshotSettings!: ScreenshotSettings;

}

@subclass('WidgetBarClasses.ScreenshotSettings')
export class ScreenshotSettings {
    @property()
    width!: number;

    @property()
    height!: number;

}

@subclass('WidgetBarClasses.WidgetBarWidgetLocale')
export class WidgetBarWidgetLocale {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    id!: string;

    @property()
    label!: string;

}

