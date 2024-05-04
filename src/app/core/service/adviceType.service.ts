import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, adviceType, adviceTypeData, createAdviceType, updateAdviceType } from "../constants";
import { PlantRequest } from "../models/plant";

@Injectable({
    providedIn: "root",
})
export class AdviceTypeService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getAdviceTypes(data : any){
        return this.post(adviceType(localStorage.getItem('locationId')), data);
    }

    getAdviceTypeData(adviceId : number){
        return this.get(adviceTypeData(localStorage.getItem('locationId'), adviceId));
    }

    updateAdviceType(adviceId : number, data : object){
        return this.put(updateAdviceType(localStorage.getItem('locationId'), adviceId), data);
    }

    createAdviceType(data : object){
        return this.post(createAdviceType(localStorage.getItem('locationId')), data);
    }
}
