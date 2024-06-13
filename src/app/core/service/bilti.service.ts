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

  // getTransactionTypes(data: any) {
  //   return this.post(APIConstant.transactionTypes, data);
  // }

  getFrmTransactions(locationId: Number, data: any) {
    return this.baseService.post(APIConstant.basePath + frlr(locationId), data);
  }

  // getVehicleNo(data: any) {
  //   return this.baseService.post(
  //     APIConstant.basePath + vehicle,
  //     data
  //   );
  // }

  // getTransporters(data: any) {
  //   return this.baseService.post(
  //     APIConstant.basePath + transporter,
  //     data
  //   );
  // }

  // getFreightsList(data: any) {
  //   return this.baseService.post(
  //     APIConstant.basePath + freight,
  //     data
  //   );
  // }

  // getVendors(data: any) {
  //   return this.post(APIConstant.vendors, data);
  // }

  // getPointCharges(data: any) {
  //   return this.baseService.post(APIConstant.basePath + APIConstant.pointCharge, data);
  // }

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
}
