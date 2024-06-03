import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, getDropdownDatas, plant, plantData, updatePlant } from "../constants";
import { PlantRequest } from "../models/plant";
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class PlantService extends CRUDService<PlantRequest> {
    
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getPlants(data : any){
        return this.post(APIConstant.plant, data);
    }

    getPlantData(plantId : string){
        return this.get(plantData(this.locationIds, plantId));
    }

    updatePlant(plantId : string, data : object){
        return this.put(updatePlant(this.locationIds, plantId), data);
    }

    getLocationsLookup(data: object, type: string) {
        return this.post(getDropdownDatas(type), data);
      }
}
