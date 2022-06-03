// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';

@subclass('LoadingClasses.Image')
export class Image extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    src!: string;

    @property()
    height!: number
}

