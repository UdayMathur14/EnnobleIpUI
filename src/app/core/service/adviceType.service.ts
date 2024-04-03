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
        super(baseService);
    }

    getAdviceTypes(data : any){
        return this.baseService.post(APIConstant.basePath+adviceType(localStorage.getItem('locationId')), data);
    }

    getAdviceTypeData(adviceId : string){
        return this.baseService.get(APIConstant.basePath+adviceTypeData(localStorage.getItem('locationId'), adviceId));
    }

    updateAdviceType(adviceId : string, data : object){
        return this.baseService.put(APIConstant.basePath+updateAdviceType(localStorage.getItem('locationId'), adviceId), data);
    }

    createAdviceType(data : object){
        return this.baseService.post(APIConstant.basePath+createAdviceType(localStorage.getItem('locationId')), data);
    }
}
