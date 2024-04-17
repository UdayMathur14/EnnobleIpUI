import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant } from "../constants";
import { PlantRequest } from "../models/plant";
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class ValidateService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService);
    }

    fetchPermissions(data : any){
        return this.baseService.post(APIConstant.Ums+'/'+APIConstant.fetchPermissions, data);
    }
}
