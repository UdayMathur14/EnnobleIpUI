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
        super(baseService, APIConstant.basePath);
    }

    getParts(data: any) {
        return this.post(APIConstant.parts, data);
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
