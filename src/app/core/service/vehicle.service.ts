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
    return this.post(vehicle(localStorage.getItem('locationId')), data);
  }

  getVehicleData(vehicleId: string) {
    return this.get(
      vehicleData(localStorage.getItem('locationId'), vehicleId));
  }

  updateVehicle(vehicleId: string, data: object) {
    return this.put(updateVehicle(localStorage.getItem('locationId'), vehicleId), data);
  }

  createVehicle(data: object) {
    return this.post(createVehicle(localStorage.getItem('locationId')), data);
  }

  getLookups(data: any) {
    return this.post(
      APIConstant.getLookupData, data);
  }

  getTransporters(data: any) {
    return this.post(transporter(localStorage.getItem('locationId')), data);
  }

  getTransporterData(transporterId: string) {
    return this.get(transporterData(localStorage.getItem('locationId'), transporterId));
  }

  getDropdownData(data : object, type: string){
    return this.post( getDropdownDatas(type) ,data);
}

}
