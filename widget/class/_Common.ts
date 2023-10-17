// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import Accessor from '@arcgis/core/core/Accessor';
import SpatialReference from "@arcgis/core/geometry/SpatialReference";
import FeatureSet from '@arcgis/core/rest/support/FeatureSet';
import Field from "@arcgis/core/layers/support/Field";

@subclass('CommonClasses.PublishParams')
export class PublishParams extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    name!: string;

    @property()
    targetSR!: SpatialReference;

    @property()
    maxRecordCount!: number;

    @property()
    enforceInputFileSizeLimit!: boolean;

    @property()
    enforceOutputJsonSizeLimit!: boolean;

    @property()
    generalize!: boolean;

    @property()
    maxAllowableOffset!: number;

    @property()
    reducePrecision!: boolean;

    @property()
    numberOfDigitsAfterDecimal!: number;
}

@subclass('CommonClasses.GenerateFeatureCollection')
export class GenerateFeatureCollection extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    layers!: Array<GenerateFeature>;
}

@subclass('CommonClasses.GenerateFeature')
export class GenerateFeature extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    featureSet!: FeatureSet;
    
    @property()
    layerDefinition!: GenerateLayerDefinition;
}

@subclass('CommonClasses.GenerateLayerDefinition')
export class GenerateLayerDefinition extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    fields!: Array<Field>;
}

@subclass('CommonClasses.LinksArray')
export class LinksArray extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    id!: string;

    @property()
    links!: Array<Link>;
}

@subclass('CommonClasses.ConfigLink')
export class ConfigLink extends Accessor {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    id!: string;

    @property()
    target!: "_blank"|"_self"|"_parent"|"_top";
}

@subclass('CommonClasses.Link')
export class Link extends ConfigLink {
    //----------------------------------
    //  Properties
    //----------------------------------
    @property()
    title!: string;

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