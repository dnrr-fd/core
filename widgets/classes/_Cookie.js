import { __decorate } from "tslib";
// @ts-check
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import Accessor from '@arcgis/core/core/Accessor';
let CookieLabel = class CookieLabel {
};
__decorate([
    property()
], CookieLabel.prototype, "id", void 0);
__decorate([
    property()
], CookieLabel.prototype, "label", void 0);
CookieLabel = __decorate([
    subclass('CookieClasses.CookieLabel')
], CookieLabel);
export { CookieLabel };
let Cookie = class Cookie extends Accessor {
    constructor(id = "", label = "", expiry = 30, value = null) {
        super();
        this.id = id;
        this.label = label;
        this.expiry = expiry;
        this.value = value;
    }
};
__decorate([
    property()
], Cookie.prototype, "id", void 0);
__decorate([
    property()
], Cookie.prototype, "label", void 0);
__decorate([
    property()
], Cookie.prototype, "expiry", void 0);
__decorate([
    property()
], Cookie.prototype, "value", void 0);
Cookie = __decorate([
    subclass('CookieClasses.Cookie')
], Cookie);
export { Cookie };
let CookiesVM = class CookiesVM extends Cookie {
    constructor(accepted = false) {
        super();
        this.accepted = accepted;
    }
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    async deleteCookie() {
        await this.getCookie().then(result => {
            if (result === true) {
                document.cookie = `${this.id}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
            }
            this.accepted = false;
            this.value = null;
        });
    }
    async setCookie(_value = null, expiry_days = 30) {
        this.accepted = true;
        this.expiry = expiry_days;
        if (_value) {
            this.value = _value;
        }
        if (this.value === undefined) {
            return false;
        }
        else {
            // let enc_string = Buffer.from(this.value? this.value: "null").toString('base64');
            let enc_string = this.value ? this.value : "null";
            const d = new Date();
            d.setTime(d.getTime() + (this.expiry * 24 * 60 * 60 * 1000));
            let expires = "expires=" + d.toUTCString();
            document.cookie = this.id + "=" + enc_string + ";" + expires + ";SameSite=None;Secure;path=/";
            console.log(`setCookie() Value: ${document.cookie}`);
        }
        return true;
    }
    async getCookie() {
        let name = this.id + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                let enc_string = c.substring(name.length, c.length);
                // let dec_string = Buffer.from(enc_string, 'base64').toString('utf-8');
                let dec_string = enc_string;
                this.accepted = true;
                if (dec_string === "null") {
                    this.value = null;
                }
                else {
                    this.value = dec_string;
                }
                console.log(`getCookie() Value: ${this.value}`);
                return true;
            }
        }
        return false;
    }
};
__decorate([
    property()
], CookiesVM.prototype, "accepted", void 0);
CookiesVM = __decorate([
    subclass('CookieClasses.CookiesVM')
], CookiesVM);
export { CookiesVM };
//# sourceMappingURL=_Cookie.js.map