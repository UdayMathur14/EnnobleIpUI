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
    loadSpinner: boolean = false;
    locations: any;
    validate = "Validating...";

    constructor(
        private lookupService: LookupService,
        public baseService: BaseService,
        public validateService: ValidateService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }

    ngOnInit() {
        localStorage.clear();
        this.activatedRoute.queryParams.subscribe(params => {
            const data = params['data'];
            const return_url = params['return_url'];
            if (!data) {
                this.validate = "Validation Failed";
                return;
            }
            const atobParam: any = atob(data);
            const userData = JSON.parse(atobParam);
            const app = userData.apps.find((e: any) => e.name === APIConstant.appSlug);
            this.validateService.generateToken({ appId: app.id }, userData.accessToken).subscribe((res) => {
                localStorage.setItem("logindata", atobParam);
                localStorage.setItem("profile", JSON.stringify(res));

                if (return_url) {
                    window.location.href = return_url;
                } else {
                    this.router.navigateByUrl("/master");
                }

            })
        });
    }
}
