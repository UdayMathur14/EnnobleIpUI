export interface AdviceDataModel {
    id: number,
    locationCode: string,
    adviceType: string,
    batchName: string,
    maxBiltiNumber: string,
    manualAllocationRequired: string,
    extraAttr1: string,
    extraAttr2: string,
    extraAttr3: string,
    extraAttr4: string,
    extraAttr5: string,
    extraAttr6: string,
    extraAttr7: string,
    extraAttr8: string,
    extraAttr9: string,
    extraAttr10: string,
    createdBy: string,
    createdOn: string,
    modifiedBy: string,
    modifiedOn: string,
    messageStatus: null
}

export interface FreightDataModel {
    id: number,
    freightCode: string,
    source: string,
    vehicleSize: string,
    locationCode: string,
    destination: string,
    freightAmount: string,
    remarks: string,
    extraAttr1: string,
    extraAttr2: string,
    extraAttr3: null,
    extraAttr4: null,
    extraAttr5: null,
    extraAttr6: null,
    extraAttr7: null,
    extraAttr8: null,
    extraAttr9: null,
    extraAttr10: null,
    createdBy: string,
    createdOn: string,
    modifiedBy: string,
    modifiedOn: string,
    messageStatus: null,
    approvedByMaterial: null,
    approvedByMaterialOn: null,
    approvedByAccounts: null,
    approvedByAccountsOn: null,
    status: null
}

export interface LookupTypeDataModel {
    id: number,
    type: string,
    description: string,
    status: string,
    attribute1: null,
    attribute2: null,
    attribute3: null,
    attribute4: null,
    createdBy: string,
    createdOn: string,
    modifiedBy: string,
    modifiedOn: string,
    messageStatus: null
}

export interface PartDataModel {
    id: number,
    partNumber?: string,
    partName?: string,
    description?: string,
    partSize?: string,
    remarks?: string,
    partPrice?: string,
    status?: string,
    extraAttr1: null,
    extraAttr2: null,
    extraAttr3: null,
    extraAttr4: null,
    extraAttr5: null,
    extraAttr6: null,
    extraAttr7: null,
    extraAttr8: null,
    extraAttr9: null,
    extraAttr10: null,
    createdBy: string,
    createdOn: string,
    modifiedBy: string,
    modifiedOn: string,
    messageStatus: null
}

export interface PlantDataModel {
    id: number,
    plantCode: string,
    locationId: string,
    plantDesc: string,
    plantAddress: string,
    city: string,
    stateCode: string,
    countryCode: string,
    postalCode: string,
    panNo: string,
    gstnNo: string,
    auCode: string,
    plantType: string,
    siteCode: string,
    dsc: string,
    dcp: string,
    transactionType: string,
    status: string,
    extraAttr1: string,
    extraAttr2: string,
    extraAttr3: string,
    extraAttr4: string,
    extraAttr5: string,
    extraAttr6: string,
    extraAttr7: string,
    extraAttr8: string,
    extraAttr9: string,
    extraAttr10: string,
    createdBy: string,
    createdOn: string,
    modifiedBy: string,
    modifiedOn: string,
    messageStatus: null,
    transactionTypeMapping: [
        {
            id: number,
            status: string,
            attribute1: null,
            attribute2: null,
            attribute3: null,
            attribute4: null,
            txnTypeId: null,
            name: string,
            code: any,
            transactionTypeId : number
        }
    ]
}

export interface PointChargeDataModel {
    id: number,
    locationId: string,
    pointName: string,
    pointCharge: string,
    sameLocationCharge: string,
    status: string,
    extraAttr1: string,
    extraAttr2: string,
    extraAttr3: string,
    extraAttr4: string,
    extraAttr5: string,
    extraAttr6: string,
    extraAttr7: string,
    extraAttr8: string,
    extraAttr9: string,
    extraAttr10: string,
    createdBy: string,
    createdOn: string,
    modifiedBy: string,
    modifiedOn: string,
    approvedByMaterial: string,
    approvedByMaterialOn: string,
    approvedByAccounts: string,
    approvedByAccountsOn: string,
    messageStatus: string
}

