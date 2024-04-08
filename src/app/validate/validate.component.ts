import { Component, OnInit } from "@angular/core";
import { BaseService } from "../core/service/base.service";
import { LookupService } from "../core/service/lookup.service";
import { ActivatedRoute, Router } from "@angular/router";


@Component({
    templateUrl: "./validate.component.html",
    styleUrls: ["validate.component.scss"],
})
export class ValidateComponent implements OnInit {
    constructor(
        private lookupService: LookupService,
        public baseService: BaseService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) { }
    loadSpinner: boolean = false;
    locations: any;
    validate = "Validating...";

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(params => {
            const data = params['data'];
            if(!data){
                this.validate = "Validation Failed";
                return;
            }
            localStorage.setItem("data",atob(data));
            this.router.navigateByUrl("/master");
            console.log(atob(data));
        });
    }
}
