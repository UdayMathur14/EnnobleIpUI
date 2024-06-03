import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { LookupRequest } from '../models/lookup';
import { BaseService } from './base.service';
import { APIConstant, getDropdownDatas } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class LookupService extends CRUDService<LookupRequest> {

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  getLookups(data: any) {
    return this.post(APIConstant.lookups, data);
  }

  getLookupDatas(lookupId: number) {
    return this.get(APIConstant.lookupData + lookupId);
  }

  getLookupData(key: any) {
    return this.post(APIConstant.getLookupData, key);
  }

  getLookupDataForLocation() {
    this.getLookupData({ type: 'Locations' }).subscribe((response: any) => {
      APIConstant.locationsListDropdown = response.lookUps;
      this.baseService.lookupData.next(response);
      const locations = response.lookUps.filter((e: any) => e.code === 'HA');
      localStorage.setItem('locationId', locations[0]?.id)
    }, error => {

    })
  }

  updateLookup(lookupId: number, data: object) {
    return this.put(APIConstant.updateLookup + lookupId, data);
  }

  createLookup(data: object) {
    return this.post(APIConstant.createLookup, data);
  }

  getLookupsType(data: any) {
    return this.post(APIConstant.lookupstype, data);
  }

  getDropdownData(data: string): any{
    return this.baseService.post(APIConstant.basePath + getDropdownDatas(data), {})
  }

  getLocationsLookup(data: object, type: string) {
    return this.post(getDropdownDatas(type), data);
  }

  getCityLookup(data: object, type: string){
    return this.post(getDropdownDatas(type), data)
  }

}
