import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, adviceTypeData, biltiBillProcess, biltiBillProcessbyId, createAdviceType, updateAdviceType } from "../constants";
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

    getBiltiBillProcessbyId(biltiProcessId: number, data: object) {
        return this.get(biltiBillProcessbyId(localStorage.getItem('locationId'), biltiProcessId), data)
    }

    getAdviceTypeData(adviceId: number) {
        return this.get(adviceTypeData(localStorage.getItem('locationId'), adviceId));
    }

    updateAdviceType(adviceId: number, data: object) {
        return this.put(updateAdviceType(localStorage.getItem('locationId'), adviceId), data);
    }

    createAdviceType(data: object) {
        return this.post(createAdviceType(localStorage.getItem('locationId')), data);
    }
}
