import { Component, OnInit } from "@angular/core";
import { PlantService } from "../core/service";
import { BaseService } from "../core/service/base.service";

@Component({
    templateUrl: "./screens.component.html",
    styleUrls: ["screens.component.scss"],
})
export class ScreensComponent implements OnInit {
    constructor(private plantService: PlantService,
        public baseService: BaseService) { }
    loadSpinner: boolean = false;

    ngOnInit() {
        this.baseService.plantSpinner.subscribe((res) => {
            this.loadSpinner = res;
        });
        this.baseService.pointChargeSpinner.subscribe((res) => {
            this.loadSpinner = res;
        })
    }
}
