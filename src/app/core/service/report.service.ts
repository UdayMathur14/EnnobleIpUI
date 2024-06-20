import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, debitNoteReport, errorLoggingReport, provisionalReport } from "../constants";
import { ReportRequest } from "../models/report";

@Injectable({
    providedIn: "root",
})
export class ReportService extends CRUDService<ReportRequest> {
    constructor(protected override baseService: BaseService) {
        super(baseService, APIConstant.basePath);
    }

    getErrorLogging(data: any = {}) {
        return this.post(errorLoggingReport, data);
    }

    getDebitNote(data: any = {}) {
        return this.post(debitNoteReport, data);
    }

    getProvisionReport(data: any = {}) {
        return this.post(provisionalReport, data);
    }
}
