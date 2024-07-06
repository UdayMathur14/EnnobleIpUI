import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { PointChargeRequest } from '../models/point-charge';
import { BaseService } from './base.service';
import { APIConstant, pointCharge, pointChargeData, updatePointCharge, createPointCharge } from '../constants';

@Injectable({
  providedIn: 'root',
})
export class PointChargeService extends CRUDService<PointChargeRequest> {

  maxCount: number = Number.MAX_VALUE;

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  getPointCharges(data: any, offset: number = 0, count: number = this.maxCount) {
    return this.post(pointCharge(offset, count), data);
  }

  getPointChargeData(locationId: number = 0, pointChargeId: string) {
    return this.get(pointChargeData(locationId, pointChargeId));
  }

  updatePointCharge(locationId: number = 0, pointChargeId: string, data: object) {
    return this.put(updatePointCharge(locationId, pointChargeId), data);
  }

  createPointCharge(locationId: number = 0, data: object) {
    return this.post(createPointCharge(locationId), data);
  }

  getLookups(lookupId: any) {
    return this.get(
      APIConstant.lookupData + lookupId);
  }
}
