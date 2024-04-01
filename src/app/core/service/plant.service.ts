import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, plant, plantData, updatePlant } from "../constants";
import { PlantRequest } from "../models/plant";
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class PlantService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService);
    }

    getPlants(data : any){
        return this.baseService.post(APIConstant.basePath+plant(localStorage.getItem('locationId')), data);
    }

    getPlantData(plantId : string){
        return this.baseService.get(APIConstant.basePath+plantData(localStorage.getItem('locationId'), plantId));
    }

    updatePlant(plantId : string, data : object){
        return this.baseService.put(APIConstant.basePath+updatePlant(localStorage.getItem('locationId'), plantId), data);
    }
}
