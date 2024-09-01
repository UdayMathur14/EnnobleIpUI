import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { LookupRequest } from '../models/lookup';
import { BaseService } from './base.service';
import { APIConstant, getDropdownDatas, lookups } from '../constants';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class LookupService extends CRUDService<LookupRequest> {

  maxCount: number = Number.MAX_VALUE;

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  getLookups(data: any, offset: number = 0, count: number = this.maxCount) {
    return this.post(lookups(offset, count), data);
  }

  getLookupDatas(lookupId: number) {
    return this.get(APIConstant.lookupData + lookupId);
  }

  getLookupData(key: any) {
    return this.post(APIConstant.getLookupData, key);
  }

  getLookupDataForLocation() {
    const p: any = localStorage.getItem("profile");
    const profile: any = JSON.parse(p);
    const appLocation: any = profile?.mfgUnit?.au[0]?.location;
    const allAppLocation: any = profile?.mfgUnit?.au;
    this.getLookupData({ type: 'Locations' }).subscribe((response: any) => {

      this.baseService.lookupData.next(response);
      const locations: any = [];//response.lookUps.filter((e: any) => e.code === 'HA');
      const commonLocations: any = [];
      appLocation.forEach((el: any) => {
        const obj = response.lookUps.find((f: any) => f.typeId === 6 && f.code === el.name);
        if(obj){
          locations.push(obj);
        }
        APIConstant.plantCodes = el.whCode;
      });
      allAppLocation.forEach((el: any) => {
        const obj = response.lookUps.find((f: any) => f.typeId === 6 && f.code === el.location[0]?.name);
        if(obj){
          commonLocations.push(obj);
        }
      });

 
      APIConstant.locationsListDropdown = locations;
      APIConstant.commonLocationsList = commonLocations;
      localStorage.setItem('locationId', locations[0]?.id)
      localStorage.setItem("userId",profile.userId);
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

  getDropdownData(data: string): any {
    return this.baseService.post(APIConstant.basePath + getDropdownDatas(data), {})
  }

  getLocationsLookup(data: object, type: string) {
    return this.post(getDropdownDatas(type), data);
  }

  getCityLookup(data: object, type: string) {
    return this.post(getDropdownDatas(type), data)
  }

  setLocationId(form: FormGroup, locations: any[], formControlName: string) {
    if (locations.length === 1) {
      form.controls[formControlName]?.patchValue(locations[0].id);
    }
  }

}
