import { Component, OnInit } from "@angular/core";
import { BaseService } from "../core/service/base.service";
import { LookupService } from "../core/service/lookup.service";


@Component({
    templateUrl: "./screens.component.html",
    styleUrls: ["screens.component.scss"],
})
export class ScreensComponent implements OnInit {
    constructor(
        private lookupService: LookupService,
        public baseService: BaseService
    ) { }
    loadSpinner: boolean = false;
    locations: any;

    ngOnInit() {
        let key = {
            type: 'loc'
        };

        this.lookupService.getLookupData(key).subscribe((response: any) => {
            this.baseService.lookupData.next(response);
            localStorage.setItem('locationId', response.lookUps[0].id)
        }, error => {

        })

        this.baseService.plantSpinner.subscribe((res) => {
            this.loadSpinner = res;
        });
        this.baseService.vendorSpinner.subscribe((res) => {
            this.loadSpinner = res;
        });
        this.baseService.lookupSpinner.subscribe((res) => {
            this.loadSpinner = res;
        })
    }
}
