import { Injectable } from '@angular/core';
import { BiltiRequest } from '../models/bilti';
import { BaseService } from './base.service';
import { CRUDService } from './crud.service';
import {
  APIConstant,
  bilti,
  biltiData,
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
  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  getBiltis(data: any) {
    return this.baseService.post(
      APIConstant.basePath + bilti,
      data
    );
  }

  getTransactionTypes(data: any) {
    return this.post(APIConstant.transactionTypes, data);
  }

  getFrmTransactions(data: any) {
    return this.baseService.post(
      APIConstant.basePath + frlr(this.locationIds),
      data
    );
  }

  getVehicleNo(data: any) {
    return this.baseService.post(
      APIConstant.basePath + vehicle,
      data
    );
  }

  getTransporters(data: any) {
    return this.baseService.post(
      APIConstant.basePath + transporter,
      data
    );
  }

  getFreightsList(data: any) {
    return this.baseService.post(
      APIConstant.basePath + freight,
      data
    );
  }

  getVendors(data: any) {
    return this.post(APIConstant.vendors, data);
  }

  getPointCharges(data: any) {
    return this.baseService.post(
      APIConstant.basePath + APIConstant.pointCharge, data);
  }

  createBilti(data: any) {
    return this.baseService.post(
      APIConstant.basePath + createBilti(this.locationIds), data);
  }

  getLoadingLocation(data: object, type: string) {
    return this.post(getDropdownDatas(type), data);
  }

  getBiltiData(biltiId: number) {
    return this.get(biltiData(this.locationIds, biltiId));
  }

  updateBilti(biltiId: number, data: object) {
    return this.put(updateBitli(this.locationIds, biltiId), data);
  }
}
