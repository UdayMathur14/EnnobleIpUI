import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, createPart, partData, parts, updatePart } from "../constants";
import { PlantRequest } from "../models/plant";
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class PartService extends CRUDService<PlantRequest> {

    maxCount: number = Number.MAX_VALUE;

    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getParts(data: any, offset: number = 0, count: number = this.maxCount) {
        return this.post(parts(offset, count), data);
    }

    getPartData(locationId: number = 0, partId: number) {
        return this.get(partData(locationId, partId));
    }

    updatePart(locationId: number = 0, partId: number, data: object) {
        return this.put(updatePart(locationId, partId), data);
    }

    createPart(locationId: number = 0, data: object) {
        return this.post(createPart(locationId), data);
    }
}
