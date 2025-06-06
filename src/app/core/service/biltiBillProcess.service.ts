import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, adviceTypeData, apOutboundData, biltiApprovalData, biltiBillProcess, biltiBillProcessbyId, createAdviceType, createBiltiBillProcess, updateAdviceType, updateBiltiBillProcess } from "../constants";
import { PlantRequest } from "../models/plant";

@Injectable({
    providedIn: "root",
})
export class BiltiBillProcessService extends CRUDService<PlantRequest> {

    maxCount: number = Number.MAX_VALUE;

    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getBiltiBillProcess(data: any, offset: number = 0, count: number = this.maxCount) {
        return this.post(biltiBillProcess(offset, count), data);
    }

    getBiltiBillProcessbyId(locationId: number = 0, biltiProcessId: number) {
        return this.get(biltiBillProcessbyId(locationId, biltiProcessId))
    }

    createBiltiBillProcess(locationId: number = 0, data: object) {
        return this.post(createBiltiBillProcess(locationId), data);
    }

    updateBiltiBillProcess(locationId: number = 0, BiltiBillProcessId: number, data: any){
        return this.put(updateBiltiBillProcess(locationId, BiltiBillProcessId), data);
    }

    getBiltiApprovalData(data: any) {
        return this.post(biltiApprovalData(data), data);
    }

    createApOutbound(data: any) {
        return this.post(apOutboundData(), data);
    }

}
