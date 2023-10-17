// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
import { ConfigLink } from "./_Common";

@subclass('_Footer.FooterLinksGroup')
export class FooterLinksGroup extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    id!: string;

    @property()
    footerLinksArray!: Array<ConfigLink>;
}