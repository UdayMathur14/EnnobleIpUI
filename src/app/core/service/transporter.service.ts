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
        return this.post(transporter(localStorage.getItem('locationId')), data);
    }

    getTransporterData(transporterId : string){
        return this.get(transporterData(localStorage.getItem('locationId'), transporterId));
    }

    updateTransporter(transporterId : string, data : object){
        return this.put(updateTransporter(localStorage.getItem('locationId'), transporterId), data);
    }

    getDropdownData(data : object, type: string){
        return this.post( getDropdownDatas(type) ,data);
    }
}
