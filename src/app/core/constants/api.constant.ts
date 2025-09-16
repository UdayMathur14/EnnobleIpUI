import { environment } from '../../../environments/environment';

const apiPath = environment.apiPath;
const umsURL = environment.umsURL;
const mfgURL = environment.mfgURL;
const svcURL = environment.svcURL;
const gtmURL = environment.gtmURL;
const commonURL = environment.commonAPI;

export const APIConstant: any = {
  basePath: apiPath,
  appSlug: `Mfg`,
  Ums: umsURL,
  Mfg: mfgURL,
  Svc: svcURL,
  Gtm: gtmURL,
  commonURL: commonURL,
  locationsListDropdown: [],
  commonLocationsList: [],
  generateToken: (appId: string) => `api//login/generate-token/${appId}`,
  lookup: `/lookup/`,
  plantData: `/plant/`,
  updatePlant: `/plant/update/`,
  vendorData: `vendor/`,
  updateVendor: `vendor/update/`,
  customerData: `/search`,
  updateCustomer: `/customer/update/`,
  lookupData: `lookup/`,
  updateLookup: `lookup/update/`,
  createLookup: `lookup/create`,
  createTransporter: `/transporter/create`,
  lookupstype: `lookup/search`,
  createCustomer: `customer/create`,
  transactionTypeData: `bank/`,
  updateTransactionTypeData: `bank/update/`,
  getLookupData: `lookup/search`,
  transactionTypeInterfaces: `bank/create`,
  customer : `customer/`,
  lookUpTypes:'lookup-type/search',
  lookUpType:'lookup-type/search',
  LookupTypeData:'lookup-type',
  createLookupType: `lookup-type/create`,
};

export const freight = (offset: any, count: number) =>
  `/freight/search?offset=${offset}&count=${count}`;
export const freightData = (locationId: any, freightId: any) =>
  `/freight/${locationId}/${freightId}`;
export const createFreight = (locationId: any) =>
  `/freight/create/${locationId}`;
export const updateFreight = (locationId: any, freightId: any) =>
  `/freight/update/${locationId}/${freightId}`;
export const plantData = (plantId: any) => `/plant/${plantId}`;
export const plant = (offset: any, count: number) =>
  `/plant/search?offset=${offset}&count=${count}`;
export const updatePlant = (locationId: any, plantId: any) =>
  `/plant/update/${locationId}/${plantId}`;
export const transactionTypes = (offset: any, count: number) =>
  `bank/search?offset=${offset}&count=${count}`;
export const vendors = (offset: any, count: number) =>
  `vendor/search?offset=${offset}&count=${count}`;
export const lookups = (offset: any, count: number) =>
  `/lookup/search?offset=${offset}&count=${count}`;
export const customers = (offset: any, count: number) =>
  `customer/search?offset=${offset}&count=${count}`;
export const vehicle = (offset: any, count: number) =>
  `/vehicle/search?offset=${offset}&count=${count}`;
export const vehicleData = (locationId: any, vehicleId: any) =>
  `/vehicle/${locationId}/${vehicleId}`;
export const createVehicle = (locationId: any) =>
  `/vehicle/create/${locationId}`;
export const updateVehicle = (locationId: any, vehicleId: any) =>
  `/vehicle/update/${locationId}/${vehicleId}`;
export const pointCharge = (offset: any, count: number) =>
  `/point-charge/search?offset=${offset}&count=${count}`;
export const pointChargeData = (locationId: any, pointChargeId: any) =>
  `/point-charge/${locationId}/${pointChargeId}`;
export const createPointCharge = (locationId: any) =>
  `/point-charge/create/${locationId}`;
export const updatePointCharge = (locationId: any, pointChargeId: any) =>
  `/point-charge/update/${locationId}/${pointChargeId}`;
export const adviceTypeData = (locationId: any, adviceId: any) =>
  `/advice/${locationId}/${adviceId}`;
export const adviceType = (offset: any, count: number) =>
  `/advice/search?offset=${offset}&count=${count}`;
export const updateAdviceType = (locationId: any, adviceId: any) =>
  `/advice/update/${locationId}/${adviceId}`;
export const createAdviceType = (locationId: any) =>
  `/advice/create/${locationId}`;
export const transporter = (offset: any, count: number) =>
  `/transporter/search?offset=${offset}&count=${count}`;
export const transporterData = (transporterId: any) =>
  `/transporter/${transporterId}`;
export const updateTransporter = (transporterId: any) =>
  `/transporter/update/${transporterId}`;
