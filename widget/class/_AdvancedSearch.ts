// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Accessor from '@arcgis/core/core/Accessor';

@subclass('AdvancedSearchClasses.T9nObject')
export class OrderedLayerOrderBy extends Accessor {
  constructor(field: string, valueExpression: string, order="ascending" as "descending"|"ascending") {
    super();
    this.field = field;
    this.valueExpression = valueExpression;
    this.order = order;
}

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  field!: string;

  @property()
  valueExpression!: string;

  @property()
  order!: "descending"|"ascending";

}

interface SelectObjectParams extends __esri.WidgetProperties {
  fieldID: string;
  fieldType: "string"|"number";
  sqlText: string;
  operator: "AND"|"OR";
  options: Array<tsx.JSX.Element>;
  required: boolean;
}

@subclass('AdvancedSearchClasses.SelectObject')
export class SelectObject extends Accessor {
  constructor(params?: SelectObjectParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  fieldID!: string;

  @property()
  fieldType!: "string"|"number";

  @property()
  sqlText!: string;

  @property()
  operator!: "AND"|"OR";

  @property()
  options!: Array<tsx.JSX.Element>;

  @property()
  required!: boolean;
}

interface FeatureLayerReferencesParams extends __esri.WidgetProperties {
  layerID: string;
  relatedLayerIDs: Array<string>;
}

@subclass('AdvancedSearchClasses.FeatureLayerReferences')
export class FeatureLayerReferences extends Accessor {
  constructor(params?: FeatureLayerReferencesParams) {
    super(params);
  }

  toString() {
    return `${this.layerID}: [${this.relatedLayerIDs}]`;
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  layerID!: string;

  @property()
  relatedLayerIDs!: Array<string>;

}

interface SearchFieldSelectObjectsParams extends __esri.WidgetProperties {
  layerID: string;
  selectObjects: Array<SelectObject>;
}

@subclass('AdvancedSearchClasses.SearchFieldSelectObjects')
export class SearchFieldSelectObjects extends Accessor {
  constructor(params?: SearchFieldSelectObjectsParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  layerID!: string;

  @property()
  selectObjects!: Array<SelectObject>;

}

interface SearchFieldSelectObjectsParams extends __esri.WidgetProperties {
  en?: string;
  fr?: string;
}

@subclass('AdvancedSearchClasses.T9nObject')
export class T9nObject extends Accessor {
  constructor(params?: SearchFieldSelectObjectsParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  en!: string;

  @property()
  fr!: string;

}

interface DisplayFieldParams extends __esri.WidgetProperties {
  name?: string;
  alias?: string;
}

@subclass('AdvancedSearchClasses.T9nObject')
export class DisplayField extends Accessor {
  constructor(params?: DisplayFieldParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  name!: string;

  @property()
  alias!: string;

}

@subclass('AdvancedSearchClasses.GraphicalSearchOptions')
export class GraphicalSearchOptions extends Accessor {
  constructor(enablepointselect=true as boolean, enablelineselect=true as boolean, enablepolylineselect=true as boolean, enableextentselect=true as boolean, enablecircleselect=true as boolean, enablepolyselect=true as boolean, selectiontolerance=6 as number) {
    super();
    this.enablepointselect = enablepointselect;
    this.enablelineselect = enablelineselect;
    this.enablepolylineselect = enablepolylineselect;
    this.enableextentselect = enableextentselect;
    this.enablecircleselect = enablecircleselect;
    this.enablepolyselect = enablepolyselect;
    this.selectiontolerance = selectiontolerance;
}

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  enablepointselect!: boolean;

  @property()
  enablelineselect!: boolean;

  @property()
  enablepolylineselect!: boolean;

  @property()
  enableextentselect!: boolean;

  @property()
  enablecircleselect!: boolean;

  @property()
  enablepolyselect!: boolean;

  @property()
  selectiontolerance!: number;

}

@subclass('AdvancedSearchClasses.AdvancedSearchObject')
export class AdvancedSearchObject extends Accessor {
  constructor(layers=undefined as Array<AdvancedSearchLayer>|undefined, addMissingSearchLayers=false as boolean, zoomtosearchresults=true as boolean, graphicalsearchoptions=new GraphicalSearchOptions()) {
    super();
    this.layers = layers;
    this.addMissingSearchLayers = addMissingSearchLayers;
    this.zoomtosearchresults = zoomtosearchresults;
    this.graphicalsearchoptions = graphicalsearchoptions;
}

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  layers!: Array<AdvancedSearchLayer>|undefined;

  @property()
  addMissingSearchLayers!: boolean;

  @property()
  zoomtosearchresults!: boolean;

  @property()
  graphicalsearchoptions!: GraphicalSearchOptions;

}

interface AdvancedSearchFieldParams extends __esri.WidgetProperties {
  field?: string;
  fieldlabel?: OrderedLayerOrderBy;
  fieldtype: "number"|"string";
  defaultvalue?: number|string;
  searchhint?: string;
  sqltext?: string;
  operator?: "AND"|"OR";
  userlist?: Array<string>;
  usedistinctvalues?: boolean;
  required?: boolean;
}

@subclass('AdvancedSearchClasses.AdvancedSearchFields')
export class AdvancedSearchField extends Accessor {
  constructor(params?: AdvancedSearchFieldParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  field!: string;

  @property()
  fieldlabel!: OrderedLayerOrderBy;

  @property()
  fieldtype!: "number"|"string";

  @property()
  defaultvalue!: number|string;

  @property()
  searchhint!: string;

  @property()
  sqltext!: string;

  @property()
  operator!: "AND"|"OR";

  @property()
  userlist!: Array<string>;

  @property()
  usedistinctvalues!: boolean;

  @property()
  required!: boolean;

}

interface AdvancedSearchLayerParams extends __esri.WidgetProperties {
  id?: string;
  url?: string;
  searchlayerlabel?: OrderedLayerOrderBy;
  searchlayertitletext?: OrderedLayerOrderBy;
  searchfields?: Array<AdvancedSearchField>;
  displayfields?: Array<DisplayField>;
  orderbyfields?: Array<OrderedLayerOrderBy>;
}

@subclass('AdvancedSearchClasses.AdvancedSearchLayer')
export class AdvancedSearchLayer extends Accessor {
  constructor(params?: AdvancedSearchLayerParams) {
    super(params);
  }

  //----------------------------------
  //  Properties
  //----------------------------------
  @property()
  id!: string;

  @property()
  url!: string;

  @property()
  zoomscale!: number;

  @property()
  searchlayerlabel!: OrderedLayerOrderBy;

  @property()
  searchlayertitletext!: OrderedLayerOrderBy;

  @property()
  searchfields!: Array<AdvancedSearchField>;

  @property()
  displayfields!: Array<DisplayField>;

  @property()
  orderbyfields!: Array<OrderedLayerOrderBy>;
}
