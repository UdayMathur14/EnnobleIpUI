import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, countries, customerData } from "../constants";
import { PlantRequest } from "../models/plant";
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class CountryService extends CRUDService<PlantRequest> {

    maxCount: number = Number.MAX_VALUE;

    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getCountryData(data: any, offset: number = 0, count: number = this.maxCount) {
        return this.post(countries(offset, count), data);
    }

    // getCountryData( data:any, offset: number = 0, count: number = this.maxCount) {
    //     return this.post(countries(data));
    // }

    // updateCountry( customerId: number, data: object) {
    //     return this.put(updateCountry( customerId), data);
    // }

    // createCountry( data: object) {
    //     return this.post(createCountry(), data);
    // }
}
