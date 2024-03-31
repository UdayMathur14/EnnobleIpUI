import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant } from "../constants";
import { PlantRequest } from "../models/plant";
import { map, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: "root",
})
export class TransactionTypesService extends CRUDService<PlantRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.plant);
    }

    getTransactionTypes(data : any){
        return this.baseService.post(APIConstant.basePath+APIConstant.transactionTypes, data);
    }

    getTransactionTypeData(transactionId : string){
        return this.baseService.get(APIConstant.basePath+APIConstant.transactionTypeData + transactionId);
    }

    updateTransaction(transactionId : string, data : object){
        return this.baseService.put(APIConstant.basePath+APIConstant.updateTransactionTypeData + transactionId, data);
    }
}
