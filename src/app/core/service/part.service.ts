import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant } from "../constants";
import { PlantRequest } from "../models/plant";
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class PartService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService);
    }

    getParts(data : any){
        return this.baseService.post(APIConstant.basePath+APIConstant.parts, data);
    }

    getPartData(partId : number){
        return this.baseService.get(APIConstant.basePath+APIConstant.partData + partId);
    }

    updatePart(partId : number, data : object){
        return this.baseService.put(APIConstant.basePath+APIConstant.updatePart + partId, data);
    }

    createPart(data : object){
        return this.baseService.post(APIConstant.basePath+APIConstant.createPart, data);
    }
}
