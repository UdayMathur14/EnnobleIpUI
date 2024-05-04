import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { APIConstant } from '../constants';

@Injectable({
    providedIn: 'root'
})
export class BootService {

    constructor(private baseService: BaseService, private router: Router) { }

    load() {
        return this.baseService.get(`/assets/resource.json`).pipe(
            tap((res) => (this.setEnvironment(res)))
        );

    }

    setEnvironment(res: any) {
        APIConstant.basePath = res.mfgAPIURL;
        APIConstant.commonURL = res.commonAPI;
        APIConstant.Ums = res.umsURL;
        APIConstant.Mfg = res.mfgURL;
        APIConstant.Svc = res.svcURL;
        APIConstant.Gtm = res.gtmURL;

    }
}