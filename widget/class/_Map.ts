// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';

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
