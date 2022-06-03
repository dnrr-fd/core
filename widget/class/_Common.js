import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
let Link = class Link extends Accessor {
};
__decorate([
    property()
], Link.prototype, "id", void 0);
__decorate([
    property()
], Link.prototype, "title", void 0);
__decorate([
    property()
], Link.prototype, "target", void 0);
__decorate([
    property()
], Link.prototype, "url", void 0);
Link = __decorate([
    subclass('CommonClasses.Link')
], Link);
export { Link };
let Email = class Email extends Accessor {
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