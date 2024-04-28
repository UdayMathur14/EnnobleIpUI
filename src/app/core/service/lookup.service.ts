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

  //For Lookup module
  getLookupDatas(lookupId: number) {
    return this.baseService.get(APIConstant.basePath + APIConstant.lookupData + lookupId);
  }

  //for Location Id
  getLookupData(key: any) {
    return this.baseService.post(APIConstant.basePath + APIConstant.getLookupData, key);
  }

  getLookupDataForLocation() {
    this.getLookupData({type: 'Locations'}).subscribe((response: any) => {
      this.baseService.lookupData.next(response);
      const locations = response.lookUps.filter((e: any) => e.code === 'HA');
      localStorage.setItem('locationId', locations[0].id)
    }, error => {

    })
  }

  updateLookup(lookupId: number, data: object) {
    return this.baseService.put(APIConstant.basePath + APIConstant.updateLookup + lookupId, data);
  }

  createLookup(data: object) {
    return this.baseService.post(APIConstant.basePath + APIConstant.createLookup, data);
  }

  getLookupsType(data: any) {
    return this.baseService.post(APIConstant.basePath + APIConstant.lookupstype, data);
  }

}
