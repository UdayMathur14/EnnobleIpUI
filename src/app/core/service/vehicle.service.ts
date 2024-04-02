import { Injectable } from '@angular/core';
import { VehicleRequest } from '../models/vehicle';
import { BaseService } from './base.service';
import { CRUDService } from './crud.service';
import { APIConstant, vehicle, vehicleData, updateVehicle, createVehicle } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends CRUDService<VehicleRequest> {

  constructor(protected override baseService: BaseService) { 
    super(baseService);
  }

  getVehicles(data: any) {
    return this.baseService.post(APIConstant.basePath + vehicle(localStorage.getItem('locationId')), data);
  }

  getVehicleData(vehicleId: string) {
    return this.baseService.get(
      APIConstant.basePath + vehicleData(localStorage.getItem('locationId'), vehicleId));
  }

  updateVehicle(vehicleId: string, data: object) {
    return this.baseService.put(APIConstant.basePath + updateVehicle(localStorage.getItem('locationId'), vehicleId), data);
  }

  createVehicle(data: object) {
    return this.baseService.post(APIConstant.basePath + createVehicle(localStorage.getItem('locationId')), data);
  }

  getLookups(data:any) {
    return this.baseService.post(
      APIConstant.basePath + APIConstant.getLookupData, data);
  }
}
