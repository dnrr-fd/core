// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
import Extent from "@arcgis/core/geometry/Extent";
import Expand from "@arcgis/core/widgets/Expand";
import Widget from "@arcgis/core/widgets/Widget";
import CookiesButton from "../cookies/button/CookiesButton";
import ScaleBar from "@arcgis/core/widgets/ScaleBar";
import Search from "@arcgis/core/widgets/Search";
import Cookies from "../cookies/Cookies";
import CoordinateConversion from "@arcgis/core/widgets/CoordinateConversion";
import Home from "@arcgis/core/widgets/Home";
import Zoom from "@arcgis/core/widgets/Zoom";
import ExtentNavigator from "../extentnavigator/ExtentNavigator";
import Locate from "@arcgis/core/widgets/Locate";
import Fullscreen from "@arcgis/core/widgets/Fullscreen";
import { CookiesVM } from "../class/_Cookie";

export class WebObject {
  constructor(
    type: "email"|"url",
    value: string,
  ) {
      this.type = type;
      this.value = value;
  }

  @property()
  type!: "email"|"url";

  @property()
  value!: string;
}

export class WebUrlObject {
  constructor(
    type: "url",
    value: string,
  ) {
      this.type = type;
      this.value = value;
  }

  @property()
  type!: "url";

  @property()
  value!: string;
}

export class mwObject {
  constructor(mWidget: Expand|CookiesButton|Search|Cookies|ScaleBar|CoordinateConversion|Home|Zoom|ExtentNavigator|Locate|Fullscreen|Widget, fireEvent = true as boolean) {
      this.mWidget = mWidget;
      this.fireEvent = fireEvent;
  }

  @property()
  mWidget!: Expand|CookiesButton|Search|Cookies|ScaleBar|CoordinateConversion|Home|Zoom|ExtentNavigator|Locate|Fullscreen|Widget;

  @property()
  fireEvent!: boolean;
}

@subclass('MapClasses.MapWidget')
export class MapWidget extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    id!: string;

    @property()
    visible!: boolean;

    @property()
    map_location!: "top-right"|"top-left"|"botton-right"|"bottom-left";

    @property()
    index_position!: number;

    @property()
    config!: string|null;

    @property()
    t9nPath!: string|null;
}

@subclass('MapClasses.CookiesWidget')
export class CookiesWidget extends MapWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    expanded!: boolean|null;

    @property()
    visible!: boolean;

    @property()
    privacyPolicy!: WebUrlObject;

    @property()
    contactUs!: WebObject;

    @property()
    position!: "top"|"bottom";

    @property()
    cookies!: Array<CookiesVM>;

}

@subclass('MapClasses.ExtentNavigationWidget')
export class ExtentNavigationWidget extends MapWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    horizontal_align_buttons!: boolean;

}

@subclass('MapClasses.ScaleBarWidget')
export class ScaleBarWidget extends MapWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    unit!: "non-metric"|"metric"|"dual";

    @property()
    style!: "ruler"|"line";

}

@subclass('MapClasses.LayerListWidget')
export class LayerListWidget extends MapWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    expanded!: string|null;

    @property()
    group!: string|null;

}

@subclass('MapClasses.AdvancedSearchWidget')
export class AdvancedSearchWidget extends MapWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    expanded!: boolean|null;

    @property()
    advancedSearchContainer!: string|null;

    @property()
    rootFocusElement!: string|null;

  }

export class SearchWidgetSource {
  constructor(
    id: string,
    url: string,
    searchFields: Array<string>,
    outFields: Array<string>,
    exactMatch: boolean,
    maxResults: number,
    maxSuggestions: number
  ) {
      this.id = id;
      this.url = url;
      this.searchFields = searchFields;
      this.outFields = outFields;
      this.exactMatch = exactMatch;
      this.maxResults = maxResults;
      this.maxSuggestions = maxSuggestions;
  }

  @property()
  id!: string;

  @property()
  url!: string;

  @property()
  searchFields!: Array<string>;

  @property()
  outFields!: Array<string>;

  @property()
  exactMatch!: boolean;

  @property()
  maxResults: number;

  @property()
  maxSuggestions: number;
}
export class SearchWidgetSourceT9n {
  constructor(
    id: string,
    label: string,
    placeholder: string,
    popuptemplatetitle: string,
    suggestionTemplate: string
  ) {
      this.id = id;
      this.label = label;
      this.placeholder = placeholder;
      this.popuptemplatetitle = popuptemplatetitle;
      this.suggestionTemplate = suggestionTemplate;
  }

  @property()
  id!: string;

  @property()
  label!: string;

  @property()
  placeholder!: string;

  @property()
  popuptemplatetitle!: string;

  @property()
  suggestionTemplate!: string;
}

export class CookiesWidgetSourceT9n {
  constructor(
    id: string,
    label: string,
  ) {
      this.id = id;
      this.label = label;
  }

  @property()
  id!: string;

  @property()
  label!: string;
}

@subclass('MapClasses.SearchWidget')
export class SearchWidget extends MapWidget {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    sources!: Array<SearchWidgetSource>|null;
}

@subclass('MapClasses.MapWidgetLocale')
export class MapWidgetLocale {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    id!: string;

    @property()
    label!: string;

}

@subclass('MapClasses.MapWidgetSearch')
export class MapWidgetSearch {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    id!: string;

    @property()
    label!: string;

    @property()
    allPlaceholder!: string;

    @property()
    sources!: Array<SearchWidgetSourceT9n>;

}

@subclass('MapClasses.MapWidgetCookies')
export class MapWidgetCookies {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    id!: string;

    @property()
    label!: string;

    @property()
    allPlaceholder!: string;

    @property()
    cookies!: Array<CookiesWidgetSourceT9n>;

}

@subclass('MapClasses.MapConfig')
export class SearchConfig extends Accessor {
  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  id!: string;

  @property()
  version!: number;

  @property()
  visible!: boolean;

  @property()
  sources!: Array<SearchWidgetSource>|null;
}

@subclass('MapClasses.MapConfig')
export class MapConfig extends Accessor {
  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  id!: string;

  @property()
  visible!: boolean;

  @property()
  portalUrl!: string;

  @property()
  apiKey!: string;

  @property()
  popupLocation!: "top-right"|"top-left"|"botton-right"|"bottom-left";

  @property()
  highlightOptions!: {
    fillOpacity: number,
    color: [number, number, number]
  };

  @property()
  defaultWidgets!: Array<string>;

  @property()
  widgets!: Array<MapWidget>;
}

@subclass('MapClasses.MapExtentObject')
export class MapExtentObject extends Accessor {
  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  extent!: Extent;

  @property()
  scale!: number;

  toString() {
    return stringifyMapExtentObject(this);
  }
}

export function stringifyMapExtentObject(meo: MapExtentObject) {
  if (meo) {
    return (
`xmin: ${(Math.round(meo.extent.xmin * 100) / 100).toFixed(4)},
ymin: ${(Math.round(meo.extent.ymin * 100) / 100).toFixed(4)},
xmax: ${(Math.round(meo.extent.xmax * 100) / 100).toFixed(4)},
ymax: ${(Math.round(meo.extent.ymax * 100) / 100).toFixed(4)},
spatialReference: ${meo.extent.spatialReference.wkid},
scale: ${(Math.round(meo.scale * 100) / 100).toFixed(0)}`
    );
  }
  return "";
}
