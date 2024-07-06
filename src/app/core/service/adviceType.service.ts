import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, adviceType, adviceTypeData, createAdviceType, updateAdviceType } from "../constants";
import { PlantRequest } from "../models/plant";

@Injectable({
    providedIn: "root",
})
export class AdviceTypeService extends CRUDService<PlantRequest> {

    maxCount: number = Number.MAX_VALUE;

    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getAdviceTypes(data : any, offset: number = 0, count: number = this.maxCount){
        return this.post(adviceType(offset, count), data);
    }

    getAdviceTypeData(locationId: number = 0, adviceId : number){
        return this.get(adviceTypeData(locationId, adviceId));
    }

    updateAdviceType(locationId: number = 0,adviceId : number, data : object){
        return this.put(updateAdviceType(locationId, adviceId), data);
    }

    createAdviceType(locationId: number = 0,data : object){
        return this.post(createAdviceType(locationId), data);
    }
}
