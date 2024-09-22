import { Injectable } from '@angular/core';
import { CRUDService } from './crud.service';
import { GlAccrualPostingRequest } from '../models/gl-accrual -posting';
import { APIConstant, glAccrualPosting } from '../constants';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class GlAccrualPostingService extends CRUDService<GlAccrualPostingRequest> {

  maxCount: number = Number.MAX_VALUE;

 
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

  getGlAccrualPosting(data: any, offset: number = 0, count: number = this.maxCount) {
    return this.post(glAccrualPosting(offset, count), data);
}
}
