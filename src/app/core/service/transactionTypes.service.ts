import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant,getDropdownDatas, transactionTypes } from "../constants";
import { PlantRequest } from "../models/plant";
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class TransactionTypesService extends CRUDService<PlantRequest> {

    maxCount: number = Number.MAX_VALUE;

    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getTransactionTypes(data : any, offset: number = 0, count: number = this.maxCount){
        return this.post(transactionTypes(offset, count), data);
    }

    getTransactionTypeData(transactionId : string){
        return this.get(APIConstant.transactionTypeData + transactionId);
    }

    updateTransaction(transactionId : string, data : object){
        return this.put(APIConstant.updateTransactionTypeData + transactionId, data);
    }

    getDropdownData(data : object, type: string){
        return this.post( getDropdownDatas(type) ,data);
    }

    getTransactionTypeInterface(data: any){
        return this.post(APIConstant.transactionTypeInterfaces, data);
    }
}
