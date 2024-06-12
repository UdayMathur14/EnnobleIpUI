import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, adviceTypeData, biltiBillProcess, biltiBillProcessbyId, createAdviceType, createBiltiBillProcess, updateAdviceType, updateBiltiBillProcess } from "../constants";
import { PlantRequest } from "../models/plant";

@Injectable({
    providedIn: "root",
})
export class BiltiBillProcessService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getBiltiBillProcess(data: any) {
        return this.post(biltiBillProcess, data);
    }

    getBiltiBillProcessbyId(biltiProcessId: number) {
        return this.get(biltiBillProcessbyId(this.locationIds, biltiProcessId))
    }

    createBiltiBillProcess(data: object) {
        return this.post(createBiltiBillProcess(this.locationIds), data);
    }

    updateBiltiBillProcess(BiltiBillProcessId: number, data: any){
        return this.put(updateBiltiBillProcess(this.locationIds, BiltiBillProcessId), data);
    }

}
