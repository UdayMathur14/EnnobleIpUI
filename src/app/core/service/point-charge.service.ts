import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { PointChargeRequest } from '../models/point-charge';
import { BaseService } from './base.service';
import { APIConstant, pointCharge, pointChargeData, updatePointCharge, createPointCharge } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class PointChargeService extends CRUDService<PointChargeRequest> {
  constructor(protected override baseService: BaseService) {
    super(baseService);
  }

  getPointCharges(data: any) {
    return this.baseService.post(APIConstant.basePath + pointCharge(localStorage.getItem('locationId')), data);
  }

  getPointChargeData(pointChargeId: string) {
    return this.baseService.get(APIConstant.basePath +pointChargeData(localStorage.getItem('locationId'), pointChargeId));
  }

  updatePointCharge(pointChargeId: string, data: object) {
    return this.baseService.put(APIConstant.basePath + updatePointCharge(localStorage.getItem('locationId'), pointChargeId), data);
  }

  createPointCharge(data: object) {
    return this.baseService.post(
      APIConstant.basePath +createPointCharge(localStorage.getItem('locationId')), data);
  }

  getLookupData(lookupId: number) {
    return this.baseService.get(
      APIConstant.basePath + APIConstant.lookupdata + lookupId);
  }

}
