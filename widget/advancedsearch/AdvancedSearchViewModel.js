import FeatureTable from "@arcgis/core/widgets/FeatureTable";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import FeatureSet from "@arcgis/core/rest/support/FeatureSet";
import Collection from "@arcgis/core/core/Collection";
import Query from "@arcgis/core/rest/support/Query";
import Geometry from "@arcgis/core/geometry/Geometry";
import * as geometryEngineAsync from "@arcgis/core/geometry/geometryEngineAsync";
import * as projection from "@arcgis/core/geometry/projection";
import { FeatureLayerReferences, SearchFieldSelectObjects, SelectObject } from "../class/_AdvancedSearch";
import { tsx } from "@arcgis/core/widgets/support/widget";
import { _locale, t9n, selectTypeOptions, elementIDs, postFixes, featureLayerArray } from "./AdvancedSearch";
import { getNormalizedLocale } from '@dnrr_fd/util/locale';
import * as css from './assets/css/advancedsearch.module.css';
const flIDsArray = new Array();
export const featureLayerReferences = new Array();
export let currentSearchLayerIndex = -1;
export function setCurrentSearchLayerIndex(idx) {
    currentSearchLayerIndex = idx;
}
export function initializeFeatureTable(view, container_node, resultsTable, _featureLayer = undefined, hiddenFields = new Collection()) {
    // Prepare the results table
    if (resultsTable) {
        resultsTable.destroy();
    }
    resultsTable = new FeatureTable({
        view: view,
        layer: _featureLayer,
        container: container_node,
        hiddenFields: hiddenFields,
        highlightEnabled: true
    });
    resultsTable.highlightIds.on("change", (event) => {
        console.log("features selected", event.added);
        console.log("features deselected", event.removed);
    });
    return resultsTable;
}
function keywordReplace(searchString, searchKeyword, replacementValue) {
    const searchStringUpper = searchString.toUpperCase();
    const searchKeywordUpper = searchKeyword.toUpperCase();
    let idx = searchStringUpper.indexOf(searchKeywordUpper, 0);
    const idxArray = new Array();
    while (idx >= 0) {
        idxArray.push(idx);
        idx = searchStringUpper.indexOf(searchKeywordUpper, idx + 1);
    }
    let sqlText_tmp = searchString;
    if (idxArray.length > 0) {
        let pos = 0;
        idxArray.forEach(idx => {
            sqlText_tmp = `${sqlText_tmp.slice(pos, idx)}${replacementValue}${sqlText_tmp.slice(idx + searchKeywordUpper.length, searchStringUpper.length)}`;
            pos = idx + searchKeywordUpper.length;
        });
    }
    return sqlText_tmp;
}
export function setSearchFieldsVisibility() {
    const searchLayer_node = document.getElementById(elementIDs.advancedsearch_CommonBarSearchLayerID);
    const options = searchLayer_node.options;
    for (let i = 0; i < options.length; i++) {
        const searchFields_node = document.getElementById(`${options[i].value}${postFixes.layerDivID}`);
        if (options[i].value === searchLayer_node.value) {
            if (searchFields_node.classList.contains(css.default.widget_advancedsearch_visible__none)) {
                searchFields_node.classList.remove(css.default.widget_advancedsearch_visible__none);
            }
        }
        else {
            if (searchFields_node.classList.contains(css.default.widget_advancedsearch_visible__none) === false) {
                searchFields_node.classList.add(css.default.widget_advancedsearch_visible__none);
            }
        }
    }
    console.log(`Search Layer: ${searchLayer_node.value}`);
}
async function aslAsyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        // console.log("Promise: callback()");
        await callback(array[index], index, array);
    }
}
async function featuresAsyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        // console.log("Promise: callback()");
        await callback(array[index], index, array);
    }
}
export async function processFSOArray(layers) {
    return new Promise(async (resolve) => {
        const _locale = getNormalizedLocale();
        const _searchFieldSOA = new Array();
        aslAsyncForEach(layers, async (layer) => {
            const fl = new FeatureLayer({
                title: `${layer.searchlayerlabel[_locale]}`,
                url: layer.url
            });
            await loadFSOArray(fl, layer).then(_searchFieldSelectObjects => {
                _searchFieldSOA.push(_searchFieldSelectObjects);
            });
        }).then(() => {
            resolve(_searchFieldSOA);
        });
    });
    async function asfAsyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            // console.log("Promise: callback()");
            await callback(array[index], index, array);
        }
    }
    async function loadFSOArray(fl, layer) {
        return new Promise(async (resolve) => {
            await fl.load().then(function () {
                const _selectObjects = new Array();
                asfAsyncForEach(layer.searchfields, async (searchField) => {
                    await createSelectOptions(searchField, fl).then(_selectObject => {
                        _selectObjects.push(_selectObject);
                    });
                }).then(function () {
                    const _searchFieldSelectObjects = new SearchFieldSelectObjects({
                        layerID: layer.id,
                        selectObjects: _selectObjects
                    });
                    resolve(_searchFieldSelectObjects);
                });
            }).catch(error => {
                alert(`Error initializing layer in configuration: ${error}`);
            });
        });
    }
    async function createSelectOptions(searchField, fl) {
        return new Promise(async (resolve) => {
            let _selectOptions = new Array();
            const _selectObject = new SelectObject();
            _selectObject.fieldID = searchField.field ? searchField.field : "";
            _selectObject.fieldType = searchField.fieldtype ? searchField.fieldtype : "string";
            _selectObject.sqlText = searchField.sqltext ? searchField.sqltext : "1=1";
            _selectObject.operator = searchField.operator ? searchField.operator : "AND";
            _selectObject.required = searchField.required ? searchField.required : false;
            if (_selectObject.fieldID != "") {
                if (searchField.userlist && searchField.userlist.length > 0) {
                    _selectOptions = searchField.userlist.map(item => tsx("option", { key: `${item.replace(' ', '')}_key`, "data-value": item, value: item, selected: searchField.defaultvalue ? item === searchField.defaultvalue ? true : false : false }, item));
                    _selectObject.options = _selectOptions;
                    resolve(_selectObject);
                }
                else {
                    // See if the field has a coded value domain
                    const _field = fl.getField(searchField.field);
                    if (_field.domain && _field.domain.type === "coded-value") {
                        _selectOptions = _field.domain.codedValues.map(codedValue => tsx("option", { key: `${codedValue.code}_key`, "data-value": codedValue.code.toString(), value: codedValue.name, selected: searchField.defaultvalue ? codedValue.code === searchField.defaultvalue ? true : false : false }, codedValue.name));
                        _selectObject.options = _selectOptions;
                        resolve(_selectObject);
                    }
                    else if (searchField.usedistinctvalues && searchField.usedistinctvalues === true) {
                        // Perform the query on the feature layer to get the distinct results
                        const featureQuery = new Query({
                            where: "1=1",
                            outFields: [searchField.field],
                            returnDistinctValues: true,
                            returnGeometry: false
                        });
                        await queryFeatureLayer(fl, featureQuery).then(function (results) {
                            _selectOptions = results.map(item => tsx("option", { key: `${item.replace(' ', '')}_key`, "data-value": item, value: item, selected: searchField.defaultvalue ? item === searchField.defaultvalue ? true : false : false }, item));
                            _selectObject.options = _selectOptions;
                            resolve(_selectObject);
                        });
                    }
                    else {
                        // pass
                        _selectObject.options = _selectOptions;
                        resolve(_selectObject);
                    }
                }
            }
        });
    }
    async function queryFeatureLayer(fl, featureQuery) {
        return new Promise(async (resolve) => {
            fl.queryFeatures(featureQuery).then(function (results) {
                resolve(results.features.map(feature => { return feature.attributes[featureQuery.outFields[0]]; }).sort());
            }).catch(error => {
                alert(`Feature Layer ${fl.title} contains no records!: ${error}`);
            });
        });
    }
}
async function returnFeatureSetWithinExtent(featureSet, extent = null) {
    return new Promise(async (resolve) => {
        if (extent) {
            const result = new FeatureSet({
                spatialReference: featureSet.spatialReference,
                geometryType: featureSet.geometryType,
                displayFieldName: featureSet.displayFieldName,
                fields: featureSet.fields
            });
            featuresAsyncForEach(featureSet.features, async (feature) => {
                const testFeature = feature;
                if (testFeature.geometry.extent.spatialReference != extent.spatialReference) {
                    const geometry = projection.project(testFeature.geometry, extent.spatialReference);
                    if (Array.isArray(geometry) === true) {
                        let geom = new Array;
                        geom = geometry;
                        if (geom.find(g => g instanceof Geometry)) {
                            testFeature.geometry = await geometryEngineAsync.union(geometry);
                        }
                        else {
                            throw (`Geometry array object is in an invalid format! ${geometry}`);
                        }
                    }
                    else {
                        testFeature.geometry = geometry;
                    }
                }
                if (extent.contains(testFeature.geometry.extent)) {
                    result.features.push(testFeature);
                }
            }).then(() => {
                resolve(result);
            });
        }
        else {
            resolve(featureSet);
        }
    });
}
async function returnFeatureOIDs(featureSet, extent = null) {
    return new Promise(async (resolve) => {
        const result = new Collection();
        featuresAsyncForEach(featureSet.features, async (feature) => {
            const testFeature = feature;
            if (extent) {
                if (testFeature.geometry.extent.spatialReference != extent.spatialReference) {
                    const geometry = projection.project(testFeature.geometry, extent.spatialReference);
                    if (Array.isArray(geometry) === true) {
                        let geom = new Array;
                        geom = geometry;
                        if (geom.find(g => g instanceof Geometry)) {
                            testFeature.geometry = await geometryEngineAsync.union(geometry);
                        }
                        else {
                            throw (`Geometry array object is in an invalid format! ${geometry}`);
                        }
                    }
                    else {
                        testFeature.geometry = geometry;
                    }
                }
                if (extent.contains(testFeature.geometry.extent)) {
                    result.add(testFeature.getObjectId());
                }
            }
            else {
                result.add(feature.getObjectId());
            }
        }).then(() => {
            resolve(result);
        });
    });
}
async function getFeatureSetUsingSQLandExtent(sqlText, layer, viewExtent, featureTable) {
    return new Promise(async (resolve) => {
        let extent;
        const extentCheckbox_node = document.getElementById(elementIDs.advancedsearch_ByValueResultsExtentCheckboxID);
        let ftOidArray;
        let afSqlWhere = "";
        let afFeatureSet;
        // SEE IF THERE ARE EXISTING FEATURES IN THE FEATURE TABLE.
        let lyrID;
        const result = getLayerID(layer, postFixes.featureLayerID);
        if (typeof result === "string") {
            lyrID = result;
        }
        else {
            lyrID = result[result.indexOf(featureLayerArray[currentSearchLayerIndex].id)];
        }
        if (currentSearchLayerIndex > -1 && featureLayerArray[currentSearchLayerIndex].id === lyrID) {
            featureTable.activeFilters.forEach(af => {
                if (af.type === "selection") {
                    const afSelection = af;
                    console.log(afSelection);
                    ftOidArray = afSelection.objectIds;
                    console.log(ftOidArray);
                }
            });
        }
        // Start with the definition query formed by the Field DDLs
        const queryFL = new FeatureLayer({
            url: layer.url
        });
        queryFL.load().then(async () => {
            if (ftOidArray) {
                afSqlWhere = buildSQLText(queryFL.objectIdField, ftOidArray);
                const afQuery = new Query({
                    where: afSqlWhere,
                    outFields: [queryFL.objectIdField],
                    returnGeometry: true
                });
                afFeatureSet = await queryFL.queryFeatures(afQuery);
            }
            const query = new Query({
                where: sqlText,
                outFields: [queryFL.objectIdField],
                returnGeometry: true
            });
            if (extentCheckbox_node.checked === true) {
                extent = viewExtent;
            }
            else {
                extent = queryFL.fullExtent;
            }
            queryFL.queryFeatures(query).then(async (results) => {
                await getResultsFeatureSet(results, extent, afFeatureSet).then(featureSet => {
                    resolve(featureSet);
                });
            });
        });
    });
}
async function getFeatureSetUsingGeometry(_geometry, layer, featureTable) {
    return new Promise(async (resolve) => {
        let ftOidArray;
        let ftSqlWhere = "";
        let ftFeatureSet;
        if (_geometry) {
            // SEE IF THERE ARE EXISTING FEATURES IN THE FEATURE TABLE.
            let lyrID;
            const result = getLayerID(layer, postFixes.featureLayerID);
            if (typeof result === "string") {
                lyrID = result;
            }
            else {
                lyrID = result[result.indexOf(featureLayerArray[currentSearchLayerIndex].id)];
            }
            if (currentSearchLayerIndex > -1 && featureLayerArray[currentSearchLayerIndex].id === lyrID) {
                featureTable.activeFilters.forEach(af => {
                    if (af.type === "selection") {
                        const afSelection = af;
                        console.log(afSelection);
                        ftOidArray = afSelection.objectIds;
                        console.log(ftOidArray);
                    }
                });
            }
            const queryFL = new FeatureLayer({
                url: layer.url,
            });
            queryFL.load().then(async () => {
                if (ftOidArray) {
                    ftSqlWhere = buildSQLText(queryFL.objectIdField, ftOidArray);
                    const afQuery = new Query({
                        where: ftSqlWhere,
                        outFields: [queryFL.objectIdField],
                        returnGeometry: true
                    });
                    ftFeatureSet = await queryFL.queryFeatures(afQuery);
                }
                const query = new Query({
                    geometry: _geometry,
                    outFields: [queryFL.objectIdField],
                    returnGeometry: true
                });
                queryFL.queryFeatures(query).then(async (results) => {
                    await getResultsFeatureSet(results, null, ftFeatureSet).then(featureSet => {
                        resolve(featureSet);
                    });
                });
            });
        }
        else {
            resolve(new FeatureSet());
        }
    });
}
async function getResultsFeatureSet(featureSet, extent, existingFeatureSet) {
    return new Promise(async (resolve) => {
        await returnFeatureSetWithinExtent(featureSet, extent).then(function (results) {
            const selectionType_node = document.getElementById(elementIDs.advancedsearch_CommonBarSelectionTypeID);
            const filteredFeatureSet = getselectionFeatureSet(results, existingFeatureSet, selectionType_node);
            resolve(filteredFeatureSet);
        });
    });
}
function getselectionFeatureSet(_featureSet, _existingFeatureSet, _selectionTypeNode) {
    let efOIDs = new Array();
    if (_existingFeatureSet && (_existingFeatureSet.features.length > 0)) {
        efOIDs = _existingFeatureSet.features.map(graphic => { return graphic.getObjectId(); });
    }
    if (_selectionTypeNode.value === selectTypeOptions.addToSelection) {
        if (_featureSet.features.length > 0 && efOIDs.length > 0) {
            // Concatenate then sort the graphic features
            const concatArray = _featureSet.features.concat(_existingFeatureSet.features);
            // Ascending
            concatArray.sort((a, b) => a.getObjectId() - b.getObjectId());
            // Descending
            // concatArray.sort((a: Graphic, b: Graphic) => b.getObjectId() - a.getObjectId());
            _featureSet.features = concatArray;
        }
        else if (_featureSet.features.length === 0 && efOIDs.length > 0) {
            _featureSet.features = _existingFeatureSet.features;
        }
        else if (_featureSet.features.length > 0 && efOIDs.length === 0) {
            // Pass: _featureSet.features = _featureSet.features;
        }
        else {
            _featureSet.features = new Array();
        }
    }
    else if (_selectionTypeNode.value === selectTypeOptions.removeFromSelection) {
        if (efOIDs.length > 0) {
            const features = _existingFeatureSet.features.map(graphic => { return graphic; });
            for (let idx = 0; idx < _featureSet.features.length; idx++) {
                const gOID = _featureSet.features[idx].getObjectId();
                if (efOIDs.includes(gOID)) {
                    features.splice(idx, 1);
                }
            }
            _featureSet.features = features;
        }
        else {
            _featureSet.features = new Array();
        }
    }
    else if (_selectionTypeNode.value === selectTypeOptions.subsetOfSelection) {
        const features = new Array();
        _featureSet.features.forEach(graphic => {
            const gOID = graphic.getObjectId();
            if (efOIDs.includes(gOID) === true) {
                features.push(graphic);
            }
        });
        _featureSet.features = features;
    }
    else {
        // Pass: Select New is the default. Return the FeatureSet.
    }
    return _featureSet;
}
async function activateFeatureTable(layer, resultsTable, firstResultID, filteringFeatureSet = null) {
    return new Promise(async (resolve) => {
        const zoomToFirstRecordCheckbox_node = document.getElementById(elementIDs.advancedsearch_CommonBarSelectionZoomToFirstRecordCheckboxID);
        const noResultsDiv_node = document.getElementById(elementIDs.advancedsearch_ResultsNoResultsDivID);
        resultsTable.visible = true;
        resultsTable.layer = layer;
        noResultsDiv_node.classList.add(css.default.widget_advancedsearch_visible__none);
        if (filteringFeatureSet) {
            returnFeatureOIDs(filteringFeatureSet).then(OIDs => {
                // Only the filtering features will be displayed in the Feature Table.
                resultsTable.highlightIds = OIDs;
                resultsTable.filterBySelection();
                // Items are selected once filtered so they are removed from selection.
                resultsTable.highlightIds.removeAll();
                if (zoomToFirstRecordCheckbox_node.checked === true && firstResultID) {
                    // let zoomId = new Collection<number>();
                    // zoomId.add(firstResultID);
                    // resultsTable.highlightIds = zoomId;
                    resultsTable.highlightIds.push(firstResultID);
                    console.log(`Selected ID : ${firstResultID}`);
                    resultsTable.zoomToSelection();
                    // zoomId.removeAll();
                    // resultsTable.highlightIds = zoomId;
                    resultsTable.highlightIds.removeAll();
                }
                resolve();
            });
        }
        else {
            if (zoomToFirstRecordCheckbox_node.checked === true && firstResultID) {
                const zoomId = new Collection();
                zoomId.add(firstResultID);
                resultsTable.highlightIds = zoomId;
                console.log(`Selected ID : ${firstResultID}`);
                resultsTable.zoomToSelection();
            }
            resolve();
        }
    });
}
export async function clearFeatureTable(_featureTable) {
    if (_featureTable.layer && _featureTable.layer.fields) {
        const sqlWhere = `${_featureTable.layer.objectIdField} = -9999`;
        const _lyr = _featureTable.layer;
        const emptyLayer = new FeatureLayer({
            url: _lyr.parsedUrl.path,
            definitionExpression: sqlWhere
        });
        _featureTable.layer = emptyLayer;
        _featureTable.highlightIds.removeAll;
        _featureTable.clearSelectionFilter();
        console.log(`Feature Table Selection Filter: ${_featureTable.activeFilters.map(function (af) { return af.objectIds; })}`);
        setCurrentSearchLayerIndex(-1);
    }
    return;
}
function populateDisplayFields(asLayer, fLayer) {
    const _fields = new Array();
    if (asLayer.displayfields) {
        asLayer.displayfields.forEach(displayField => {
            // Check if the user field actually exists.
            const _field = fLayer.getField(displayField.name);
            if (_field) {
                if (displayField.alias && displayField.alias.length > 0) {
                    _field.alias = displayField.alias;
                }
                _fields.push(_field);
            }
        });
    }
    fLayer.outFields = _fields?.map(field => { return field.name; });
    fLayer.fields = _fields;
}
function validateSearchFields(sfso, layer) {
    const validationErrors = new Array();
    sfso.selectObjects.forEach(selectObject => {
        const fieldDiv_node = document.getElementById(`${layer.id}_${selectObject.fieldID}${postFixes.layerFieldDivID}`);
        const field_node = document.getElementById(`${layer.id}_${selectObject.fieldID}${postFixes.layerFieldInputID}`);
        const fieldvalidation_node = document.getElementById(`${layer.id}_${selectObject.fieldID}${postFixes.layerFieldValidationDivID}`);
        const fieldvalidationasterix_node = document.getElementById(`${layer.id}_${selectObject.fieldID}${postFixes.layerFieldValidationAsterixDivID}`);
        let fieldname = selectObject.fieldID;
        if (layer.displayfields) {
            const idx = layer.displayfields.map(function (e) { return e.name; }).indexOf(selectObject.fieldID);
            if (idx > -1 && layer.displayfields[idx].alias) {
                fieldname = layer.displayfields[idx].alias;
            }
        }
        const errorMsg = keywordReplace(t9n.byValueFieldValidationMessage, "[field]", fieldname);
        field_node.setCustomValidity(errorMsg);
        field_node.checkValidity();
        if (field_node.validity.valueMissing) {
            fieldDiv_node.classList.add(css.default.widget_advancedsearch_byvalue_searchfield_fieldsandvalidation__div);
            fieldDiv_node.classList.remove(css.default.widget_advancedsearch_byvalue_searchfield_fieldsnovalidation__div);
            fieldvalidation_node.classList.remove(css.default.widget_advancedsearch_visible__none);
            fieldvalidationasterix_node.classList.remove(css.default.widget_advancedsearch_visible__none);
            fieldvalidation_node.innerHTML = field_node.validationMessage;
            validationErrors.push(field_node.validationMessage);
        }
        else {
            fieldDiv_node.classList.add(css.default.widget_advancedsearch_byvalue_searchfield_fieldsandvalidation__div);
            fieldDiv_node.classList.remove(css.default.widget_advancedsearch_byvalue_searchfield_fieldsandvalidation__div);
            fieldvalidation_node.innerHTML = "";
            fieldvalidation_node.classList.add(css.default.widget_advancedsearch_visible__none);
            fieldvalidationasterix_node.classList.add(css.default.widget_advancedsearch_visible__none);
        }
    });
    return validationErrors;
}
export async function setupFeatureLayer(view, layer, featureLayerID) {
    return new Promise(async (resolve) => {
        let featureLayer = new FeatureLayer();
        const _orderBy = layer.orderbyfields ? layer.orderbyfields : undefined;
        let exactMatchID = null;
        let matchID = null;
        view.map.allLayers.forEach(function (mapLayer) {
            // Check if AS layer is in the map
            if (mapLayer.url && mapLayer.parsedUrl.path.toUpperCase() === layer.url.toUpperCase()) {
                if (featureLayerID === mapLayer.id) {
                    exactMatchID = mapLayer.id;
                }
                else {
                    matchID = mapLayer.id;
                }
            }
        });
        if (exactMatchID === null && matchID === null) {
            // New Layer
            featureLayer.id = featureLayerID;
            featureLayer.url = layer.url;
            featureLayer.title = `${layer.searchlayerlabel[_locale]} [${t9n.label}]`;
            if (typeof _orderBy != "undefined") {
                featureLayer.orderBy = _orderBy;
            }
            await featureLayer.load().then(() => {
                view.map.add(featureLayer);
                flIDsArray.push(featureLayerID);
                featureLayerReferences.push(new FeatureLayerReferences({
                    layerID: featureLayerID,
                    relatedLayerIDs: new Array()
                }));
                featureLayer.when(() => {
                    resolve(featureLayer);
                });
            });
        }
        else if (exactMatchID === null && matchID != null && flIDsArray.includes(matchID) === true) {
            // Match found with different but valid ID
            featureLayer = view.map.allLayers.getItemAt(view.map.allLayers.map(function (lyr) { return lyr.id; }).indexOf(matchID));
            const matchIdx = featureLayerReferences.map(function (lyr) { return lyr.layerID; }).indexOf(matchID);
            featureLayerReferences[matchIdx].relatedLayerIDs.push(featureLayerID);
            const featureLayerIdx = featureLayerReferences.map(function (lyr) { return lyr.layerID; }).indexOf(featureLayerID);
            if (featureLayerIdx > -1) {
                featureLayerReferences[matchIdx].relatedLayerIDs.push(matchID);
            }
            else {
                featureLayerReferences.push(new FeatureLayerReferences({
                    layerID: featureLayerID,
                    relatedLayerIDs: new Array(matchID)
                }));
            }
            resolve(featureLayer);
        }
        else if (exactMatchID === null && matchID != null && flIDsArray.includes(matchID) === false) {
            // Match found with different AND invalid ID
            featureLayer = view.map.allLayers.getItemAt(view.map.allLayers.map(function (lyr) { return lyr.id; }).indexOf(matchID));
            featureLayer.id = featureLayerID;
            featureLayer.title = `${layer.searchlayerlabel[_locale]}`;
            flIDsArray.push(featureLayerID);
            featureLayerReferences.push(new FeatureLayerReferences({
                layerID: featureLayerID,
                relatedLayerIDs: new Array()
            }));
            resolve(featureLayer);
        }
        else if (exactMatchID != null) {
            // Exact match found
            // Layer has not been processed
            if (flIDsArray.includes(exactMatchID) === false) {
                flIDsArray.push(featureLayerID);
                featureLayerReferences.push(new FeatureLayerReferences({
                    layerID: featureLayerID,
                    relatedLayerIDs: new Array()
                }));
            }
            resolve(view.map.allLayers.getItemAt(view.map.allLayers.map(function (lyr) { return lyr.id; }).indexOf(featureLayerID)));
        }
        else {
            // Layer has already been loaded.
            resolve(null);
        }
    });
}
function buildSQLTextFromSearchFields(sfso, layer, replacementKeyword = "[VALUE]") {
    let sqlText = "";
    sfso.selectObjects.forEach(selectObject => {
        selectObject.sqlText;
        const field_node = document.getElementById(`${layer.id}_${selectObject.fieldID}${postFixes.layerFieldHiddenInputID}`);
        if (selectObject.sqlText === "1=1") {
            if (sqlText === "") {
                if (selectObject.fieldType && selectObject.fieldType === "number") {
                    sqlText += `${selectObject.fieldID} = ${field_node.value}`;
                }
                else {
                    sqlText += `${selectObject.fieldID} = '${field_node.value}'`;
                }
            }
            else {
                if (selectObject.fieldType && selectObject.fieldType === "number") {
                    sqlText += ` ${selectObject.operator} ${selectObject.fieldID} = ${field_node.value}`;
                }
                else {
                    sqlText += ` ${selectObject.operator} ${selectObject.fieldID} = '${field_node.value}'`;
                }
            }
        }
        else {
            const sqlText_tmp = keywordReplace(selectObject.sqlText, replacementKeyword, field_node.value);
            if (sqlText === "") {
                sqlText += `${sqlText_tmp}`;
            }
            else {
                sqlText += ` ${selectObject.operator} ${sqlText_tmp}`;
            }
        }
    });
    console.log(`SQLText: ${sqlText}`);
    return sqlText;
}
export function buildSQLText(field, collectionOrArray) {
    let sqlOIDs;
    if (collectionOrArray instanceof Collection === true) {
        let coll = new Collection;
        coll = collectionOrArray;
        if (coll.find(c => (typeof c === "string"))) {
            sqlOIDs = `${field.toLowerCase()} IN (${collectionOrArray.map(item => { return `'${item}'`; }).join(",")})`;
        }
        else {
            sqlOIDs = `${field.toLowerCase()} IN (${collectionOrArray.join(",")})`;
        }
    }
    else if (Array.isArray(collectionOrArray) === true) {
        let arr = new Array;
        arr = collectionOrArray;
        if (arr.find(a => (typeof a === "string"))) {
            sqlOIDs = `${field.toLowerCase()} IN (${collectionOrArray.map(item => { return `'${item}'`; }).join(",")})`;
        }
        else {
            sqlOIDs = `${field.toLowerCase()} IN (${collectionOrArray.join(",")})`;
        }
    }
    else {
        throw (`Object is invalid (collectionOrArray): ${collectionOrArray}`);
    }
    // if ((collectionOrArray instanceof Collection<number>) === true || (collectionOrArray instanceof Array<Number>) === true || (collectionOrArray instanceof Array<number>) === true) {
    //   sqlOIDs = `${field.toLowerCase()} IN (${collectionOrArray.join(",")})`;
    // } else {
    //   sqlOIDs = `${field.toLowerCase()} IN (${collectionOrArray.map(item => {return `'${item}'`}).join(",")})`;
    // }
    return sqlOIDs;
}
export async function sqlFromFeatureSet(field, _featureSet) {
    return new Promise(async (resolve) => {
        let sqlWhere = "";
        returnFeatureOIDs(_featureSet).then(collection => {
            if (collection instanceof Collection === true) {
                let coll = new Collection;
                coll = collection;
                if (coll.find(c => (typeof c === "string"))) {
                    sqlWhere = `${field.toLowerCase()} IN (${collection.map(item => { return `'${item}'`; }).join(",")})`;
                }
                else {
                    sqlWhere = `${field.toLowerCase()} IN (${collection.join(",")})`;
                }
            }
            else {
                throw (`Object is invalid (collection): ${collection}`);
            }
            // if ((collection instanceof Collection<number>) === true) {
            //   sqlWhere = `${field.toLowerCase()} IN (${collection.join(",")})`;
            // } else {
            //   sqlWhere = `${field.toLowerCase()} IN (${collection.map(item => {return `'${item}'`}).join(",")})`;
            // }
            resolve(sqlWhere);
        });
    });
}
export function filterFeatureTableByFeatureSet(_featureTable, filteringFeatureSet) {
    returnFeatureOIDs(filteringFeatureSet).then(OIDs => {
        _featureTable.highlightIds = OIDs;
        _featureTable.filterBySelection();
        _featureTable.highlightIds.removeAll();
    });
}
export async function selectFeatures(view, layers, searchFieldSelectObjectsArray, resultsTable) {
    return new Promise(async (resolve) => {
        const searchLayer_node = document.getElementById(elementIDs.advancedsearch_CommonBarSearchLayerID);
        const layer = layers[layers.map(function (e) { return e.id; }).indexOf(searchLayer_node.value)];
        if (layer.id === searchLayer_node.value) {
            // Create the SQL definition query based on the config and user input.
            const sfso = searchFieldSelectObjectsArray[searchFieldSelectObjectsArray.map(function (e) { return e.layerID; }).indexOf(layer.id)];
            // Validation
            const validationErrors = validateSearchFields(sfso, layer);
            if (validationErrors.length > 0) {
                resolve(null);
            }
            else {
                // Build the SQL query.
                const sqlText = buildSQLTextFromSearchFields(sfso, layer);
                const asID = `${layer.id}${postFixes.featureLayerID}`;
                getFeatureSetUsingSQLandExtent(sqlText, layer, view.extent, resultsTable).then(async (filteringFeatureSet) => {
                    console.log(`Results returned: ${filteringFeatureSet.features.length}`);
                    let featureLayer;
                    let idx = featureLayerArray.map(function (fl) { return fl.id.toLowerCase(); }).indexOf(asID.toLowerCase());
                    // Check to see if the layers were loaded on startup.
                    if (idx != -1) {
                        featureLayer = featureLayerArray[idx];
                    }
                    else {
                        featureLayer = await setupFeatureLayer(view, layer, asID);
                        console.log(`featureLayerReferences - selectFeatures(): ${featureLayerReferences}`);
                        if (featureLayer != null) {
                            featureLayerArray.push(featureLayer);
                            idx = featureLayerArray.length - 1;
                        }
                    }
                    if (featureLayer != null) {
                        populateDisplayFields(layer, featureLayer);
                        if (filteringFeatureSet.features.length > 0) {
                            activateFeatureTable(featureLayer, resultsTable, filteringFeatureSet.features[0].getObjectId(), filteringFeatureSet).then(() => {
                                setCurrentSearchLayerIndex(idx);
                                if (featureLayer != null) {
                                    resolve({ layerID: layer.id, layerTitle: featureLayer.title, resultsCount: filteringFeatureSet.features.length });
                                }
                            });
                        }
                        else {
                            // Empty out the featureTable
                            clearFeatureTable(resultsTable);
                            setCurrentSearchLayerIndex(idx);
                            resolve({ layerID: layer.id, layerTitle: featureLayer.title, resultsCount: filteringFeatureSet.features.length });
                        }
                    }
                    else {
                        throw (`Layer ${layer.id} returned ${featureLayer}`);
                    }
                });
            }
        }
    });
}
export async function selectFeaturesUsingGeometry(view, layers, geometry, resultsTable) {
    return new Promise(async (resolve) => {
        const searchLayer_node = document.getElementById(elementIDs.advancedsearch_CommonBarSearchLayerID);
        const layer = layers[layers.map(function (e) { return e.id; }).indexOf(searchLayer_node.value)];
        if (layer.id === searchLayer_node.value) {
            // Build the SQL query.
            const asID = `${layer.id}${postFixes.featureLayerID}`;
            getFeatureSetUsingGeometry(geometry, layer, resultsTable).then(async (filteringFeatureSet) => {
                console.log(`Results returned: ${filteringFeatureSet.features.length}`);
                console.log(filteringFeatureSet.features.map(graphic => { return graphic.getObjectId(); }));
                let featureLayer;
                let idx = featureLayerArray.map(function (fl) { return fl.id.toLowerCase(); }).indexOf(asID.toLowerCase());
                // Check to see if the layers were loaded on startup.
                if (idx != -1) {
                    featureLayer = featureLayerArray[idx];
                }
                else {
                    featureLayer = await setupFeatureLayer(view, layer, asID);
                    console.log(`featureLayerReferences - selectFeaturesUsingGeometry(): ${featureLayerReferences}`);
                    if (featureLayer != null) {
                        featureLayerArray.push(featureLayer);
                        idx = featureLayerArray.length - 1;
                    }
                }
                if (featureLayer != null) {
                    populateDisplayFields(layer, featureLayer);
                    if (filteringFeatureSet.features.length > 0) {
                        activateFeatureTable(featureLayer, resultsTable, filteringFeatureSet.features[0].getObjectId(), filteringFeatureSet).then(() => {
                            setCurrentSearchLayerIndex(idx);
                            if (featureLayer != null) {
                                resolve({ layerID: layer.id, layerTitle: featureLayer.title, resultsCount: filteringFeatureSet.features.length });
                            }
                        });
                    }
                    else {
                        // Empty out the featureTable
                        clearFeatureTable(resultsTable);
                        setCurrentSearchLayerIndex(idx);
                        resolve({ layerID: layer.id, layerTitle: featureLayer.title, resultsCount: filteringFeatureSet.features.length });
                    }
                }
                else {
                    throw (`Layer ${layer.id} returned ${featureLayer}`);
                }
            });
        }
    });
}
function getLayerID(layer, layerPostfix) {
    const lyrID = `${layer.id}${layerPostfix}`;
    // Use featureLayerReferences to check for related layers in featureLayerArray
    if (featureLayerArray[currentSearchLayerIndex].id != lyrID) {
        const flrIdx = featureLayerReferences.map(flr => { return flr.layerID; }).indexOf(lyrID);
        if (flrIdx > -1 && featureLayerReferences[flrIdx].relatedLayerIDs.length > 0 && featureLayerReferences[flrIdx].relatedLayerIDs.includes(featureLayerArray[currentSearchLayerIndex].id)) {
            // let rlIDs = featureLayerReferences[flrIdx].relatedLayerIDs;
            // let rlIdIdx = rlIDs.indexOf(featureLayerArray[currentSearchLayerIndex].id);
            // lyrID = rlIDs[rlIdIdx];
            return featureLayerReferences[flrIdx].relatedLayerIDs;
        }
    }
    return lyrID;
}
//# sourceMappingURL=AdvancedSearchViewModel.js.map