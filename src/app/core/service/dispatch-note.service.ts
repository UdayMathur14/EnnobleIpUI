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

    getDispatchNoteById(locationId:Number,dispatchId: number){
        return this.get(dispatchData(locationId, dispatchId));
    }

    updateDispatchNote(locationId:Number,dispatchId: number, data: any){
        return this.put(updateDispatchNote(locationId, dispatchId), data);
    }
}