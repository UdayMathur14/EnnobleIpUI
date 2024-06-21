import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, generateAdhocData, getAdhocDropdownsData } from "../constants";
import { PlantRequest } from "../models/plant";

@Injectable({
    providedIn: "root",
})
export class AdhocReportService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getReportColumnDropdown(data: any) {
        return this.get(getAdhocDropdownsData);
    }

    getReportData(data: object) {
        return this.post(generateAdhocData, data);
    }

}