export interface TransactionTypeListModel {
    id: number,
    code: string,
    name: string,
    interfaceTxnTypeId: number,
    glSubCategoryId: number,
    status: string,
    attribute1: null,
    attribute2: null,
    attribute3: null,
    attribute4: null,
    createdBy: string,
    createdOn: string,
    modifiedBy: string,
    modifiedOn: string,
    messageStatus: null
}

export interface VehicleDataModel {
    id: number;
    locationId: number;
    vehicleNumber: string;
    vehicleSize: number;
    transporterId: number;
    vehicleCondition: string;
    transporterEntity: {
        locationId: number,
        transporterCode: string,
        transporterName: string,
        transporterAddress1: string,
        transporterAddress2: string,
        city: string,
        stateCode: string,
        countryCode: string,
        postalCode: string,
        panNo: string,
        gstnNo: string,
        transporterPayterm: string,
        transporterPaytermStatus: string,
        transporterContactNo: string,
        transporterMailId: string,
        gstType: string,
        regdDetails: string,
        autoBiltiRequiredFlag: string,
        autoBiltiStartingCharacter: string,
        consignorName: string,
        consignorContactInformation: string,
        biltiHeaderComments: string,
        note: string,
        footer: string,
        inactiveDate: string,
        transporterStatus: string,
        createdBy: string,
        createdOn: string,
        modifiedBy: string,
        modifiedOn: string,
        messageStatus: string
    },
    remarks: string;
    vehicleStatus: string;
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
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
    messageStatus: string;
}

export interface VendorDataModel {
    id?: number,
    vendorCode?: string,
    vendorName?: string,
    vendorAddress1?: string,
    vendorAddress2?: string,
    contactNumber?: string,
    email?: string,
    state?: string,
    city?: string,
    poinName?: string,
    panNo?: string,
    gstnNo?: string,
    payTermCode?: string,
    payTermStatus?: string,
    paidByDetail?: string,
    status?: string,
    transactionType?: string,
    extraAttr1?: string,
    extraAttr2?: string,
    extraAttr3?: string,
    extraAttr4?: string,
    extraAttr5?: string,
    extraAttr6?: string,
    extraAttr7?: string,
    extraAttr8?: string,
    extraAttr9?: string,
    extraAttr10?: string,
    createdBy?: string,
    createdOn?: string,
    modifiedBy?: string,
    modifiedOn?: string,
    messageStatus?: null
}

export interface LookupDataModel {
    id: number,
    typeId: number,
    code?: string,
    value?: string,
    description?: string,
    status?: string,
    attribute1: null,
    attribute2: null,
    attribute3: null,
    attribute4: null,
    createdBy: string,
    createdOn: string,
    modifiedBy: string,
    modifiedOn: string,
    lookUpType: {
        id: number,
        type: string,
        description: string,
        status: string,
        attribute1: null,
        attribute2: null,
        attribute3: null,
        attribute4: null,
        createdBy: string,
        createdOn: string,
        modifiedBy: string,
        modifiedOn: string,
        messageStatus: null
    }
    messageStatus: null
}

export interface TransporterListingModel {
    locationId: number,
    transporterCode: string,
    transporterName: string,
    ownerName: string,
    contactPerson: string,
    transporterAddress1: string,
    transporterAddress2: string,
    city: null,
    stateCode: null,
    countryCode: null,
    postalCode: string,
    panNo: string,
    gstnNo: string,
    transporterPayterm: string,
    transporterPaytermStatus: string,
    transporterContactNo: string,
    transporterMailId: string,
    gstType: string,
    regdDetails: string,
    autoBiltiRequiredFlag: string,
    autoBiltiStartingCharacter: string,
    consignorName: string,
    consignorContactInformation: string,
    biltiHeaderComments: string,
    note: string,
    footer: string,
    inactiveDate: string,
    transporterStatus: null,
    createdBy: string,
    createdOn: string,
    modifiedBy: string,
    modifiedOn: string,
    messageStatus: null,
    id : number
}