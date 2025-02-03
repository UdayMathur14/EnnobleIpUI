import { Injectable } from '@angular/core';
import { BiltiRequest } from '../models/bilti';
import { BaseService } from './base.service';
import { CRUDService } from './crud.service';
import {
  APIConstant,
  bilti,
  biltiData,
  calculatePointCharge,
  createBilti,
  freight,
  frlr,
  getDropdownDatas,
  pointCharge,
  transporter,
  updateBitli,
  vehicle,
} from '../constants';

@Injectable({
  providedIn: 'root',
})
export class BiltiService extends CRUDService<BiltiRequest> {

  maxCount: number = Number.MAX_VALUE;
  
  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  getBiltis(data: any, offset: number = 0, count: number = this.maxCount) {
    return this.post(bilti(offset, count),data);
  }

  getFrmTransactions(data: any) {
    return this.baseService.post(APIConstant.basePath + frlr(this.locationIds), data);
  }

  createBilti(locationId: Number, data: any) {
    return this.baseService.post(APIConstant.basePath + createBilti(locationId), data);
  }

  getLoadingLocation(data: object, type: string) {
    return this.post(getDropdownDatas(type), data);
  }

  getBiltiData(locationId: Number, biltiId: number) {
    return this.get(biltiData(locationId, biltiId));
  }

  updateBilti(locationId: Number, biltiId: number, data: object) {
    return this.put(updateBitli(locationId, biltiId), data);
  }

  calculatePointCharge(data: object) {
    return this.post(calculatePointCharge(), data);
  }
}
