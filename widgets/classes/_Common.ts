// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';

@subclass('CommonClasses.Link')
export class Link extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    id!: string;

    @property()
    title!: string;

    @property()
    target!: "_blank"|"_self"|"_parent"|"_top";

    @property()
    url!: string;
}

@subclass('CommonClasses.Email')
export class Email extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    id!: string;

    @property()
    displayedemailtext!: string;

    @property()
    subjectline!: string;

    @property()
    messagetext!: string;

    @property()
    emailaddress!: string;
}