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
    commonLocationsList:[],
    generateToken:(appId:string)=> `api/v1/login/generate-token/${appId}`,
    lookup: `/lookup/`,
    plantData: `v1/plant/`,
    updatePlant: `v1/plant/update/`,
    vendorData: `v1/vendor/`,
    updateVendor: `v1/vendor/update/`,
    partData: `v1/part/`,
    updatePart: `v1/part/update/`,
    lookupData: `v1/lookup/`,
    updateLookup: `v1/lookup/update/`,
    createLookup: `v1/lookup/create`,
    lookupstype: `v1/lookup-type/search`,
    createPart: `v1/part/create`,
    transactionTypeData: `v1/transaction-type/`,
    updateTransactionTypeData: `v1/transaction-type/update/`,
    getLookupData: `v1/lookup/search`,
    transactionTypeInterfaces: `v1/transactiontypeinterface/search`,
}

export const freight = (offset: any, count: number) =>`v1/freight/search?offset=${offset}&count=${count}`;
export const freightData = (locationId: any, freightId: any) => `v1/freight/${locationId}/${freightId}`;
export const createFreight = (locationId: any) => `v1/freight/create/${locationId}`;
export const updateFreight = (locationId: any, freightId: any) => `v1/freight/update/${locationId}/${freightId}`;
export const plantData = (plantId: any) => `v1/plant/${plantId}`;
export const plant = (offset: any, count: number) => `v1/plant/search?offset=${offset}&count=${count}`;
export const updatePlant = (locationId: any, plantId: any) => `v1/plant/update/${locationId}/${plantId}`;
export const transactionTypes = (offset: any, count: number) => `v1/transaction-type/search?offset=${offset}&count=${count}`;
export const vendors = (offset: any, count: number) => `v1/vendor/search?offset=${offset}&count=${count}`;
export const lookups = (offset: any, count: number) => `v1/lookup/search?offset=${offset}&count=${count}`;
export const parts = (offset: any, count: number) => `v1/part/search?offset=${offset}&count=${count}`;
export const vehicle = (offset: any, count: number) =>`v1/vehicle/search?offset=${offset}&count=${count}`;
export const vehicleData = (locationId: any, vehicleId: any) => `v1/vehicle/${locationId}/${vehicleId}`;
export const createVehicle = (locationId: any) => `v1/vehicle/create/${locationId}`;
export const updateVehicle = (locationId: any, vehicleId: any) => `v1/vehicle/update/${locationId}/${vehicleId}`;
export const pointCharge = (offset: any, count: number) => `v1/point-charge/search?offset=${offset}&count=${count}`;
export const pointChargeData = (locationId: any, pointChargeId: any) => `v1/point-charge/${locationId}/${pointChargeId}`;
export const createPointCharge = (locationId: any) => `v1/point-charge/create/${locationId}`;
export const updatePointCharge = (locationId: any, pointChargeId: any) => `v1/point-charge/update/${locationId}/${pointChargeId}`;
export const adviceTypeData = (locationId: any, adviceId: any) => `v1/advice/${locationId}/${adviceId}`;
export const adviceType = (offset: any, count: number) => `v1/advice/search?offset=${offset}&count=${count}`;
export const updateAdviceType = (locationId: any, adviceId: any) => `v1/advice/update/${locationId}/${adviceId}`;
export const createAdviceType = (locationId: any) => `v1/advice/create/${locationId}`;
export const transporter = (offset: any, count: number) => `v1/transporter/search?offset=${offset}&count=${count}`;
export const transporterData = (locationId: any, transporterId: any) => `v1/transporter/${locationId}/${transporterId}`;
export const updateTransporter = (locationId: any, transporterId: any) => `v1/transporter/update/${locationId}/${transporterId}`;
export const createTransporter = (locationId: any) => `v1/transporter/create/${locationId}`;
export const getDropdownDatas= (type: any) => `v1/lookup/search-type?type=${type}`;
export const commonTransaction= (locationId:any, id: any) => `v1/commonTransaction/updateStatus/${locationId}/${id}`;   
export const bilti = (offset: any, count: number) => `v1/bilti-creation/search?offset=${offset}&count=${count}`;
export const frlr = (locationId: any) => `v1/frm-transactions/${locationId}/search`;
export const createBilti = (locationId: any) => `v1/bilti-creation/create/${locationId}`;
export const biltiData = (locationId: any, biltiId: any) => `v1/bilti-creation/${locationId}/${biltiId}`;
export const updateBitli = (locationId: any, biltiId: any) => `v1/bilti-creation/update/${locationId}/${biltiId}`;
export const createDispatchNote = (locationId: any) => `v1/dispatch-note/create/${locationId}`;
export const getDispatchNote = (offset: any, count: number) => `v1/dispatch-note/search?offset=${offset}&count=${count}`;
export const dispatchData = (locationId: any, dispatchId: any) => `v1/dispatch-note/${locationId}/${dispatchId}`;
export const updateDispatchNote = (locationId: any, dispatchId: any) => `v1/dispatch-note/update/${locationId}/${dispatchId}`;
export const biltiBillProcess = (offset: any, count: number) => `v1/bilti-process/search?offset=${offset}&count=${count}`;
export const biltiBillProcessbyId = (locationId:any, biltiProcessId:any) => `v1/bilti-process/${locationId}/${biltiProcessId}`;
export const createBiltiBillProcess = (locationId: any) => `v1/bilti-process/create/${locationId}`;
export const updateBiltiBillProcess = (locationId: any, biltiBillProcessId: any) => `v1/bilti-process/update/${locationId}/${biltiBillProcessId}`
export const updateBiltiStatus= (locationId:any, BatchNumber: any) => `v1/commonTransaction/updateBatchStatus/${locationId}/${BatchNumber}`; 
export const changeBiltiStatus = (locationId: any) => `v1/bilti-bill-change-status/update/${locationId}`; 
export const biltiApprovalData = (locationId: any) => `v1/bilti-process/searchApprovalData`; 
export const getNocPdf = (locationId: any, id: number) => `v1/bilti-bill-change-status/${locationId}/${id}`;
export const getOutboundData = (offset: any, count: number) => `v1/apGlOutBound/search?offset=${offset}&count=${count}`;


export const errorLoggingReport = (offset: any, count: number) => `v1/errorLoggingReport/search?offset=${offset}&count=${count}`;
export const debitNoteReport = (offset: any, count: number) => `v1/biltiDebitNoteReport/search?offset=${offset}&count=${count}`;
export const provisionalReport = (offset: any, count: number) => `v1/provisionalReport/search?offset=${offset}&count=${count}`;
export const getAdhocDropdownsData = `v1/adHocReport/get`;
export const generateAdhocData = `v1/adHocReport/search`;
export const apOutboundData = () => `v1/intf/ApHeaderInterfaceTransfer`;
export const glAccrualPosting = (offset: any, count: number) => `v1/glOutBound/search?offset=${offset}&count=${count}`;
export const glOutboundTransfer = () => `v1/intf/GlOutboundTransfer`;
