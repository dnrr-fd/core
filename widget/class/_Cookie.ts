// @ts-check
import { property, subclass } from '@arcgis/core/core/accessorSupport/decorators';
import Accessor from '@arcgis/core/core/Accessor';

@subclass('CookieClasses.CookieLabel')
export class CookieLabel {
    @property()
    id!: string;

    @property()
    label!: string;

}

@subclass('CookieClasses.Cookie')
export class Cookie extends Accessor {
    constructor(id="" as string, label="" as string, expiry=30 as number, value=null as string|null) {
        super();
        this.id = id;
        this.label = label;
        this.expiry = expiry;
        this.value = value;
    }

    @property()
    id!: string;

    @property()
    label!: string;

    @property()
    expiry!: number;

    @property()
    value!: string|null;

}

@subclass('CookieClasses.CookiesVM')
export class CookiesVM extends Cookie {
    constructor(accepted=false as boolean) {
        super();
        this.accepted = accepted;
    }

    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    accepted!: boolean;

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
      
    async setCookie(_value=null as string|null, expiry_days=30 as number): Promise<boolean> {
        this.accepted = true;
        this.expiry = expiry_days;
        
        if (_value) {
            this.value = _value;
        }
        if (this.value === undefined) {
            return false;
        } else {
            const enc_string = this.value? this.value: "null";
            const d = new Date();
            d.setTime(d.getTime() + (this.expiry * 24 * 60 * 60 * 1000));
            const expires = "expires=" + d.toUTCString();
            document.cookie = this.id + "=" + enc_string + ";" + expires + ";SameSite=None;Secure;path=/";
            // console.log(`setCookie() Value: ${document.cookie}`);
        }
        return true;
    }
      
    async getCookie(): Promise<boolean> {
        const name = this.id + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                const enc_string = c.substring(name.length, c.length);
                const dec_string = enc_string;
                this.accepted = true;
                if (dec_string === "null") {
                    this.value = null;
                } else {
                    this.value = dec_string;
                }
                // console.log(`getCookie() Value: ${this.value}`);
                return true;
            }
        }
        return false;
    }
}
