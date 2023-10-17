import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
let FooterLinksGroup = class FooterLinksGroup extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    id;
    footerLinksArray;
};
__decorate([
    property()
], FooterLinksGroup.prototype, "id", void 0);
__decorate([
    property()
], FooterLinksGroup.prototype, "footerLinksArray", void 0);
FooterLinksGroup = __decorate([
    subclass('_Footer.FooterLinksGroup')
], FooterLinksGroup);
export { FooterLinksGroup };
//# sourceMappingURL=_Footer.js.map