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
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getTransporters(data : any){
        return this.post(transporter(this.locationIds), data);
    }

    getTransporterData(transporterId : string){
        return this.get(transporterData(this.locationIds, transporterId));
    }

    updateTransporter(transporterId : string, data : object){
        return this.put(updateTransporter(this.locationIds, transporterId), data);
    }

    getDropdownData(data : object, type: string){
        return this.post( getDropdownDatas(type) ,data);
    }
}
