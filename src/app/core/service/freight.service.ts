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
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getFreightsList(data : any){
        return this.post(freight, data);
    }

    getFreightData(freightId : number){
        return this.get(freightData(this.locationIds, freightId));
    }

    updateFreight(locationId:Number,freightId : number, data : object){
        return this.put(updateFreight(locationId, freightId), data);
    }

    createFreight(locationId:Number,data : object){
        return this.post(createFreight(locationId), data);
    }

    getDropdownData(data : object, type: string){
        return this.post( getDropdownDatas(type) ,data);
    }
}
