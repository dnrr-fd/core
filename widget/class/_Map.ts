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
