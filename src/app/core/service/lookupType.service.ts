import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { BaseService } from './base.service';
import { FormGroup } from '@angular/forms';
import { APIConstant, getDropdownDatas, LookupTypes } from '../constants';
import { LookupRequest } from '../models/lookup';

@Injectable({
  providedIn: 'root',
})
export class LookupTypeService extends CRUDService<LookupRequest> {
 

  maxCount: number = Number.MAX_VALUE;

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  getLookupTypes(data: any, offset: number = 0, count: number = this.maxCount) {
    return this.post(LookupTypes(offset, count), data);
  }

  getLookupTypeDatas(LookupTypeId: number) {
    return this.get(APIConstant.LookupTypeData + LookupTypeId);
  }

  getLookupTypeData(key: any) {
    return this.post(APIConstant.getLookupTypeData, key);
  }

  updateLookup(lookupId: number, data: object) {
    return this.put(APIConstant.updateLookup + lookupId, data);
  }

  createLookup(data: object) {
    return this.post(APIConstant.createLookupType, data);
  }

  getLookupsType(data: any) {
    return this.post(APIConstant.lookupstype, data);
  }
  getLookupsTypeDropDown(data: any) {
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

  getLookupTypeDrop(data:any){
    return this.post(APIConstant.lookUpType, data);
  }





}
