export interface AdviceDataModel {
  id: number;
  adviceType: string;
  batchName: string;
  maxBiltiNumber: string;
  manualAllocationRequired: string;
  extraAttr1: string;
  extraAttr2: string;
  extraAttr3: string;
  extraAttr4: string;
  extraAttr5: string;
  extraAttr6: string;
  extraAttr7: string;
  extraAttr8: string;
  extraAttr9: string;
  extraAttr10: string;
  createdBy: string;
  creationDate: string;
  lastUpdatedBy: string;
  lastUpdateOn: string;
  messageStatus: null;
  lookUpEntity: {
    typeId: number;
    code: string;
    value: string;
    description: string;
    lookUpType: string;
    id: number;
    createdBy: number;
    createdOn: string;
    modifiedBy: number;
    modifiedOn: string;
    status: string;
    attribute1?: null;
    attribute2?: null;
    attribute3?: null;
    attribute4?: null;
    attribute5?: 0;
    attribute6: 0;
    attribute7: 0;
    attribute8: 0;
    attribute9: null;
    attribute10: null;
    messageStatus: null;
  };
  status: string;
}

export interface FreightDataModel {
  locationId: number;
  freightCode: string;
  sourceId: number;
  vehicleSizeId: number;
  destinationId: number;
  freightAmount: string;
  remarks: string;
  approvedByMaterial: null;
  approvedByMaterialOn: null;
  approvedByAccounts: null;
  approvedByAccountsOn: null;
  locations: {
    typeId: number;
    code: string;
    value: string;
    description: string;
    lookUpType: null;
    id: number;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
    status: string;
    attribute1: null;
    attribute2: null;
    attribute3: null;
    attribute4: null;
    attribute5: null;
    attribute6: null;
    attribute7: null;
    attribute8: null;
    attribute9: string;
    attribute10: string;
    messageStatus: null;
  };
  source: {
    typeId: number;
    code: string;
    value: string;
    description: string;
    lookUpType: null;
    id: number;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
    status: string;
    attribute1: null;
    attribute2: null;
    attribute3: null;
    attribute4: null;
    attribute5: null;
    attribute6: null;
    attribute7: null;
    attribute8: null;
    attribute9: string;
    attribute10: string;
    messageStatus: null;
  };
  vehicleSize: {
    typeId: number;
    code: string;
    value: string;
    description: string;
    lookUpType: null;
    id: number;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
    status: string;
    attribute1: null;
    attribute2: null;
    attribute3: null;
    attribute4: null;
    attribute5: null;
    attribute6: null;
    attribute7: null;
    attribute8: null;
    attribute9: string;
    attribute10: string;
    messageStatus: null;
  };
  destination: {
    typeId: number;
    code: string;
    value: string;
    description: string;
    lookUpType: null;
    id: number;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
    status: string;
    attribute1: null;
    attribute2: null;
    attribute3: null;
    attribute4: null;
    attribute5: null;
    attribute6: null;
    attribute7: null;
    attribute8: null;
    attribute9: string;
    attribute10: string;
    messageStatus: null;
  };
  id: number;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
  status: string;
  attribute1: null;
  attribute2: null;
  attribute3: null;
  attribute4: null;
  attribute5: null;
  attribute6: null;
  attribute7: null;
  attribute8: null;
  attribute9: string;
  attribute10: string;
  messageStatus: null;
}

export interface LookupTypeDataModel {
  id: number;
  type: string;
  description: string;
  status: string;
  attribute1: null;
  attribute2: null;
  attribute3: null;
  attribute4: null;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
  messageStatus: null;
}

export interface CustomerDataModel {
  id: number;
  customerType: string;
  customerCode: string;
  customerName: string;

  billingAddressLine1?: string;
  billingAddressLine2?: string;
  billingCity?: string;
  billingState?: string;
  billingCountry?: string;
  billingPinCode?: string;

  shippingAddressLine1?: string;
  shippingAddressLine2?: string;
  shippingCity?: string;
  shippingState?: string;
  shippingCountry?: string;
  shippingPinCode?: string;

  contactPersonName?: string;
  designation?: string;

  email?: string;
  mobileNumber?: string;

