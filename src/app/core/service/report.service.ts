import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, debitNoteReport, errorLoggingReport, provisionalReport } from "../constants";
import { ReportRequest } from "../models/report";

@Injectable({
    providedIn: "root",
})
export class ReportService extends CRUDService<ReportRequest> {

    maxCount: number = Number.MAX_VALUE;

    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getErrorLogging(data: any, offset: number = 0, count: number = this.maxCount) {
        return this.post(errorLoggingReport(offset, count), data);
    }

    getDebitNote(data: any, offset: number = 0, count: number = this.maxCount) {
        return this.post(debitNoteReport(offset, count), data);
    }

    getProvisionReport(data: any, offset: number = 0, count: number = this.maxCount) {
        return this.post(provisionalReport(offset, count), data);
    }
}
