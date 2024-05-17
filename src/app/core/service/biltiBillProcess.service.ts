import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, adviceTypeData, biltiBillProcess, biltiBillProcessbyId, createAdviceType, createBiltiBillProcess, updateAdviceType } from "../constants";
import { PlantRequest } from "../models/plant";

@Injectable({
    providedIn: "root",
})
export class BiltiBillProcessService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getBiltiBillProcess(data: any) {
        return this.post(biltiBillProcess(localStorage.getItem('locationId')), data);
    }

    getBiltiBillProcessbyId(biltiProcessId: number) {
        return this.get(biltiBillProcessbyId(localStorage.getItem('locationId'), biltiProcessId))
    }

    createBiltiBillProcess(data: object) {
        return this.post(createBiltiBillProcess(localStorage.getItem('locationId')), data);
    }

}