  currency?: string;
  paymentTerms?: string;

  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
  messageStatus: null;
}
export interface PlantDataModel {
  id: number;
  plantCode: string;
  locations: any;
  plantDesc: string;
  plantAddress: string;
  city: string;
  stateCode: string;
  countryCode: string;
  postalCode: string;
  panNo: string;
  gstnNo: string;
  auCode: string;
  plantType: string;
  siteCode: string;
  dsc: string;
  dcp: string;
  transactionType: string;
  status: string;
  extraAttr1: string;
  extraAttr2: string;
  extraAttr3: string;
  extraAttr4: string;
  extraAttr5: string;
  extraAttr6: string;
  extraAttr7: string;
  extraAttr8: string;
  extraAttr9: string;
  extraAttr10: string;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
  messageStatus: null;
  transactionTypeMapping: [
    {
      id: number;
      status: string;
      attribute1: null;
      attribute2: null;
      attribute3: null;
      attribute4: null;
      txnTypeId: null;
      name: string;
      code: any;
      transactionTypeId: number;
      locations: {
        id: number,
        value: string
      },
      dsc: string,
      dcp: string,
    }
  ];
}

export interface PointChargeDataModel {
  id: number;
  locationId: string;
  pointName: string;
  pointCharge: string;
  sameLocationCharge: string;
  status: string;
  extraAttr1: string;
  extraAttr2: string;
  extraAttr3: string;
  extraAttr4: string;
  extraAttr5: string;
  extraAttr6: string;
  extraAttr7: string;
  extraAttr8: string;
  extraAttr9: string;
  extraAttr10: string;
  createdBy: string;
  creationDate: string;
  lastUpdatedBy: string;
  lastUpdateOn: string;
  approvedByMaterial: string;
  approvedByMaterialOn: string;
  approvedByAccounts: string;
  approvedByAccountsOn: string;
  messageStatus: string;
}

export interface TransactionTypeListModel {
  id: number;
  code: string;
  name: string;
  interfaceTxnTypeId: number;
  glSubCategory: any;
  status: string;
  attribute1: null;
  attribute2: null;
  attribute3: null;
  attribute4: null;
  createdBy: string;
  creationDate: string;
  lastUpdatedBy: string;
  lastUpdateOn: string;
  messageStatus: null;
  transactionTypeInterface: {
    id: number;
    transactionTypeName: string;
    transactionTypeCode: string;
    status: string;
  };
}

export interface VehicleDataModel {
  id: number;
  locationId: number;
  vehicleNumber: string;
  vehicleSizeId: number;
  transporterId: number;
  vehicleCondition: string;
  transporterEntity: {
    locationId: number;
    transporterCode: string;
    transporterName: string;
    transporterAddress1: string;
    transporterAddress2: string;
    city: string;
    stateCode: string;
    countryCode: string;
    postalCode: string;
    panNo: string;
    gstnNo: string;
    transporterPayterm: string;
    transporterPaytermStatus: string;
    transporterContactNo: string;
    transporterMailId: string;
    gstType: string;
    regdDetails: string;
    autoBiltiRequiredFlag: string;
    autoBiltiStartingCharacter: string;
    consignorName: string;
    consignorContactInformation: string;
    biltiHeaderComments: string;
    note: string;
    footer: string;
    inactiveDate: string;
    transporterStatus: string;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
    messageStatus: string;
  };
  remarks: string;
  status: string;
  inactiveDate: string;
  attribute1: string;
  attribute2: string;
  attribute3: string;
  attribute4: string;
  attribute5: string;
  attribute6: string;
  attribute7: string;
  attribute8: string;
  attribute9: string;
  attribute10: string;
  createdBy: string;
  creationDate: string;
  lastUpdatedBy: string;
  lastUpdateOn: string;
  messageStatus: string;
}

export interface VendorDataModel {
  vendorCode?: string;
  vendorName?: string;
  vendorAddress1?: string;
  vendorAddress2?: string;
  contactNumber?: string;
  email?: string;
  stateId?: number;
  cityId?: number;
  pointName?: string;
  panNo?: string;
  status?: string;
  gstnNo?: string;
  payTermCode?: string;
  payTermStatus?: string;
  paidByDetail?: number;
  city?: {
    typeId: number;
    code?: string;
    value?: string;
    description?: string;
    lookUpType?: null;
    id?: number;
    createdBy?: string;
    createdOn?: string;
    modifiedBy?: string;
    modifiedOn?: string;
    status?: string;
    attribute1?: null;
    attribute2?: null;
    attribute3?: null;
    attribute4?: null;
    attribute5?: null;
    attribute6?: null;
    attribute7?: null;
    attribute8?: null;
    attribute9?: string;
    attribute10?: string;
    messageStatus: null;
  };
  state?: {
    typeId: number;
    code?: string;
    value?: string;
    description?: string;
    lookUpType?: null;
    id: number;
    createdBy?: string;
    createdOn?: string;
    modifiedBy?: string;
    modifiedOn?: string;
    status?: string;
    attribute1?: null;
    attribute2?: null;
    attribute3?: null;
    attribute4?: null;
    attribute5?: null;
    attribute6?: null;
    attribute7?: null;
    attribute8?: null;
    attribute9?: string;
    attribute10?: string;
    messageStatus?: null;
  };
}

