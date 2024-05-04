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
    super(baseService, APIConstant.basePath);
  }

  getPointCharges(data: any) {
    return this.post(pointCharge(localStorage.getItem('locationId')), data);
  }

  getPointChargeData(pointChargeId: string) {
    return this.get(APIConstant.basePath +pointChargeData(localStorage.getItem('locationId'), pointChargeId));
  }

  updatePointCharge(pointChargeId: string, data: object) {
    return this.put(updatePointCharge(localStorage.getItem('locationId'), pointChargeId), data);
  }

  createPointCharge(data: object) {
    return this.post(
      APIConstant.basePath +createPointCharge(localStorage.getItem('locationId')), data);
  }

  getLookups(lookupId:any) {
    return this.get(
      APIConstant.lookupData + lookupId);
  }
}
