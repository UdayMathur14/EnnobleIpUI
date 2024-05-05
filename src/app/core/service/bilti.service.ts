import { Injectable } from '@angular/core';
import { BiltiRequest } from '../models/bilti';
import { CRUDService } from './crud.service';
import { BaseService } from './base.service';
import { APIConstant, bilti } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class BiltiService extends CRUDService<BiltiRequest> {

  constructor(protected override baseService: BaseService) {
    super(baseService);
   }

  getBiltis(data: any) {
    return this.baseService.post(APIConstant.basePath + bilti(localStorage.getItem('locationId')), data);
  }
}