export interface VendorModel{
  
}

export interface LookupDataModel {
  id: number;
  typeId: number;
  code?: string;
  value?: string;
  description?: string;
  status?: string;
  attribute1: null;
  attribute2: null;
  attribute3: null;
  attribute4: null;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
  lookUpType: {
    id: number;
    type: string;
    description: string;
    status: string;
    attribute1: null;
    attribute2: null;
    attribute3: null;
    attribute4: null;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
    messageStatus: null;
  };
  messageStatus: null;
}

export interface TransporterListingModel {
  locationId: number;
  transporterCode: string;
  transporterName: string;
  ownerName: string;
  contactPerson: string;
  transporterAddress1: string;
  transporterAddress2: string;
  city: null;
  stateCode: null;
  countryCode: null;
  postalCode: string;
  panNo: string;
  gstnNo: string;
  transporterPayterm: string;
  transporterPaytermStatus: string;
  transporterContactNo: string;
  transporterMailId: string;
  gstType: string;
  regdDetails: string;
  autoBiltiRequiredFlag: string;
  autoBiltiStartingCharacter: string;
  consignorName: string;
  consignorContactInformation: string;
  biltiHeaderComments: string;
  note: string;
  footer: string;
  inactiveDate: string;
  transporterStatus: null;
  createdBy: string;
  creationDate: string;
  lastUpdatedBy: string;
  lastUpdateOn: string;
  messageStatus: null;
  id: number;
}

export interface TransporterDataModel {
  actionBy: string;
  attribute1: string;
  attribute2: string;
  attribute3: string;
  attribute4: string;
  attribute5: number;
  attribute6: number;
  attribute7: number;
  attribute8: number;
  attribute9: '';
  attribute10: '';
  transporterContactNo: string;
  transporterMailId: string;
  ownerName: string;
  contactPerson: string;
  regdDetails: string;
  autoBiltiRequiredFlag: string;
  autoBiltiStartingCharacter: string;
  biltiHeaderComments: string;
  note: string;
  footer: string;
  status: string;
  transporterMappings: [
    {
      transportationModeId: number | undefined;
      taxationTypeId: number | undefined;
      taxaCodesId: number | undefined;
      tdsCodesId: number | undefined;
      location: number,
      autoBilti: string,
      consignerName: string,
      consignerContact: number,
      autoBiltiReq: string
    }
  ];
}

export interface BiltiListingModel {
  biltiNumber: string;
  frlrNumber: number;
  loadingLocation: {
    id: number;
    code: string;
    value: string;
  };
  vehicles: {
    vehicleNumber: string;
    vehicleSize: {
      id: number;
      code: number;
      value: number;
    };
    id: number;
    code: string;
    value: string;
  };
  freights: {
    freightAmount: number;
    source: {
      id: number;
      code: string;
      value: string;
    };
    destination: {
      id: number;
      code: string;
      value: string;
    };
    id: number;
    code: string;
    value: string;
  };
  id: number;
  createdBy: string;
  creationDate: string;
  lastUpdatedBy: string;
  inactiveDate: string;
  lastUpdateOn: string;
  status: string;
}

export interface DispatchNoteModel {
  actionBy: number;
  attribute1: string;
  attribute2: string;
  attribute3: string;
  attribute4: string;
  attribute5: number;
  attribute6: number;
  attribute7: number;
  attribute8: number;
  attribute9: Date;
  attribute10: Date;
  supplierId: number;
  vehicleId: number;
  frlrNumber: string;
  partDetails:
    | [
        {
          actionBy?: number;
          attribute1?: string;
          attribute2?: string;
          attribute3?: string;
          attribute4?: string;
          attribute5?: number;
          attribute6?: number;
          attribute7?: number;
          attribute8?: number;
          attribute9?: Date;
          attribute10?: Date;
          partId?: number;
          partQtyId?: number;
        }
      ]
    | undefined;
}
