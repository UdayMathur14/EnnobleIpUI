import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, createFreight, freight, freightData, updateFreight, getDropdownDatas, commonTransaction } from "../constants";
import { PlantRequest } from "../models/plant";

@Injectable({
    providedIn: "root",
})
export class CommonTransactionService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    updateStatus(id: number, data: object) {
        return this.put(commonTransaction(localStorage.getItem('locationId'), id), data);
    }
}
