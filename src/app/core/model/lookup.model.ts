export interface LookupDataModel {
  typeId?: string;
  code: string;
  value: string;
  description: string;
  status: string;
  attribute1: string;
  attribute2: string;
  attribute3: string;
  attribute4: string;
  createdBy: string;
  createdOn: string;
  modifiedBy: string;
  modifiedOn: string;
  messageStatus: string;
  lookUpType:{
    type: string;
  }
}
