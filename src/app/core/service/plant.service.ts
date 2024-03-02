import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError, mergeMap } from "rxjs/operators";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant } from "../constants";
import { PlantRequest } from "../models/plant";

@Injectable({
    providedIn: "root",
})
export class PlantService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.plant);
    }
}
