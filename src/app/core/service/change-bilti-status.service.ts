import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { BaseService } from './base.service';
import { APIConstant, changeBiltiStatus } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class ChangeBiltiStatusService extends CRUDService<null> {

  constructor(protected override baseService: BaseService) {
    super(baseService, APIConstant.basePath);
  }

  changeBitltiStatus(data: any) {
    return this.baseService.post(
      APIConstant.basePath + changeBiltiStatus(localStorage.getItem('locationId')),data);
}
}
