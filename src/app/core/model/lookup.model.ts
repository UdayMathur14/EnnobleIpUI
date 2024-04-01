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