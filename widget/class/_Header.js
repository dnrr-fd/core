import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
let Theme = class Theme extends Accessor {
};
__decorate([
    property()
], Theme.prototype, "id", void 0);
__decorate([
    property()
], Theme.prototype, "label", void 0);
__decorate([
    property()
], Theme.prototype, "src", void 0);
Theme = __decorate([
    subclass('HeaderClasses.Theme')
], Theme);
export { Theme };
let Locale = class Locale extends Accessor {
};
__decorate([
    property()
], Locale.prototype, "id", void 0);
__decorate([
    property()
], Locale.prototype, "label", void 0);
Locale = __decorate([
    subclass('HeaderClasses.Locale')
], Locale);
export { Locale };
let Logo = class Logo extends Accessor {
};
__decorate([
    property()
], Logo.prototype, "title", void 0);
__decorate([
    property()
], Logo.prototype, "alt", void 0);
__decorate([
    property()
], Logo.prototype, "src", void 0);
__decorate([
    property()
], Logo.prototype, "target", void 0);
__decorate([
    property()
], Logo.prototype, "url", void 0);
Logo = __decorate([
    subclass('HeaderClasses.Logo')
], Logo);
export { Logo };
let Menu = class Menu extends Accessor {
};
__decorate([
    property()
], Menu.prototype, "menulinks", void 0);
__decorate([
    property()
], Menu.prototype, "themes", void 0);
__decorate([
    property()
], Menu.prototype, "showlocales", void 0);
__decorate([
    property()
], Menu.prototype, "languages", void 0);
__decorate([
    property()
], Menu.prototype, "startExpanded", void 0);
__decorate([
    property()
], Menu.prototype, "signoutlinkid", void 0);
Menu = __decorate([
    subclass('HeaderClasses.Menu')
], Menu);
export { Menu };
//# sourceMappingURL=_Header.js.map