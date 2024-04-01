import { environment } from "../../../environments/environment";

const apiPath = environment.apiPath;

export const APIConstant = {
    basePath: apiPath,
    lookup: `/lookup/`,
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
    updateTransactionTypeData : `v1/transaction-type/update/`,
    getLookupData : `v1/lookup/search`
}

export const freight = (locationId:any) => `v1/${locationId}/freight/search`;
export const freightData = (locationId:any, freightId:any) => `v1/${locationId}/freight/${freightId}`;
export const createFreight = (locationId:any) => `v1/${locationId}/freight/create`;
export const updateFreight = (locationId:any, freightId : any) => `v1/${locationId}/freight/update/${freightId}`;
export const plantData = (locationId:any, plantId : any) => `v1/${locationId}/plant/${plantId}`;
export const plant = (locationId:any) => `v1/${locationId}/plant/search`;
export const updatePlant = (locationId:any, plantId : any) => `v1/${locationId}/plant/update/${plantId}`;
