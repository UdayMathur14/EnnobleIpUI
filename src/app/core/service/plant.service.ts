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
        return this.post(plant(localStorage.getItem('locationId')), data);
    }

    getPlantData(plantId : string){
        return this.get(plantData(localStorage.getItem('locationId'), plantId));
    }

    updatePlant(plantId : string, data : object){
        return this.put(updatePlant(localStorage.getItem('locationId'), plantId), data);
    }

    getLocationsLookup(data: object, type: string) {
        return this.post(getDropdownDatas(type), data);
      }
}
