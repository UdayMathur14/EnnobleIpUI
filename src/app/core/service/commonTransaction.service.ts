import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, createFreight, freight, freightData, updateFreight, getDropdownDatas, commonTransaction, updateBiltiStatus } from "../constants";
import { PlantRequest } from "../models/plant";

@Injectable({
    providedIn: "root",
})
export class CommonTransactionService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    updateStatus(locationId: number, id: number, data: object) {
        return this.put(commonTransaction(locationId, id), data);
    }

    updateBiltiApprovalStatus(locationId: number ,id: number, data: object){
        return this.put(updateBiltiStatus(locationId, id), data);
    }
}
