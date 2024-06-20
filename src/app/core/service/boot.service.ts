import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Router } from '@angular/router';
import { delay, tap } from 'rxjs';
import { APIConstant } from '../constants';
import { LookupService } from './lookup.service';

@Injectable({
    providedIn: 'root'
})
export class BootService {

    constructor(
        private lookupService: LookupService,
        private baseService: BaseService,
        private router: Router
    ) { }

    load() {
        return this.baseService.get(`/assets/resource.json`).pipe(
            tap((res) => (this.setEnvironment(res))),
            delay(2000)
        );

        // return this.baseService.get(`/assets/resource.json`).subscribe((resources)=>{
        //     this.setEnvironment(resources);
        //     return this.baseService.post(APIConstant.basePath + APIConstant.getLookupData,{ type: 'Locations' }).subscribe((res)=>{

        //     })
        // })

    }

    getLookupDataForLocation() {
        this.lookupService.getLookupDataForLocation();
    }

    setEnvironment(res: any) {
        APIConstant.basePath = res.mfgAPIURL;
        APIConstant.commonURL = res.commonAPI;
        APIConstant.Ums = res.umsURL;
        APIConstant.Mfg = res.mfgURL;
        APIConstant.Svc = res.svcURL;
        APIConstant.Gtm = res.gtmURL;

        const logindata = localStorage.getItem("logindata")

        this.lookupService.profile = JSON.parse(localStorage.getItem("profile")||"");
        localStorage.setItem("userId",this.lookupService.profile.userId);

        if (logindata) {
            this.getLookupDataForLocation();
        }
    }
}