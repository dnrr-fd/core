import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
let PublishParams = class PublishParams extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    name;
    targetSR;
    maxRecordCount;
    enforceInputFileSizeLimit;
    enforceOutputJsonSizeLimit;
    generalize;
    maxAllowableOffset;
    reducePrecision;
    numberOfDigitsAfterDecimal;
};
__decorate([
    property()
], PublishParams.prototype, "name", void 0);
__decorate([
    property()
], PublishParams.prototype, "targetSR", void 0);
__decorate([
    property()
], PublishParams.prototype, "maxRecordCount", void 0);
__decorate([
    property()
], PublishParams.prototype, "enforceInputFileSizeLimit", void 0);
__decorate([
    property()
], PublishParams.prototype, "enforceOutputJsonSizeLimit", void 0);
__decorate([
    property()
], PublishParams.prototype, "generalize", void 0);
__decorate([
    property()
], PublishParams.prototype, "maxAllowableOffset", void 0);
__decorate([
    property()
], PublishParams.prototype, "reducePrecision", void 0);
__decorate([
    property()
], PublishParams.prototype, "numberOfDigitsAfterDecimal", void 0);
PublishParams = __decorate([
    subclass('CommonClasses.PublishParams')
], PublishParams);
export { PublishParams };
let GenerateFeatureCollection = class GenerateFeatureCollection extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    layers;
};
__decorate([
    property()
], GenerateFeatureCollection.prototype, "layers", void 0);
GenerateFeatureCollection = __decorate([
    subclass('CommonClasses.GenerateFeatureCollection')
], GenerateFeatureCollection);
export { GenerateFeatureCollection };
let GenerateFeature = class GenerateFeature extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    featureSet;
    layerDefinition;
};
__decorate([
    property()
], GenerateFeature.prototype, "featureSet", void 0);
__decorate([
    property()
], GenerateFeature.prototype, "layerDefinition", void 0);
GenerateFeature = __decorate([
    subclass('CommonClasses.GenerateFeature')
], GenerateFeature);
export { GenerateFeature };
let GenerateLayerDefinition = class GenerateLayerDefinition extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    fields;
};
__decorate([
    property()
], GenerateLayerDefinition.prototype, "fields", void 0);
GenerateLayerDefinition = __decorate([
    subclass('CommonClasses.GenerateLayerDefinition')
], GenerateLayerDefinition);
export { GenerateLayerDefinition };
let LinksArray = class LinksArray extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    id;
    links;
};
__decorate([
    property()
], LinksArray.prototype, "id", void 0);
__decorate([
    property()
], LinksArray.prototype, "links", void 0);
LinksArray = __decorate([
    subclass('CommonClasses.LinksArray')
], LinksArray);
export { LinksArray };
let ConfigLink = class ConfigLink extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    id;
    target;
};
__decorate([
    property()
], ConfigLink.prototype, "id", void 0);
__decorate([
    property()
], ConfigLink.prototype, "target", void 0);
ConfigLink = __decorate([
    subclass('CommonClasses.ConfigLink')
], ConfigLink);
export { ConfigLink };
let Link = class Link extends ConfigLink {
    //----------------------------------
    //  Properties
    //----------------------------------
    title;
    url;
};
__decorate([
    property()
], Link.prototype, "title", void 0);
__decorate([
    property()
], Link.prototype, "url", void 0);
Link = __decorate([
    subclass('CommonClasses.Link')
], Link);
export { Link };
let Email = class Email extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    id;
    displayedemailtext;
    subjectline;
    messagetext;
    emailaddress;
};
__decorate([
    property()
], Email.prototype, "id", void 0);
__decorate([
    property()
], Email.prototype, "displayedemailtext", void 0);
__decorate([
    property()
], Email.prototype, "subjectline", void 0);
__decorate([
    property()
], Email.prototype, "messagetext", void 0);
__decorate([
    property()
], Email.prototype, "emailaddress", void 0);
Email = __decorate([
    subclass('CommonClasses.Email')
], Email);
export { Email };
//# sourceMappingURL=_Common.js.map