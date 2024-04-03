import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { BaseService } from './base.service';
import { APIConstant } from '../constants';
import { LookupTypeRequest } from '../models/lookup-type';

@Injectable({
  providedIn: 'root',
})
export class LookupTypeService extends CRUDService<LookupTypeRequest> {
  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.lookupstype);
  }

  getLookupsTypes(data: any) {
    return this.baseService.post(APIConstant.basePath + APIConstant.lookupstype, data);
  }

  getLookupTypesData(lookupTypeId: string) {
    return this.baseService.get(APIConstant.basePath + APIConstant.lookuptypeData + lookupTypeId);
  }

  updateLookupTypes(lookupTypeId: string, data: object) {
    return this.baseService.put(APIConstant.basePath + APIConstant.updatelookuptype + lookupTypeId, data);
  }

  createLookupTypes(data: object) {
    return this.baseService.post(APIConstant.basePath + APIConstant.createlookuptype, data);
  }

}
