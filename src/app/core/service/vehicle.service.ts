import { Injectable } from '@angular/core';
import { VehicleRequest } from '../models/vehicle';
import { BaseService } from './base.service';
import { CRUDService } from './crud.service';
import { APIConstant, vehicle, vehicleData, updateVehicle, createVehicle,transporter, transporterData,getDropdownDatas } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends CRUDService<VehicleRequest> {

  maxCount: number = Number.MAX_VALUE;

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  getVehicles(data: any, offset: number = 0, count: number = this.maxCount) {
    return this.post(vehicle(offset, count), data);
  }

  getVehicleData(locationId: number = 0, vehicleId: string) {
    return this.get(
      vehicleData(locationId, vehicleId));
  }

  updateVehicle(locationId: number = 0,vehicleId: string, data: object) {
    return this.put(updateVehicle(locationId, vehicleId), data);
  }

  createVehicle(locationId: number = 0, data: object) {
    return this.post(createVehicle(locationId), data);
  }

  getLookups(data: any) {
    return this.post(APIConstant.getLookupData, data);
  }

  getTransporterData(transporterId: string) {
    return this.get(transporterData(this.locationIds, transporterId));
  }

  getDropdownData(data : object, type: string){
    return this.post( getDropdownDatas(type) ,data);
}

}
