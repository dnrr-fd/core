// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';

@subclass('LegendClasses.LegendStyle')
export class LegendStyle extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------

    @property()
    type!: "classic"|"card";

    @property()
    layout!: "auto"|"side-by-side"|"stack";

}
