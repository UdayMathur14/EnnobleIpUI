import { environment } from "../../../environments/environment";

const apiPath = environment.apiPath;
const umsURL = environment.umsURL;
const mfgURL = environment.mfgURL;
const svcURL = environment.svcURL;
const gtmURL = environment.gtmURL;

export const APIConstant = {
    basePath: apiPath,
    Ums: umsURL,
    Mfg: mfgURL,
    Svc: svcURL,
    Gtm: gtmURL,
    fetchPermissions: `api/v1/auth/fetch-permissions`,
    lookup: `/lookup/`,
    plant: `v1/plant/search`,
    plantData: `v1/plant/`,
    updatePlant: `v1/plant/update/`,
    pointCharge: `v1/2/point-charge/search`,
    vendors: `v1/vendor/search/`,
    vendorData: `v1/vendor/`,
    updateVendor: `v1/vendor/update/`,
    parts: `v1/part/search`,
    partData: `v1/part/`,
    updatePart: `v1/part/update/`,
    lookups: `v1/lookup/search`,
    lookupData: `v1/lookup/`,
    updateLookup: `v1/lookup/update/`,
    createLookup: `v1/lookup/create`,
    lookupstype: `v1/lookup-type/search`,
    lookuptypeData: `v1/lookup-type/`,
    updatelookuptype: `v1/lookup-type/update/`,
    createlookuptype: `v1/lookup-type/create`,
    createPart: `v1/part/create`,
    transactionTypes: `v1/transaction-type/search`,
    transactionTypeData: `v1/transaction-type/`,
    updateTransactionTypeData: `v1/transaction-type/update/`,
    getLookupData: `v1/lookup/search`,
    getDropdownData: `v1/lookup/search-type?type=`
}

export const freight = (locationId: any) => `v1/${locationId}/freight/search`;
export const freightData = (locationId: any, freightId: any) => `v1/${locationId}/freight/${freightId}`;
export const createFreight = (locationId: any) => `v1/${locationId}/freight/create`;
export const updateFreight = (locationId: any, freightId: any) => `v1/${locationId}/freight/update/${freightId}`;
export const plantData = (locationId: any, plantId: any) => `v1/${locationId}/plant/${plantId}`;
export const plant = (locationId: any) => `v1/${locationId}/plant/search`;
export const updatePlant = (locationId: any, plantId: any) => `v1/${locationId}/plant/update/${plantId}`;
export const vehicle = (locationId: any) => `v1/${locationId}/vehicle/search`;
export const vehicleData = (locationId: any, vehicleId: any) => `v1/${locationId}/vehicle/${vehicleId}`;
export const createVehicle = (locationId: any) => `v1/${locationId}/vehicle/create`;
export const updateVehicle = (locationId: any, vehicleId: any) => `v1/${locationId}/vehicle/update/${vehicleId}`;
export const pointCharge = (locationId: any) => `v1/${locationId}/point-charge/search`;
export const pointChargeData = (locationId: any, pointChargeId: any) => `v1/${locationId}/point-charge/${pointChargeId}`;
export const createPointCharge = (locationId: any) => `v1/${locationId}/point-charge/create`;
export const updatePointCharge = (locationId: any, pointChargeId: any) => `v1/${locationId}/point-charge/update/${pointChargeId}`;
export const adviceTypeData = (locationId: any, adviceId: any) => `v1/${locationId}/advice/${adviceId}`;
export const adviceType = (locationId: any) => `v1/${locationId}/advice/search`;
export const updateAdviceType = (locationId: any, adviceId: any) => `v1/${locationId}/advice/update/${adviceId}`;
export const createAdviceType = (locationId: any) => `v1/${locationId}/advice/create`;
export const transporter = (locationId: any) => `v1/${locationId}/transporter/search`;
export const transporterData = (locationId: any, transporterId: any) => `v1/${locationId}/transporter/${transporterId}`;
export const updateTransporter = (locationId: any, transporterId: any) => `v1/${locationId}/transporter/update/${transporterId}`;