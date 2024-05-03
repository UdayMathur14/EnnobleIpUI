import { Injectable } from '@angular/core';
import { BiltiRequest } from '../models/bilti';
import { BaseService } from './base.service';
import { CRUDService } from './crud.service';
import {
  APIConstant,
  bilti,
  createBilti,
  freight,
  frlr,
  getDropdownDatas,
  pointCharge,
  transporter,
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
      APIConstant.basePath + bilti(localStorage.getItem('locationId')),
      data
    );
  }

  getTransactionTypes(data: any) {
    return this.post(APIConstant.transactionTypes, data);
  }

  getFrmTransactions(data: any) {
    return this.baseService.post(
      APIConstant.basePath + frlr(localStorage.getItem('locationId')),
      data
    );
  }

  getVehicleNo(data: any) {
    return this.baseService.post(
      APIConstant.basePath + vehicle(localStorage.getItem('locationId')),
      data
    );
  }

  getTransporters(data: any) {
    return this.baseService.post(
      APIConstant.basePath + transporter(localStorage.getItem('locationId')),
      data
    );
  }

  getFreightsList(data: any) {
    return this.baseService.post(
      APIConstant.basePath + freight(localStorage.getItem('locationId')),
      data
    );
  }

  getVendors(data: any) {
    return this.post(APIConstant.vendors, data);
  }

  getPointCharges(data: any) {
    return this.baseService.post(
      APIConstant.basePath + pointCharge(localStorage.getItem('locationId')),data);
  }

  createBilti(data: any){
    return this.baseService.post(
      APIConstant.basePath + createBilti(localStorage.getItem('locationId')),data);
  }

  getLoadingLocation(data : object, type: string){
    return this.post( getDropdownDatas(type) ,data);
}
}
