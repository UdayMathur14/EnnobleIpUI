import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { DispatchNoteRequest } from "../models/dispatch-note";
import { BaseService } from "./base.service";
import { APIConstant, createDispatchNote, dispatchData, getDispatchNote, updateDispatchNote } from "../constants";

@Injectable({
    providedIn: 'root'
})
export class DispatchNoteService extends CRUDService<DispatchNoteRequest>{

    maxCount: number = Number.MAX_VALUE;
    
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }


    getDispatchNote(data:any, offset: number = 0, count: number = this.maxCount){
        return this.post(getDispatchNote(offset, count),data);
    }

    createDispatchNote( data : object){
        return this.baseService.post(APIConstant.basePath+createDispatchNote(), data);
    }

    getDispatchNoteById(dispatchId: number){
        return this.get(dispatchData( dispatchId));
    }

    updateDispatchNote(dispatchId: number, data: any){
        return this.put(updateDispatchNote(dispatchId), data);
    }
}