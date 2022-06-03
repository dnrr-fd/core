// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
import { Link } from './_Common'

@subclass('HeaderClasses.Theme')
export class Theme extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------

    @property()
    id!: string;

    @property()
    label!: string;

    @property()
    src!: string;
}

@subclass('HeaderClasses.Locale')
export class Locale extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------

    @property()
    id!: "en"|"fr";

    @property()
    label!: string;
}

@subclass('HeaderClasses.Logo')
export class Logo extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    title!: string;

    @property()
    alt!: string;

    @property()
    src!: string;

    @property()
    target!: "_blank"|"_self"|"_parent"|"_top";

    @property()
    url!: string;
}

@subclass('HeaderClasses.Menu')
export class Menu extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    menulinks!: Array<Link>;

    @property()
    themes!: Array<Theme>;

    @property()
    showlocales!: boolean;

    @property()
    languages!: Array<Locale>;

    @property()
    signoutlinkid?: string;
}

