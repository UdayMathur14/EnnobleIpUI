import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, createCustomer, customerData, customers, updateCustomer } from "../constants";
import { PlantRequest } from "../models/plant";
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class CustomerService extends CRUDService<PlantRequest> {

    maxCount: number = Number.MAX_VALUE;

    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getCustomers(data: any, offset: number = 0, count: number = this.maxCount) {
        return this.post(customers(offset, count), data);
    }

    getCustomerData( customerId: number) {
        return this.get(customerData( customerId));
    }

    updateCustomer( customerId: number, data: object) {
        return this.put(updateCustomer( customerId), data);
    }

    createCustomer( data: object) {
        return this.post(createCustomer(), data);
    }
}
