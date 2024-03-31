import { environment } from "../../../environments/environment";

const apiPath = environment.apiPath;

export const APIConstant = {
    basePath: apiPath,
    lookup: `/lookup/`,
    plant: `v1/plant/search`,
    plantData : `v1/plant/`,
    updatePlant : `v1/plant/update/`,
    vendors: `v1/vendor/search/`,
    vendorData: `v1/vendor/`,
    updateVendor: `v1/vendor/update/`,
    parts : `v1/part/search`,
    partData : `v1/part/`,
    updatePart : `v1/part/update/`,
    lookups: `v1/lookup/search`,
    lookupData: `v1/lookup/`,
    updateLookup: `v1/lookup/update/`,
    createLookup: `v1/lookup/create`,
    lookupstype: `v1/lookup-type/search`
}
