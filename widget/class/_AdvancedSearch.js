import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
let OrderedLayerOrderBy = class OrderedLayerOrderBy extends Accessor {
    constructor(field, valueExpression, order = "ascending") {
        super();
        this.field = field;
        this.valueExpression = valueExpression;
        this.order = order;
    }
};
__decorate([
    property()
], OrderedLayerOrderBy.prototype, "field", void 0);
__decorate([
    property()
], OrderedLayerOrderBy.prototype, "valueExpression", void 0);
__decorate([
    property()
], OrderedLayerOrderBy.prototype, "order", void 0);
OrderedLayerOrderBy = __decorate([
    subclass('AdvancedSearchClasses.T9nObject')
], OrderedLayerOrderBy);
export { OrderedLayerOrderBy };
let SelectObject = class SelectObject extends Accessor {
    constructor(params) {
        super(params);
    }
};
__decorate([
    property()
], SelectObject.prototype, "fieldID", void 0);
__decorate([
    property()
], SelectObject.prototype, "fieldType", void 0);
__decorate([
    property()
], SelectObject.prototype, "sqlText", void 0);
__decorate([
    property()
], SelectObject.prototype, "operator", void 0);
__decorate([
    property()
], SelectObject.prototype, "options", void 0);
__decorate([
    property()
], SelectObject.prototype, "required", void 0);
SelectObject = __decorate([
    subclass('AdvancedSearchClasses.SelectObject')
], SelectObject);
export { SelectObject };
let FeatureLayerReferences = class FeatureLayerReferences extends Accessor {
    constructor(params) {
        super(params);
    }
    toString() {
        return `${this.layerID}: [${this.relatedLayerIDs}]`;
    }
};
__decorate([
    property()
], FeatureLayerReferences.prototype, "layerID", void 0);
__decorate([
    property()
], FeatureLayerReferences.prototype, "relatedLayerIDs", void 0);
FeatureLayerReferences = __decorate([
    subclass('AdvancedSearchClasses.FeatureLayerReferences')
], FeatureLayerReferences);
export { FeatureLayerReferences };
let SearchFieldSelectObjects = class SearchFieldSelectObjects extends Accessor {
    constructor(params) {
        super(params);
    }
};
__decorate([
    property()
], SearchFieldSelectObjects.prototype, "layerID", void 0);
__decorate([
    property()
], SearchFieldSelectObjects.prototype, "selectObjects", void 0);
SearchFieldSelectObjects = __decorate([
    subclass('AdvancedSearchClasses.SearchFieldSelectObjects')
], SearchFieldSelectObjects);
export { SearchFieldSelectObjects };
let T9nObject = class T9nObject extends Accessor {
    constructor(params) {
        super(params);
    }
};
__decorate([
    property()
], T9nObject.prototype, "en", void 0);
__decorate([
    property()
], T9nObject.prototype, "fr", void 0);
T9nObject = __decorate([
    subclass('AdvancedSearchClasses.T9nObject')
], T9nObject);
export { T9nObject };
let DisplayField = class DisplayField extends Accessor {
    constructor(params) {
        super(params);
    }
};
__decorate([
    property()
], DisplayField.prototype, "name", void 0);
__decorate([
    property()
], DisplayField.prototype, "alias", void 0);
DisplayField = __decorate([
    subclass('AdvancedSearchClasses.T9nObject')
], DisplayField);
export { DisplayField };
let GraphicalSearchOptions = class GraphicalSearchOptions extends Accessor {
    constructor(enablepointselect = true, enablelineselect = true, enablepolylineselect = true, enableextentselect = true, enablecircleselect = true, enablepolyselect = true, selectiontolerance = 6) {
        super();
        this.enablepointselect = enablepointselect;
        this.enablelineselect = enablelineselect;
        this.enablepolylineselect = enablepolylineselect;
        this.enableextentselect = enableextentselect;
        this.enablecircleselect = enablecircleselect;
        this.enablepolyselect = enablepolyselect;
        this.selectiontolerance = selectiontolerance;
    }
};
__decorate([
    property()
], GraphicalSearchOptions.prototype, "enablepointselect", void 0);
__decorate([
    property()
], GraphicalSearchOptions.prototype, "enablelineselect", void 0);
__decorate([
    property()
], GraphicalSearchOptions.prototype, "enablepolylineselect", void 0);
__decorate([
    property()
], GraphicalSearchOptions.prototype, "enableextentselect", void 0);
__decorate([
    property()
], GraphicalSearchOptions.prototype, "enablecircleselect", void 0);
__decorate([
    property()
], GraphicalSearchOptions.prototype, "enablepolyselect", void 0);
__decorate([
    property()
], GraphicalSearchOptions.prototype, "selectiontolerance", void 0);
GraphicalSearchOptions = __decorate([
    subclass('AdvancedSearchClasses.GraphicalSearchOptions')
], GraphicalSearchOptions);
export { GraphicalSearchOptions };
let AdvancedSearchObject = class AdvancedSearchObject extends Accessor {
    constructor(layers = undefined, addMissingSearchLayers = false, zoomtosearchresults = true, graphicalsearchoptions = new GraphicalSearchOptions()) {
        super();
        this.layers = layers;
        this.addMissingSearchLayers = addMissingSearchLayers;
        this.zoomtosearchresults = zoomtosearchresults;
        this.graphicalsearchoptions = graphicalsearchoptions;
    }
};
__decorate([
    property()
], AdvancedSearchObject.prototype, "layers", void 0);
__decorate([
    property()
], AdvancedSearchObject.prototype, "addMissingSearchLayers", void 0);
__decorate([
    property()
], AdvancedSearchObject.prototype, "zoomtosearchresults", void 0);
__decorate([
    property()
], AdvancedSearchObject.prototype, "graphicalsearchoptions", void 0);
AdvancedSearchObject = __decorate([
    subclass('AdvancedSearchClasses.AdvancedSearchObject')
], AdvancedSearchObject);
export { AdvancedSearchObject };
let AdvancedSearchField = class AdvancedSearchField extends Accessor {
    constructor(params) {
        super(params);
    }
};
__decorate([
    property()
], AdvancedSearchField.prototype, "field", void 0);
__decorate([
    property()
], AdvancedSearchField.prototype, "fieldlabel", void 0);
__decorate([
    property()
], AdvancedSearchField.prototype, "fieldtype", void 0);
__decorate([
    property()
], AdvancedSearchField.prototype, "defaultvalue", void 0);
__decorate([
    property()
], AdvancedSearchField.prototype, "searchhint", void 0);
__decorate([
    property()
], AdvancedSearchField.prototype, "sqltext", void 0);
__decorate([
    property()
], AdvancedSearchField.prototype, "operator", void 0);
__decorate([
    property()
], AdvancedSearchField.prototype, "userlist", void 0);
__decorate([
    property()
], AdvancedSearchField.prototype, "usedistinctvalues", void 0);
__decorate([
    property()
], AdvancedSearchField.prototype, "required", void 0);
AdvancedSearchField = __decorate([
    subclass('AdvancedSearchClasses.AdvancedSearchFields')
], AdvancedSearchField);
export { AdvancedSearchField };
let AdvancedSearchLayer = class AdvancedSearchLayer extends Accessor {
    constructor(params) {
        super(params);
    }
};
__decorate([
    property()
], AdvancedSearchLayer.prototype, "id", void 0);
__decorate([
    property()
], AdvancedSearchLayer.prototype, "url", void 0);
__decorate([
    property()
], AdvancedSearchLayer.prototype, "zoomscale", void 0);
__decorate([
    property()
], AdvancedSearchLayer.prototype, "searchlayerlabel", void 0);
__decorate([
    property()
], AdvancedSearchLayer.prototype, "searchlayertitletext", void 0);
__decorate([
    property()
], AdvancedSearchLayer.prototype, "searchfields", void 0);
__decorate([
    property()
], AdvancedSearchLayer.prototype, "displayfields", void 0);
__decorate([
    property()
], AdvancedSearchLayer.prototype, "orderbyfields", void 0);
AdvancedSearchLayer = __decorate([
    subclass('AdvancedSearchClasses.AdvancedSearchLayer')
], AdvancedSearchLayer);
export { AdvancedSearchLayer };
//# sourceMappingURL=_AdvancedSearch.js.map