import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { LookupRequest } from '../models/lookup';
import { BaseService } from './base.service';
import { APIConstant } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class LookupService extends CRUDService<LookupRequest> {
  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.lookups);
  }

  getLookups(data: any) {
    return this.baseService.post(APIConstant.basePath + APIConstant.lookups, data);
  }

  getLookupData(lookupId: string) {
    return this.baseService.get(APIConstant.basePath + APIConstant.lookupData + lookupId);
  }

  updateLookup(lookupId: string, data: object) {
    return this.baseService.put(APIConstant.basePath + APIConstant.updateLookup + lookupId, data);
  }

  createLookup(data: object) {
    return this.baseService.post(APIConstant.basePath + APIConstant.createLookup, data);
  }

  getLookupsType(data: any) {
    return this.baseService.post(APIConstant.basePath + APIConstant.lookupstype, data);
  }

}
