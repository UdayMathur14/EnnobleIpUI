import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, createFreight, freight, freightData, updateFreight,getDropdownDatas } from "../constants";
import { PlantRequest } from "../models/plant";
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class FreightService extends CRUDService<PlantRequest> {

    maxCount: number = Number.MAX_VALUE;

    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getFreightsList(data : any, offset: number = 0, count: number = this.maxCount){
        return this.post(freight(offset, count), data);
    }

    getFreightData(locationId: number = 0, freightId : number){
        return this.get(freightData(locationId, freightId));
    }

    updateFreight(locationId:number = 0,freightId : number, data : object){
        return this.put(updateFreight(locationId, freightId), data);
    }

    createFreight(locationId:number = 0,data : object){
        return this.post(createFreight(locationId), data);
    }

    getDropdownData(data : object, type: string){
        return this.post( getDropdownDatas(type) ,data);
    }
}
