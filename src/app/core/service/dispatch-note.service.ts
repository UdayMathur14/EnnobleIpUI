import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { DispatchNoteRequest } from "../models/dispatch-note";
import { BaseService } from "./base.service";
import { APIConstant, createDispatchNote, getDispatchNote } from "../constants";

@Injectable({
    providedIn: 'root'
})
export class DispatchNoteService extends CRUDService<DispatchNoteRequest>{
    
    constructor(protected override baseService: BaseService) {
        super(baseService);
    }


    getDispatchNote(dispatchNumber:string=""){
        return this.baseService.post(APIConstant.basePath+getDispatchNote(localStorage.getItem('locationId')),{dispatchNumber});
    }

    createDispatchNote(data : object){
        return this.baseService.post(APIConstant.basePath+createDispatchNote(localStorage.getItem('locationId')), data);
    }
}