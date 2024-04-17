import { Component, OnInit } from "@angular/core";
import { BaseService } from "../core/service/base.service";
import { LookupService } from "../core/service/lookup.service";
import { ActivatedRoute, Router } from "@angular/router";
import { APIConstant } from "../core/constants";
import { ValidateService } from "../core/service/validate.service";


@Component({
    templateUrl: "./validate.component.html",
    styleUrls: ["validate.component.scss"],
})
export class ValidateComponent implements OnInit {
    constructor(
        private lookupService: LookupService,
        public baseService: BaseService,
        public validateService: ValidateService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }
    loadSpinner: boolean = false;
    locations: any;
    validate = "Validating...";

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            const data = params['data'];
            if (!data) {
                this.validate = "Validation Failed";
                return;
            }
            const atobParam: any = atob(data);
            const userData = JSON.parse(atobParam);
            this.validateService.fetchPermissions({ appId: userData.apps[0].id }).subscribe((res) => {
                localStorage.setItem("data", atobParam);
                this.router.navigateByUrl("/master");
                console.log(atobParam);
            })
        });
    }
}
