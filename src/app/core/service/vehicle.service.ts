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

  getvehicles(locationId:number,data: any) {
    return this.baseService.post(APIConstant.basePath + `v1/${locationId}/vehicle/search`,data);
  }

  getLookups(data:any) {
    return this.baseService.post(
      APIConstant.basePath + APIConstant.getLookupData, data);
  }
}
