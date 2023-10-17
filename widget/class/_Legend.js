import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
let LegendStyle = class LegendStyle extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    type;
    layout;
};
__decorate([
    property()
], LegendStyle.prototype, "type", void 0);
__decorate([
    property()
], LegendStyle.prototype, "layout", void 0);
LegendStyle = __decorate([
    subclass('LegendClasses.LegendStyle')
], LegendStyle);
export { LegendStyle };
//# sourceMappingURL=_Legend.js.map