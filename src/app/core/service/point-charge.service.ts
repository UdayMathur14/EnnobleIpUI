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
    super(baseService, APIConstant.pointCharge);
  }

  getPointCharges(data: any) {
    return this.baseService.post(
      APIConstant.basePath + APIConstant.pointCharge,data);
  }
}
