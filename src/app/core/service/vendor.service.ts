import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { VendorRequest } from '../models/vendor';
import { BaseService } from './base.service';
import { APIConstant, createVendors, getDropdownDatas, vendors } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class VendorService extends CRUDService<VendorRequest> {

  maxCount: number = Number.MAX_VALUE;

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  getVendors(data: any, offset: number = 0, count: number = this.maxCount) {
    return this.post(vendors(offset, count), data);
  }

  getVendorData(vendorId: string) {
    return this.get(APIConstant.vendorData + vendorId);
  }

  updateVendor(vendorId: string, data: object) {
    return this.put(APIConstant.updateVendor + vendorId, data);
  }

  getDropdownData(data: object, type: string) {
    return this.post(getDropdownDatas(type), data);
  }

  createVendor( data: object) {
    return this.post(createVendors(), data);
  }
  
}
