import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
let Image = class Image extends Accessor {
};
__decorate([
    property()
], Image.prototype, "src", void 0);
__decorate([
    property()
], Image.prototype, "height", void 0);
Image = __decorate([
    subclass('LoadingClasses.Image')
], Image);
export { Image };
//# sourceMappingURL=_Loading.js.map