import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, createFreight, freight, freightData, updateFreight } from "../constants";
import { PlantRequest } from "../models/plant";
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class FreightService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService);
    }

    getFreightsList(data : any){
        return this.baseService.post(APIConstant.basePath+freight(localStorage.getItem('locationId')), data);
    }

    getFreightData(freightId : string){
        return this.baseService.get(APIConstant.basePath+freightData(localStorage.getItem('locationId'), freightId));
    }

    updateFreight(freightId : string, data : object){
        return this.baseService.put(APIConstant.basePath+updateFreight(localStorage.getItem('locationId'), freightId), data);
    }

    createFreight(data : object){
        return this.baseService.post(APIConstant.basePath+createFreight(localStorage.getItem('locationId')), data);
    }

    getDropdownData(data : object, type: string){
        return this.baseService.post(APIConstant.basePath+ APIConstant.getDropdownData 
            + type ,data);
    }
}
