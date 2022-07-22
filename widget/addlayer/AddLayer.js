import { __decorate } from "tslib";
// @ts-check
import { subclass, property } from "@arcgis/core/core/accessorSupport/decorators";
import { tsx } from "@arcgis/core/widgets/support/widget";
import Widget from "@arcgis/core/widgets/Widget";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Graphic from "@arcgis/core/Graphic";
import Field from "@arcgis/core/layers/support/Field";
import esriRequest from "@arcgis/core/request";
import esriConfig from "@arcgis/core/config";
import * as intl from "@arcgis/core/intl";
import { getWidgetTheme, getFocusableElements, ariaDisable } from "@dnrr_fd/util/web";
import { getNormalizedLocale } from "@dnrr_fd/util/locale";
// Import Assets
import * as css from './assets/css/addlayer.module.css';
import * as t9n_en from './assets/t9n/en.json';
import * as t9n_fr from './assets/t9n/fr.json';
var t9n = t9n_en;
var sendFile = false;
var fileName_full = "";
var layerName;
var addedLayers = new Array();
esriConfig.apiKey = "AAPK7b2388bee8e84255972305a56f1d1eb3pT4KCLkHcACj4k0lPHEjERRSP-6aNzBgClNib1uj6uYE8vh-AGy4_pU5AH_ZOTzz";
const css_esri = {
    esri_widget: 'esri-widget',
    esri_component: 'esri-component',
    esri_interactive: 'esri-interactive',
    esri_button: 'esri-button',
    esri_button_third: 'esri-button--third',
    esri_button_disabled: 'esri-button--disabled',
    esri_widget_button: 'esri-widget--button',
    esri_widget_anchor: 'esri-widget__anchor',
    esri_input: 'esri-input',
    esri_icon_trash: 'esri-icon-trash',
    esri_icon_erase: 'esri-icon-erase',
    esri_icon_zoom_in_magnifying_glass: 'esri-icon-zoom-in-magnifying-glass'
};
const elementIDs = {
    esriThemeID: "esriThemeID",
    measurement_MainID: "measurement_MainID",
    addlayer_FileTabID: "addlayer_FileTabID",
    addlayer_ServiceTabID: "addlayer_ServiceTabID",
    addlayer_FileTabDivID: "addlayer_FileTabDivID",
    addlayer_ServiceTabDivID: "addlayer_ServiceTabDivID",
    addlayer_FileFormID: "addlayer_FileFormID",
    addlayer_FileFileID: "addlayer_FileFileID",
    addlayer_FileButtonID: "addlayer_FileButtonID",
    addlayer_FileUpdateStatusID: "addlayer_FileUpdateStatusID",
    addlayer_FileUpdateStatusDivID: "addlayer_FileUpdateStatusDivID",
    addlayer_FileUpdateStatusClearID: 'addlayer_FileUpdateStatusClearID',
    addlayer_FileInfoID: "addlayer_FileInfoID",
    addlayer_ResultsDivID: "addlayer_ResultsDivID",
    addlayer_ServiceInputID: "addlayer_ServiceInputID",
    addlayer_ServiceGoButtonID: "addlayer_ServiceGoButtonID",
    addlayer_ServiceInfoDivID: "addlayer_ServiceInfoDivID",
    addlayer_ServiceInfoID: "addlayer_ServiceInfoID"
};
class URLServiceResult {
    constructor(featureLayer, message) {
        this.featureLayer = featureLayer;
        this.message = message;
    }
}
let AddLayer = class AddLayer extends Widget {
    constructor(params) {
        super(params);
    }
    //--------------------------------------------------------------------------
    //  Public Methods
    //--------------------------------------------------------------------------
    postInitialize() {
        var _locale = getNormalizedLocale();
        // console.log(`_LOCALE: ${_locale}`);
        t9n = (_locale === 'en' ? t9n_en : t9n_fr);
        this.label = t9n.label;
        this.theme = getWidgetTheme(elementIDs.esriThemeID, this.theme);
        intl.onLocaleChange(function (locale) {
            t9n = (locale === 'en' ? t9n_en : t9n_fr);
        });
    }
    render() {
        return (tsx("div", { id: elementIDs.measurement_MainID, class: this.classes(css.default.widget_addlayer, css_esri.esri_component, css_esri.esri_widget), afterCreate: this.afterRenderActions, bind: this },
            tsx("div", { class: css.default.widget_addlayer_tab__div },
                tsx("button", { id: elementIDs.addlayer_FileTabID, class: this.classes(css.default.widget_addlayer_tab__button, css_esri.esri_widget_button), title: t9n.addFileTabLabel, ariaLabel: t9n.addFileTabLabel, onclick: this._addFileTab_click.bind(this), tabindex: "0" }, t9n.addFileTabLabel),
                tsx("button", { id: elementIDs.addlayer_ServiceTabID, class: this.classes(css.default.widget_addlayer_tab__button, css_esri.esri_widget_button), title: t9n.addServiceTabLabel, ariaLabel: t9n.addServiceTabLabel, onclick: this._addServiceTab_click.bind(this), tabindex: "0" }, t9n.addServiceTabLabel)),
            tsx("div", { id: elementIDs.addlayer_FileTabDivID, class: this.classes(css.default.widget_addlayer_tabcontent__div) },
                tsx("h3", null, t9n.addFileHeaderLabel),
                tsx("p", { class: css.default.widget_addlayer_p }, t9n.addFileSelectionText),
                tsx("p", { class: css.default.widget_addlayer_p },
                    `${t9n.addFileTypeHelpText} `,
                    tsx("a", { target: "_blank", rel: "noopener", href: "https://doc.arcgis.com/en/arcgis-online/reference/shapefiles.htm", class: css_esri.esri_widget_anchor }, t9n.addFileTypeHelpLinkTitle)),
                tsx("form", { id: elementIDs.addlayer_FileFormID, enctype: "multipart/form-data", method: "post" },
                    tsx("div", { class: css.default.widget_addlayer_file_button__div },
                        tsx("label", { for: elementIDs.addlayer_FileFileID, class: css.default.widget_addlayer_buttontitle__label }, t9n.addFileButtonSectionLabel),
                        tsx("input", { id: elementIDs.addlayer_FileFileID, class: css.default.widget_addlayer_visible__none, type: "file", name: "addlayer_file" }),
                        tsx("span", null,
                            tsx("button", { id: elementIDs.addlayer_FileButtonID, class: this.classes(css_esri.esri_button, css.default.widget_addlayer_file__button), title: t9n.addFileButtonLabel, ariaLabel: t9n.addFileButtonLabel, onclick: this._addFileButton_click.bind(this), tabindex: "0" }, t9n.addFileButtonLabel)))),
                tsx("span", null,
                    tsx("div", { id: elementIDs.addlayer_FileUpdateStatusDivID, class: this.classes(css.default.widget_addlayer_file_uploadstatus__div, css.default.widget_addlayer_visible__none) },
                        tsx("div", null,
                            tsx("p", { id: elementIDs.addlayer_FileUpdateStatusID, class: css.default.widget_addlayer_file_uploadstatus__p })),
                        tsx("div", { class: css.default.widget_addlayer_file_uploadstatus_clear_button__div },
                            tsx("button", { id: elementIDs.addlayer_FileUpdateStatusClearID, class: this.classes(css.default.widget_addlayer_file_uploadstatus_clear__button, css_esri.esri_widget_button, css_esri.esri_icon_erase), title: t9n.addFileUpdateStatusClearLabel, ariaLabel: t9n.addFileUpdateStatusClearLabel, onclick: this._addFileUpdateStatusClearButton_click.bind(this), tabindex: "0" })))),
                tsx("div", { class: css.default.widget_addlayer_file_fileinfo__div },
                    tsx("p", { id: elementIDs.addlayer_FileInfoID, class: css.default.widget_addlayer_p }))),
            tsx("div", { id: elementIDs.addlayer_ServiceTabDivID, class: this.classes(css.default.widget_addlayer_tabcontent__div, css.default.widget_addlayer_visible__none) },
                tsx("h3", null, t9n.addServiceHeaderLabel),
                tsx("p", { class: css.default.widget_addlayer_p }, t9n.addServiceSelectionText),
                tsx("div", { class: css.default.widget_addlayer_service__div },
                    tsx("div", { class: css.default.widget_addlayer_service_input__div },
                        tsx("label", { for: elementIDs.addlayer_ServiceInputID }, t9n.addServiceInputLabel),
                        tsx("input", { id: elementIDs.addlayer_ServiceInputID, class: this.classes(css_esri.esri_input, css.default.widget_addlayer_service__input), type: "text", title: t9n.addServiceInputLabel, ariaLabel: t9n.addServiceInputLabel, tabindex: "0" })),
                    tsx("div", { class: css.default.widget_addlayer_service_button__div },
                        tsx("button", { id: elementIDs.addlayer_ServiceGoButtonID, class: this.classes(css.default.widget_addlayer_service_go__button, css_esri.esri_button_third, css_esri.esri_button_disabled), title: t9n.addFileServiceGoLabel, ariaLabel: t9n.addFileServiceGoLabel, "aria-disabled": 'true', onclick: this._addFileServiceGoButton_click.bind(this), tabindex: "0" }, t9n.addFileServiceGoLabel))),
                tsx("div", { id: elementIDs.addlayer_ServiceInfoDivID, class: this.classes(css.default.widget_addlayer_service_serviceInfo__div, css.default.widget_addlayer_visible__none) },
                    tsx("p", { id: elementIDs.addlayer_ServiceInfoID, class: css.default.widget_addlayer_p }))),
            tsx("div", null,
                tsx("div", { id: elementIDs.addlayer_ResultsDivID, class: this.classes(css.default.widget_addlayer_results__div, css.default.widget_addlayer_visible__none) }))));
    }
    //--------------------------------------------------------------------------
    //  Event Methods
    //--------------------------------------------------------------------------
    _addFileTab_click() {
        let fileDiv_node = document.getElementById(elementIDs.addlayer_FileTabDivID);
        let serviceDiv_node = document.getElementById(elementIDs.addlayer_ServiceTabDivID);
        fileDiv_node.classList.remove(css.default.widget_addlayer_visible__none);
        serviceDiv_node.classList.add(css.default.widget_addlayer_visible__none);
        // Get focusable elements
        getFocusableElements(document.getElementById(this.rootFocusElement));
    }
    _addServiceTab_click() {
        let fileDiv_node = document.getElementById(elementIDs.addlayer_FileTabDivID);
        let serviceDiv_node = document.getElementById(elementIDs.addlayer_ServiceTabDivID);
        fileDiv_node.classList.add(css.default.widget_addlayer_visible__none);
        serviceDiv_node.classList.remove(css.default.widget_addlayer_visible__none);
        // Get focusable elements
        getFocusableElements(document.getElementById(this.rootFocusElement));
    }
    _addFileButton_click(e) {
        let fileInputFile_node = document.getElementById(elementIDs.addlayer_FileFileID);
        // Keep the button from posting as default action.
        e.preventDefault();
        if (sendFile === false) {
            fileInputFile_node.click();
        }
        else {
            // Send the file to be processed.
            this.loadFile();
        }
    }
    _addFileUpdateStatusClearButton_click(e) {
        // Keep the button from posting as default action.
        e.preventDefault();
        this.removeFile();
    }
    _addFileServiceGoButton_click(e) {
        let serviceInputText_node = document.getElementById(elementIDs.addlayer_ServiceInputID);
        let serviceGoButton_node = document.getElementById(elementIDs.addlayer_ServiceGoButtonID);
        let urlValue = serviceInputText_node.value;
        if (serviceGoButton_node.ariaDisabled === "true") {
            e.preventDefault();
        }
        else {
            this.addURLServiceToMap(urlValue);
        }
    }
    //--------------------------------------------------------------------------
    //  Private Methods
    //--------------------------------------------------------------------------
    afterRenderActions() {
        let fileForm_node = document.getElementById(elementIDs.addlayer_FileFormID);
        let fileInputFile_node = document.getElementById(elementIDs.addlayer_FileFileID);
        let fileUpdateStatus_node = document.getElementById(elementIDs.addlayer_FileUpdateStatusID);
        let fileUpdateStatusDiv_node = document.getElementById(elementIDs.addlayer_FileUpdateStatusDivID);
        let fileInfo_node = document.getElementById(elementIDs.addlayer_FileInfoID);
        let fileButton_node = document.getElementById(elementIDs.addlayer_FileButtonID);
        let serviceInput_node = document.getElementById(elementIDs.addlayer_ServiceInputID);
        let serviceGoButton_node = document.getElementById(elementIDs.addlayer_ServiceGoButtonID);
        fileForm_node.addEventListener("change", (event) => {
            if (event) {
                fileName_full = fileInputFile_node.value.replace("C:\\fakepath\\", "");
                var fileName_Test = fileName_full.toLowerCase();
                // Check to see if the file is already uploaded
                if (addedLayers.length > 0) {
                    addedLayers.map((lyr) => {
                        if (lyr.fileName === fileName_full) {
                            // File has already been uploaded. Inform the user and exit.
                            fileInfo_node.classList.add(css.default.widget_addlayer__error);
                            fileInfo_node.innerHTML = t9n.addFileDuplicateWarning;
                            fileName_full = "";
                            return;
                        }
                    });
                }
                if (fileName_full != "") {
                    fileUpdateStatus_node.classList.remove(css.default.widget_addlayer__error);
                    fileInfo_node.classList.remove(css.default.widget_addlayer__error);
                    fileUpdateStatus_node.innerHTML = "";
                    fileInfo_node.innerHTML = "";
                    fileUpdateStatusDiv_node.classList.remove(css.default.widget_addlayer_visible__none);
                    if (fileName_Test.indexOf(".zip") !== -1 || fileName_Test.indexOf(".gpx") !== -1 || fileName_Test.indexOf(".geojson") !== -1) {
                        //is file a zip - if not notify user
                        fileUpdateStatus_node.innerHTML = fileName_full;
                        // Change the file button
                        fileButton_node.innerText = t9n.addFileSendButtonLabel;
                        fileButton_node.title = t9n.addFileSendButtonLabel;
                        fileButton_node.ariaLabel = t9n.addFileSendButtonLabel;
                        sendFile = true;
                    }
                    else {
                        fileUpdateStatus_node.classList.add(css.default.widget_addlayer__error);
                        fileUpdateStatus_node.innerHTML = t9n.addFileTypeWarning;
                        fileName_full = "";
                    }
                }
            }
        });
        serviceInput_node.addEventListener("keyup", (e) => {
            let isEnterPressed = e.key === 'Enter' || e.keyCode === 13;
            let isSpacePressed = e.key === 'Space' || e.keyCode === 32;
            let isTabPressed = e.key === 'Tab' || e.keyCode === 9;
            if (!isEnterPressed || !isSpacePressed || isTabPressed) {
                if (serviceInput_node.value.length > 0) {
                    ariaDisable(serviceGoButton_node, [css_esri.esri_button_disabled], false);
                }
                else {
                    ariaDisable(serviceGoButton_node, [css_esri.esri_button_disabled], true);
                }
            }
        });
    }
    removeFile() {
        let fileInputFile_node = document.getElementById(elementIDs.addlayer_FileFileID);
        let fileUpdateStatus_node = document.getElementById(elementIDs.addlayer_FileUpdateStatusID);
        let fileUpdateStatusDiv_node = document.getElementById(elementIDs.addlayer_FileUpdateStatusDivID);
        let fileButton_node = document.getElementById(elementIDs.addlayer_FileButtonID);
        fileName_full = "";
        fileInputFile_node.value = "";
        fileUpdateStatus_node.classList.remove(css.default.widget_addlayer__error);
        fileUpdateStatus_node.innerHTML = '';
        fileUpdateStatusDiv_node.classList.add(css.default.widget_addlayer_visible__none);
        // Reset the file button
        fileButton_node.innerText = t9n.addFileButtonLabel;
        fileButton_node.title = t9n.addFileButtonLabel;
        fileButton_node.ariaLabel = t9n.addFileButtonLabel;
        sendFile = false;
    }
    removeURL() {
        let serviceInputText_node = document.getElementById(elementIDs.addlayer_ServiceInputID);
        let serviceInfoDiv_node = document.getElementById(elementIDs.addlayer_ServiceInfoDivID);
        let serviceInfo_node = document.getElementById(elementIDs.addlayer_ServiceInfoID);
        let serviceGoButton_node = document.getElementById(elementIDs.addlayer_ServiceGoButtonID);
        serviceInfo_node.classList.remove(css.default.widget_addlayer__error);
        serviceInputText_node.value = "";
        serviceInfo_node.innerHTML = "";
        serviceInfoDiv_node.classList.add(css.default.widget_addlayer_visible__none);
        ariaDisable(serviceGoButton_node, [css_esri.esri_button_disabled], true);
    }
    loadFile() {
        let fn = fileName_full.split(".");
        let ext = "";
        if (fn.length > 1) {
            ext = fn[fn.length - 1].toLowerCase();
            fn.pop();
        }
        layerName = fn.join("_");
        var fileInfo_node = document.getElementById(elementIDs.addlayer_FileInfoID);
        let fileInputFile_node = document.getElementById(elementIDs.addlayer_FileFileID);
        let message = `${t9n.addFileInfoLoading} ${fileName_full}`;
        fileInfo_node.classList.remove(css.default.widget_addlayer__error);
        fileInfo_node.innerHTML = message;
        let _filetype = "";
        if (ext === "zip") {
            _filetype = "shapefile";
        }
        else if (ext === "gpx") {
            _filetype = "gpx";
        }
        else if (ext === "geojson") {
            _filetype = "geojson";
        }
        else {
            fileInfo_node.classList.add(css.default.widget_addlayer__error);
            fileInfo_node.innerHTML = t9n.addFileTypeWarning;
            return;
        }
        if (_filetype != "") {
            // Hide the fileUpdateStatusDiv_node while work is in progress.
            let fileUpdateStatusDiv_node = document.getElementById(elementIDs.addlayer_FileUpdateStatusDivID);
            fileUpdateStatusDiv_node.classList.add(css.default.widget_addlayer_visible__none);
        }
        //https://developers.arcgis.com/rest/users-groups-and-items/generate.htm
        const params = {
            name: layerName,
            targetSR: this.view.spatialReference,
            maxRecordCount: 1000,
            enforceInputFileSizeLimit: true,
            enforceOutputJsonSizeLimit: true
        };
        params.generalize = true;
        params.maxAllowableOffset = 10;
        params.reducePrecision = true;
        params.numberOfDigitsAfterDecimal = 0;
        const myContent = {
            filetype: _filetype,
            publishParameters: JSON.stringify(params),
            f: "json"
        };
        // https://www.pluralsight.com/guides/uploading-files-with-reactjs
        const formData = new FormData();
        formData.append('File', fileInputFile_node.files[0]);
        // use the REST generate operation to generate a feature collection from the file
        esriRequest(this.generateURL, {
            query: myContent,
            body: formData,
            responseType: "json",
            method: "post"
        })
            .then((response) => {
            const _layerName = response.data.featureCollection.layers[0].layerDefinition.name;
            fileInfo_node.innerHTML = `<b>${t9n.addFileInfoLoaded} </b>${_layerName}`;
            this.addFileToMap(response.data.featureCollection);
        })
            .catch(this.errorHandler);
    }
    errorHandler(error) {
        let fileInfo_node = document.getElementById(elementIDs.addlayer_FileInfoID);
        fileInfo_node.classList.add(css.default.widget_addlayer__error);
        fileInfo_node.innerHTML = error.message;
    }
    addFileToMap(featureCollection) {
        // add the file to the map and zoom to the feature collection extent
        // if you want to persist the feature collection when you reload browser, you could store the
        // collection in local storage by serializing the layer using featureLayer.toJson()
        // see the 'Feature Collection in Local Storage' sample for an example of how to work with local storage
        let sourceGraphics = new Array();
        let resultsDiv_node = document.getElementById(elementIDs.addlayer_ResultsDivID);
        var self = this;
        const layers = featureCollection.layers.map((layer) => {
            const graphics = layer.featureSet.features.map((feature) => {
                return Graphic.fromJSON(feature);
            });
            sourceGraphics = sourceGraphics.concat(graphics);
            const featureLayer = new FeatureLayer({
                objectIdField: "FID",
                title: layerName,
                source: graphics,
                fields: layer.layerDefinition.fields.map((field) => {
                    return Field.fromJSON(field);
                })
            });
            addedLayers.push({ layerName: layerName, layerID: featureLayer.id, fileName: fileName_full });
            return featureLayer;
            // associate the feature with the popup on click to enable highlight and zoom to
        });
        this.view.map.addMany(layers);
        this.view.goTo(sourceGraphics).catch((error) => {
            if (error.name != "AbortError") {
                console.error(error);
            }
        });
        // Turn on the results layer DIV and populate with the layer.
        this.createLayerResultsItem(self, resultsDiv_node);
        // Reset the file input.
        this.removeFile();
    }
    async addURLServiceToMap(_urlValue) {
        var self = this;
        let resultsDiv_node = document.getElementById(elementIDs.addlayer_ResultsDivID);
        let serviceInfoDiv_node = document.getElementById(elementIDs.addlayer_ServiceInfoDivID);
        let serviceInfo_node = document.getElementById(elementIDs.addlayer_ServiceInfoID);
        let serviceInputText_node = document.getElementById(elementIDs.addlayer_ServiceInputID);
        let serviceGoButton_node = document.getElementById(elementIDs.addlayer_ServiceGoButtonID);
        serviceInfo_node.classList.remove(css.default.widget_addlayer__error);
        // Check if we have a valid URL from the user, otherwise display an error.
        var expression = /\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))/i;
        // Example URL: https://services3.arcgis.com/GVgbJbqm8hXASVYi/arcgis/rest/services/Parks_and_Open_Space/FeatureServer/0
        var regex = new RegExp(expression);
        if (_urlValue.match(regex)) {
            serviceInfo_node.innerHTML = `<b>${t9n.addServiceValidUrlLabel}</b> ${_urlValue}`;
            ;
            await this.urlToFeatureLayer(_urlValue).then((response) => {
                if (response.featureLayer) {
                    // Add the resulting FeatureLayer to the map.
                    response.featureLayer.createPopupTemplate();
                    this.view.map.add(response.featureLayer);
                    layerName = response.featureLayer.title;
                    addedLayers.push({ layerName: layerName, layerID: response.featureLayer.id, fileName: layerName });
                    serviceInfo_node.innerHTML = "";
                    // Turn on the results layer DIV and populate with the layer.
                    this.createLayerResultsItem(self, resultsDiv_node);
                    // Reset the URL input.
                    this.removeURL();
                }
                else {
                    serviceInfoDiv_node.classList.remove(css.default.widget_addlayer_visible__none);
                    serviceInfo_node.classList.add(css.default.widget_addlayer__error);
                    serviceInfo_node.innerHTML = response.message;
                    serviceInputText_node.value = "";
                    ariaDisable(serviceGoButton_node, [css_esri.esri_button_disabled], true);
                }
            });
        }
        else {
            serviceInfoDiv_node.classList.remove(css.default.widget_addlayer_visible__none);
            serviceInfo_node.classList.add(css.default.widget_addlayer__error);
            serviceInfo_node.innerHTML = `<b>${t9n.addServiceInvalidUrlLabel}</b> ${_urlValue}`;
            serviceInputText_node.value = "";
            ariaDisable(serviceGoButton_node, [css_esri.esri_button_disabled], true);
        }
    }
    async urlToFeatureLayer(url) {
        var featureLayer = null;
        var message = "";
        var featureLayer_test = new FeatureLayer({ url: url });
        // Check if the FeatureLayer is both valid and supported, i.e. not a table.
        await featureLayer_test.load().then((response) => {
            if (response.loaded) {
                if (response.isTable === false) {
                    featureLayer = response;
                }
                else {
                    message = `<b>${t9n.addServiceErrorUrlLabel}</b> ${url}`;
                }
            }
        }).catch((error) => {
            message = `<b>${t9n.addServiceErrorUrlLabel}</b> ${error.message}`;
        });
        return new URLServiceResult(featureLayer, message);
    }
    createLayerResultsItem(self, resultsDiv_node) {
        let layerDiv = document.createElement("div");
        let buttonWrapperDiv = document.createElement("div");
        let buttonDiv = document.createElement("div");
        let layerLabel = document.createElement("label");
        let layerZoomButton = document.createElement("button");
        let layerRemoveButton = document.createElement("button");
        resultsDiv_node.classList.remove(css.default.widget_addlayer_visible__none);
        layerDiv.id = `${layerName}_divID`;
        layerDiv.classList.add(css.default.widget_addlayer_results_layer__div);
        buttonWrapperDiv.classList.add(css.default.widget_addlayer_results_button_wrapper__div);
        buttonDiv.classList.add(css.default.widget_addlayer_results_button__div);
        layerLabel.classList.add(css.default.widget_addlayer_results_layer__label);
        layerLabel.innerHTML = layerName;
        layerLabel.title = layerName;
        layerLabel.ariaLabel = layerName;
        layerZoomButton.id = `${layerName}_zoom`;
        layerZoomButton.classList.add(css.default.widget_addlayer_results__button, css_esri.esri_widget_button, css_esri.esri_icon_zoom_in_magnifying_glass);
        layerZoomButton.tabIndex = 0;
        layerZoomButton.title = `${t9n.addFileResultsZoomButtonLabel} ${layerName}`;
        layerZoomButton.ariaLabel = `${t9n.addFileResultsZoomButtonLabel} ${layerName}`;
        layerZoomButton.addEventListener('click', function () {
            var layerID = "";
            let _id = this.id;
            addedLayers.map(lyr => {
                if (`${lyr.layerName}_zoom` === _id) {
                    layerID = lyr.layerID;
                    return;
                }
            });
            var _layer = self.view.map.findLayerById(layerID);
            self.view.goTo(_layer.fullExtent);
        });
        layerRemoveButton.id = `${layerName}_remove`;
        layerRemoveButton.classList.add(css.default.widget_addlayer_results__button, css_esri.esri_widget_button, css_esri.esri_icon_trash);
        layerRemoveButton.tabIndex = 0;
        layerRemoveButton.title = `${t9n.addFileResultsRemoveButtonLabel} ${layerName}`;
        layerRemoveButton.ariaLabel = `${t9n.addFileResultsRemoveButtonLabel} ${layerName}`;
        layerRemoveButton.addEventListener('click', function () {
            let fileInfo_node = document.getElementById(elementIDs.addlayer_FileInfoID);
            fileInfo_node.classList.remove(css.default.widget_addlayer__error);
            var layerID = "";
            var lyrName = "";
            let _id = this.id;
            let _fileName = "";
            let idx = -1;
            addedLayers.map((lyr, index) => {
                if (`${lyr.layerName}_remove` === _id) {
                    layerID = lyr.layerID;
                    lyrName = lyr.layerName;
                    _fileName = lyr.fileName;
                    idx = index;
                    return;
                }
            });
            var _layer = self.view.map.findLayerById(layerID);
            // self.view.goTo(_layer.fullExtent.center);
            var _layers = new Array();
            _layers.push(_layer);
            self.view.map.removeMany(_layers);
            // Remove the deleted layer from the array and DIV.
            let _layerDivID = `${lyrName}_divID`;
            let _layerDiv = document.getElementById(_layerDivID);
            resultsDiv_node.removeChild(_layerDiv);
            addedLayers.splice(idx, 1);
            // User confirmation message.
            fileInfo_node.innerHTML = `${t9n.addFileInfoRemoved} ${_fileName}`;
            if (addedLayers.length === 0) {
                // Hide the results div
                resultsDiv_node.classList.add(css.default.widget_addlayer_visible__none);
            }
        });
        layerDiv.appendChild(layerLabel);
        buttonDiv.appendChild(layerZoomButton);
        buttonDiv.appendChild(layerRemoveButton);
        buttonWrapperDiv.appendChild(buttonDiv);
        layerDiv.appendChild(buttonWrapperDiv);
        resultsDiv_node.appendChild(layerDiv);
    }
};
__decorate([
    property()
], AddLayer.prototype, "view", void 0);
__decorate([
    property()
], AddLayer.prototype, "generateURL", void 0);
__decorate([
    property()
], AddLayer.prototype, "rootFocusElement", void 0);
__decorate([
    property()
], AddLayer.prototype, "theme", void 0);
AddLayer = __decorate([
    subclass("esri.widgets.addlayer")
], AddLayer);
export default AddLayer;
//# sourceMappingURL=AddLayer.js.map