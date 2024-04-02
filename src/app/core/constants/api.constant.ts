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
    lookupdata: `v1/lookup/`,
    createPart : `v1/part/create`,
    transactionTypes : `v1/transaction-type/search`,
    transactionTypeData : `v1/transaction-type/`,
    updateTransactionTypeData : `v1/transaction-type/update/`,
    getLookupData : `v1/lookup/search`,
}

export const freight = (locationId:any) => `v1/${locationId}/freight/search`;
export const freightData = (locationId:any, freightId:any) => `v1/${locationId}/freight/${freightId}`;
export const createFreight = (locationId:any) => `v1/${locationId}/freight/create`;
export const updateFreight = (locationId:any, freightId : any) => `v1/${locationId}/freight/update/${freightId}`;
export const plantData = (locationId:any, plantId : any) => `v1/${locationId}/plant/${plantId}`;
export const plant = (locationId:any) => `v1/${locationId}/plant/search`;
export const updatePlant = (locationId:any, plantId : any) => `v1/${locationId}/plant/update/${plantId}`;
export const pointCharge = (locationId:any) => `v1/${locationId}/point-charge/search`;
export const pointChargeData = (locationId:any, pointChargeId:any) => `v1/${locationId}/point-charge/${pointChargeId}`;
export const createPointCharge = (locationId:any) => `v1/${locationId}/point-charge/create`;
export const updatePointCharge = (locationId:any, pointChargeId : any) => `v1/${locationId}/point-charge/update/${pointChargeId}`;