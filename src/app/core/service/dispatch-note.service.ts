import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { DispatchNoteRequest } from "../models/dispatch-note";
import { BaseService } from "./base.service";
import { APIConstant, createDispatchNote, dispatchData, getDispatchNote, updateDispatchNote } from "../constants";

@Injectable({
    providedIn: 'root'
})
export class DispatchNoteService extends CRUDService<DispatchNoteRequest>{
    
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }


    getDispatchNote(data:any){
        return this.baseService.post(APIConstant.basePath+getDispatchNote,data);
    }

    createDispatchNote(data : object){
        return this.baseService.post(APIConstant.basePath+createDispatchNote(this.locationIds), data);
    }

    getDispatchNoteById(dispatchId: number){
        return this.get(dispatchData(this.locationIds, dispatchId));
    }

    updateDispatchNote(dispatchId: number, data: any){
        return this.put(updateDispatchNote(this.locationIds, dispatchId), data);
    }
}