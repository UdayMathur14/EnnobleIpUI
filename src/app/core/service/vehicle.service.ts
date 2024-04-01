import { Injectable } from '@angular/core';
import { VehicleRequest } from '../models/vehicle';
import { BaseService } from './base.service';
import { CRUDService } from './crud.service';
import { APIConstant } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends CRUDService<VehicleRequest> {

  constructor(protected override baseService: BaseService) { 
    super(baseService);
  }

  getVehicles(locationId:number,data: any) {
    return this.baseService.post(APIConstant.basePath + `v1/${locationId}/vehicle/search`,data);
  }

  getVehicleData(locationId: number, vehicleId: string) {
    return this.baseService.get(
      APIConstant.basePath + `v1/${locationId}/vehicle/` + vehicleId);
  }

  updateVehicle(locationId: number, vehicleId: string, data: object) {
    return this.baseService.put(
      APIConstant.basePath + `v1/${locationId}/vehicle/update/` + vehicleId, data);
  }

  createVehicle(locationId: number, data: object) {
    return this.baseService.post(APIConstant.basePath + `v1/${locationId}/vehicle/create`, data);
  }

  getLookupData(lookupId:number) {
    return this.baseService.get(
      APIConstant.basePath + APIConstant.lookupdata + lookupId);
  }

  getLookups(data:any) {
    return this.baseService.post(
      APIConstant.basePath + APIConstant.lookups, data);
  }
}
