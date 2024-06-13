import { environment } from "../../../environments/environment";

const apiPath = environment.apiPath;
const umsURL = environment.umsURL;
const mfgURL = environment.mfgURL;
const svcURL = environment.svcURL;
const gtmURL = environment.gtmURL;
const commonURL = environment.commonAPI;

export const APIConstant:any = {
    basePath: apiPath,
    appSlug : `Mfg`,
    Ums: umsURL,
    Mfg: mfgURL,
    Svc: svcURL,
    Gtm: gtmURL,
    commonURL:commonURL,
    locationsListDropdown:[],
    generateToken:(appId:string)=> `api/v1/login/generate-token/${appId}`,
    lookup: `/lookup/`,
    plant: `v1/plant/search`,
    plantData: `v1/plant/`,
    updatePlant: `v1/plant/update/`,
    pointCharge: `v1/point-charge/search`,
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
    createPart: `v1/part/create`,
    transactionTypes: `v1/transaction-type/search`,
    transactionTypeData: `v1/transaction-type/`,
    updateTransactionTypeData: `v1/transaction-type/update/`,
    getLookupData: `v1/lookup/search`,
    transactionTypeInterfaces: `v1/transactiontypeinterface/search`,
}

export const freight = `v1/freight/search`;
export const freightData = (locationId: any, freightId: any) => `v1/freight/${locationId}/${freightId}`;
export const createFreight = (locationId: any) => `v1/freight/create/${locationId}`;
export const updateFreight = (locationId: any, freightId: any) => `v1/freight/update/${locationId}/${freightId}`;
export const plantData = (locationId: any, plantId: any) => `v1/plant/${locationId}/${plantId}`;
export const plant = (locationId: any) => `v1/plant/search/${locationId}`;
export const updatePlant = (locationId: any, plantId: any) => `v1/plant/update/${locationId}/${plantId}`;
export const vehicle = `v1/vehicle/search`;
export const vehicleData = (locationId: any, vehicleId: any) => `v1/vehicle/${locationId}/${vehicleId}`;
export const createVehicle = (locationId: any) => `v1/vehicle/create/${locationId}`;
export const updateVehicle = (locationId: any, vehicleId: any) => `v1/vehicle/update/${locationId}/${vehicleId}`;
export const pointCharge = (locationId: any) => `v1/point-charge/search/${locationId}`;
export const pointChargeData = (locationId: any, pointChargeId: any) => `v1/point-charge/${locationId}/${pointChargeId}`;
export const createPointCharge = (locationId: any) => `v1/point-charge/create/${locationId}`;
export const updatePointCharge = (locationId: any, pointChargeId: any) => `v1/point-charge/update/${locationId}/${pointChargeId}`;
export const adviceTypeData = (locationId: any, adviceId: any) => `v1/advice/${locationId}/${adviceId}`;
export const adviceType = `v1/advice/search`;
export const updateAdviceType = (locationId: any, adviceId: any) => `v1/advice/update/${locationId}/${adviceId}`;
export const createAdviceType = (locationId: any) => `v1/advice/create/${locationId}`;
export const transporter = `v1/transporter/search`;
export const transporterData = (locationId: any, transporterId: any) => `v1/transporter/${locationId}/${transporterId}`;
export const updateTransporter = (locationId: any, transporterId: any) => `v1/transporter/update/${locationId}/${transporterId}`;
export const getDropdownDatas= (type: any) => `v1/lookup/search-type?type=${type}`;
export const commonTransaction= (locationId:any, id: any) => `v1/commonTransaction/updateStatus/${locationId}/${id}`;   
export const bilti = `v1/bilti-creation/search`;
export const frlr = (locationId: any) => `v1/frm-transactions/${locationId}/search`;
export const createBilti = (locationId: any) => `v1/bilti-creation/create/${locationId}`;
export const biltiData = (locationId: any, biltiId: any) => `v1/bilti-creation/${locationId}/${biltiId}`;
export const updateBitli = (locationId: any, biltiId: any) => `v1/bilti-creation/update/${locationId}/${biltiId}`;
export const createDispatchNote = (locationId: any) => `v1/dispatch-note/create/${locationId}`;
export const getDispatchNote = `v1/dispatch-note/search`;
export const dispatchData = (locationId: any, dispatchId: any) => `v1/dispatch-note/${locationId}/${dispatchId}`;
export const updateDispatchNote = (locationId: any, dispatchId: any) => `v1/dispatch-note/update/${locationId}/${dispatchId}`;
export const biltiBillProcess = `v1/bilti-process/search`;
export const biltiBillProcessbyId = (locationId:any, biltiProcessId:any) => `v1/bilti-process/${locationId}/${biltiProcessId}`;
export const createBiltiBillProcess = (locationId: any) => `v1/bilti-process/create/${locationId}`;
export const updateBiltiBillProcess = (locationId: any, biltiBillProcessId: any) => `v1/bilti-process/update/${locationId}/${biltiBillProcessId}`
export const updateBiltiStatus= (locationId:any, BatchNumber: any) => `v1/commonTransaction/updateBatchStatus/${locationId}/${BatchNumber}`; 
export const changeBiltiStatus = (locationId: any) => `v1/bilti-bill-change-status/update/${locationId}`; 
export const getNocPdf = (locationId: any, id: number) => `v1/bilti-bill-change-status/${locationId}/${id}`;