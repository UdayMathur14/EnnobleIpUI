import { Injectable } from "@angular/core";
import { CRUDService } from "./crud.service";
import { BaseService } from "./base.service";
import { APIConstant, errorLoggingReport, provisionReport } from "../constants";
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

    getProvisionReport(fromDate: Date| null, toDate: Date | null) {
        return this.post(provisionReport, { fromDate, toDate });
    }
}
