import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { PointChargeRequest } from '../models/point-charge';
import { BaseService } from './base.service';
import { APIConstant } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class PointChargeService extends CRUDService<PointChargeRequest> {
  constructor(protected override baseService: BaseService) {
    super(baseService);
  }

  getPointCharges(locationId: number, data: any) {
    return this.baseService.post(APIConstant.basePath + `v1/${locationId}/point-charge/search`, data);
  }

  getPointChargeData(locationId: number, pointChargeId: string) {
    return this.baseService.get(
      APIConstant.basePath + `v1/${locationId}/point-charge/` + pointChargeId);
  }

  updatePointCharge(locationId: number, pointChargeId: string, data: object) {
    return this.baseService.put(
      APIConstant.basePath + `v1/${locationId}/point-charge/update/` + pointChargeId, data);
  }

  createPointCharge(locationId: number, data: object) {
    return this.baseService.post(
      APIConstant.basePath + `v1/${locationId}/point-charge/create`, data);
  }

  getLookupData(lookupId: number) {
    return this.baseService.get(
      APIConstant.basePath + APIConstant.lookupdata + lookupId);
  }

}
