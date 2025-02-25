import { Injectable } from '@angular/core';
import {
  APIConstant,
  bilti,
  frlr,
  createBilti,
  getDropdownDatas,
  updateBitli,
  calculatePointCharge,
  getrbData,
  createConfiguration,
  updateConfiguration,
} from '../constants';
import { RecycleBinRequest } from '../models/recycle-bin';
import { BaseService } from './base.service';
import { CRUDService } from './crud.service';

@Injectable({
  providedIn: 'root',
})
export class RecycleBinService extends CRUDService<RecycleBinRequest> {
  maxCount: number = Number.MAX_VALUE;

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  createConfiguration(locationId: number, data: any) {
    return this.baseService.post(
      APIConstant.basePath + createConfiguration(locationId),
      data
    );
  }

  getrbData(locationId: number) {
    return this.get(getrbData(locationId));
  }

  updateConfiguration(locationId: number, data: object) {
    return this.put(updateConfiguration(locationId), data);
  }
}
