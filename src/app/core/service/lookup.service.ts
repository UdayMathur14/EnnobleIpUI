import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant } from "../constants";
import { PlantRequest } from "../models/plant";
import { map, Subject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class LookupService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.plant);
    }

    locations = new Subject;

    getLookupData(key : any){
        return this.baseService.post(APIConstant.basePath+APIConstant.getLookupData, key);
    }
}
