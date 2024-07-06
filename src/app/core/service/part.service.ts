import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, parts } from "../constants";
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

    getPartData(partId: number) {
        return this.get(APIConstant.partData + partId);
    }

    updatePart(partId: number, data: object) {
        return this.put(APIConstant.updatePart + partId, data);
    }

    createPart(data: object) {
        return this.post(APIConstant.createPart, data);
    }
}
