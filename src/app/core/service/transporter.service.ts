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
        super(baseService);
    }

    getTransporters(data : any){
        return this.baseService.post(APIConstant.basePath+transporter(localStorage.getItem('locationId')), data);
    }

    getTransporterData(transporterId : string){
        return this.baseService.get(APIConstant.basePath+transporterData(localStorage.getItem('locationId'), transporterId));
    }

    updateTransporter(transporterId : string, data : object){
        return this.baseService.put(APIConstant.basePath+updateTransporter(localStorage.getItem('locationId'), transporterId), data);
    }

    getDropdownData(data : object, type: string){
        return this.baseService.post(APIConstant.basePath+ getDropdownDatas(type) ,data);
    }
}
