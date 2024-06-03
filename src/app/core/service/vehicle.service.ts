import { Injectable } from '@angular/core';
import { VehicleRequest } from '../models/vehicle';
import { BaseService } from './base.service';
import { CRUDService } from './crud.service';
import { APIConstant, vehicle, vehicleData, updateVehicle, createVehicle,transporter, transporterData,getDropdownDatas } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends CRUDService<VehicleRequest> {

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  getVehicles(data: any) {
    return this.post(vehicle(this.locationIds), data);
  }

  getVehicleData(vehicleId: string) {
    return this.get(
      vehicleData(this.locationIds, vehicleId));
  }

  updateVehicle(vehicleId: string, data: object) {
    return this.put(updateVehicle(this.locationIds, vehicleId), data);
  }

  createVehicle(data: object) {
    return this.post(createVehicle(this.locationIds), data);
  }

  getLookups(data: any) {
    return this.post(APIConstant.getLookupData, data);
  }

  getTransporters(data: any) {
    return this.post(transporter(this.locationIds), data);
  }

  getTransporterData(transporterId: string) {
    return this.get(transporterData(this.locationIds, transporterId));
  }

  getDropdownData(data : object, type: string){
    return this.post( getDropdownDatas(type) ,data);
}

}
