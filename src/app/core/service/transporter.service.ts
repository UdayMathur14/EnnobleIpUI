import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, transporter, transporterData, updateTransporter, getDropdownDatas } from "../constants";
import { PlantRequest } from "../models/plant";
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class TransporterService extends CRUDService<PlantRequest> {

    maxCount: number = Number.MAX_VALUE;

    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getTransporters(data : any, offset: number = 0, count: number = this.maxCount){
        return this.post(transporter(offset, count), data);
    }

    getTransporterData(transporterId : string){
        return this.get(transporterData(transporterId));
    }

    updateTransporter(transporterId : string, data : object){
        return this.put(updateTransporter(transporterId), data);
    }

    createTransporter(data : any){
        return this.post(APIConstant.createTransporter, data);
    }

    getDropdownData(data : object, type: string){
        return this.post( getDropdownDatas(type) ,data);
    }
}
