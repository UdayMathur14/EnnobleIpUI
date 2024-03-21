import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant } from "../constants";
import { PlantRequest } from "../models/plant";
import { map } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class PlantService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.plant);
    }

    getPlants(data : any){
        return this.baseService.post(APIConstant.basePath+APIConstant.plant, data);
    }

    getPlantData(plantId : any){
        return this.baseService.get(APIConstant.basePath+APIConstant.plantData + plantId);
    }
}
