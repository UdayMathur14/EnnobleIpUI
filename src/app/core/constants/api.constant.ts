import { environment } from "../../../environments/environment";

const apiPath = environment.apiPath;

export const APIConstant = {
    basePath: apiPath,
    lookup: `/lookup/`,
    plant: `v1/plant/search`,
    plantData : `v1/plant/`,
    updatePlant : `v1/plant/update/`,
    vendor: `v1/vendor/search/`,
    vendorData: `v1/vendor/`,
    updateVendor: `v1/vendor/update/`,
}