// export const createTransporter = () => `/transporter/create}`;
export const getDropdownDatas = (type: any) =>
  `lookup/type/${type}`;
export const getrbData = (locationId: number) => `/rbDivMst/${locationId}`;
export const createConfiguration = (locationId: number) =>
  `/rbDivMst/create/${locationId}`;
export const updateConfiguration = (locationId: number) =>
  `/rbDivMst/update/${locationId}`;
export const commonTransaction = (locationId: any, id: any) =>
  `/commonTransaction/updateStatus/${locationId}/${id}`;
export const bilti = (offset: any, count: number) =>
  `/bilti-creation/search?offset=${offset}&count=${count}`;
export const frlr = (locationId: any) =>
  `/frm-transactions/${locationId}/search`;
export const createBilti = (locationId: any) =>
  `/bilti-creation/create/${locationId}`;
export const biltiData = (locationId: any, biltiId: any) =>
  `/bilti-creation/${locationId}/${biltiId}`;
export const updateBitli = (locationId: any, biltiId: any) =>
  `/bilti-creation/update/${locationId}/${biltiId}`;
export const createDispatchNote = () =>
  `VendorInvoiceTxn/create/`;
export const getDispatchNote = (offset: any, count: number) =>
  `VendorInvoiceTxn/search?offset=${offset}&count=${count}`;
export const dispatchData = ( dispatchId: any) =>
  `VendorInvoiceTxn/${dispatchId}`;
export const updateDispatchNote = ( dispatchId: any) =>
  `vendorinvoiceTxn/update/${dispatchId}`;
export const biltiBillProcess = (offset: any, count: number) =>
  `/bilti-process/search?offset=${offset}&count=${count}`;
export const biltiBillProcessbyId = (locationId: any, biltiProcessId: any) =>
  `/bilti-process/${locationId}/${biltiProcessId}`;
export const createBiltiBillProcess = (locationId: any) =>
  `/bilti-process/create/${locationId}`;
export const updateBiltiBillProcess = (
  locationId: any,
  biltiBillProcessId: any
) => `/bilti-process/update/${locationId}/${biltiBillProcessId}`;
export const updateBiltiStatus = (locationId: any, BatchNumber: any) =>
  `/commonTransaction/updateBatchStatus/${locationId}/${BatchNumber}`;
export const changeBiltiStatus = (locationId: any) =>
  `/bilti-bill-change-status/update/${locationId}`;
export const biltiApprovalData = (locationId: any) =>
  `/bilti-process/searchApprovalData`;
export const getNocPdf = (locationId: any, id: number) =>
  `/bilti-bill-change-status/${locationId}/${id}`;
export const getOutboundData = (offset: any, count: number) =>
  `/apGlOutBound/search?offset=${offset}&count=${count}`;

export const errorLoggingReport = (offset: any, count: number) =>
  `/errorLoggingReport/search?offset=${offset}&count=${count}`;
export const debitNoteReport = (offset: any, count: number) =>
  `/biltiDebitNoteReport/search?offset=${offset}&count=${count}`;
export const provisionalReport = (offset: any, count: number) =>
  `/provisionalReport/search?offset=${offset}&count=${count}`;
export const getAdhocDropdownsData = `/adHocReport/get`;
export const generateAdhocData = `/adHocReport/search`;
export const apOutboundData = () => `/intf/ApHeaderInterfaceTransfer`;
export const glAccrualPosting = (offset: any, count: number) =>
  `/glOutBound/search?offset=${offset}&count=${count}`;
export const glOutboundTransfer = () => `/intf/GlOutboundTransfer`;
export const freightContract = (locationId: any, freightId: any) =>
  `/freight/contracts/${locationId}/${freightId}`;
export const pointMasterContract = (locationId: any, pointId: any) =>
  `/point-charge/contracts/${locationId}/${pointId}`;
export const calculatePointCharge = () => `/bilti-creation/calculate`;
export const createCustomer = () => `customer/create/`;
export const updateCustomer = (customerId: any) =>
  `customer/update/${customerId}`;
export const customerData = ( customerId: any) =>
  `customer/${customerId}`;
export const createVendors = () => `vendor/create`;
export const LookupTypes = (offset: any, count: number) =>
  `lookup-type/search?offset=${offset}&count=${count}`;
export const countries = (offset: any, count: number) =>
  `country/search?offset=${offset}&count=${count}`;
export const states = (offset: any, count: number) =>
  `state/search?offset=${offset}&count=${count}`;
