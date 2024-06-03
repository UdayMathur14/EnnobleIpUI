import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { VendorRequest } from '../models/vendor';
import { BaseService } from './base.service';
import { APIConstant, getDropdownDatas } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class VendorService extends CRUDService<VendorRequest> {

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  getVendors(data: any) {
    return this.post(APIConstant.vendors, data);
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
}
