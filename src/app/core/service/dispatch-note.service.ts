import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { DispatchNoteRequest } from "../models/dispatch-note";
import { BaseService } from "./base.service";
import { APIConstant, createDispatchNote } from "../constants";

@Injectable({
    providedIn: 'root'
})
export class DispatchNoteService extends CRUDService<DispatchNoteRequest>{
    constructor(protected override baseService: BaseService) {
        super(baseService);
    }


    createDispatchNote(data : object){
        return this.baseService.post(APIConstant.basePath+createDispatchNote(localStorage.getItem('locationId')), data);
    }
}