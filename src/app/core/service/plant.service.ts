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

    maxCount: number = Number.MAX_VALUE;

    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getPlants(data : any, offset: number = 0, count: number = this.maxCount){
        return this.post(plant(offset, count), data);
    }

    getPlantData(plantId : string){
        return this.get(plantData(plantId));
    }

    updatePlant(locationId: number = 0, plantId : string, data : object,){
        return this.put(updatePlant(locationId, plantId), data);
    }

    getLocationsLookup(data: object, type: string) {
        return this.post(getDropdownDatas(type), data);
      }
}
