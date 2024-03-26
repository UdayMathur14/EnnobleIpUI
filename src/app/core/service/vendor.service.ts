import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { VendorRequest } from '../models/vendor';
import { BaseService } from './base.service';
import { APIConstant } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class VendorService extends CRUDService<VendorRequest> {

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.vendor);
  }

  getVendors(data: any) {
    return this.baseService.post(APIConstant.basePath + APIConstant.vendor, data);
  }

  getVendorData(vendorId: string) {
    return this.baseService.get(APIConstant.basePath + APIConstant.vendorData + vendorId);
  }

  updateVendor(vendorId: string, data: object) {
    return this.baseService.put(APIConstant.basePath + APIConstant.updateVendor + vendorId, data);
  }
}
