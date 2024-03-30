import { environment } from "../../../environments/environment";

const apiPath = environment.apiPath;

export const APIConstant = {
    basePath: apiPath,
    lookup: `/lookup/`,
    plant: `v1/plant/search`,
    plantData : `v1/plant/`,
    updatePlant : `v1/plant/update/`,
    pointCharge: `v1/2/point-charge/search`,
    vendors: `v1/vendor/search/`,
    vendorData: `v1/vendor/`,
    updateVendor: `v1/vendor/update/`,
    parts : `v1/part/search`,
    partData : `v1/part/`,
    updatePart : `v1/part/update/`,
    createPart : `v1/part/create`,
    transactionTypes : `v1/transaction-type/search`,
    transactionTypeData : `v1/transaction-type/`,
    updateTransactionTypeData : `v1/transaction-type/update/`
}
