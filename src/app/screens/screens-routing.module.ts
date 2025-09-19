import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ScreensComponent } from "./screens.component";
import { PlantComponent } from "./master/plant/plant.component";
import { CustomerComponent } from "./master/customer/customer.component";
import { AddEditCustomerComponent } from "./master/customer/add-edit-customer/add-edit-customer.component";
import { AddEditPlantComponent } from "./master/plant/add-edit-plant/add-edit-plant.component";
import { VendorComponent } from "./master/vendor/vendor.component";
import { AddEditVendorComponent } from "./master/vendor/add-edit-vendor/add-edit-vendor.component";
import { VehicleComponent } from "./master/vehicle/vehicle.component";
import { AddEditVehicleComponent } from "./master/vehicle/add-edit-vehicle/add-edit-vehicle.component";
import { TransactionTypeComponent } from "./master/transaction-type/transaction-type.component";
import { FreightComponent } from "./master/freight/freight.component";
import { AddEditFreightComponent } from "./master/freight/add-edit-freight/add-edit-freight.component";
import { TransporterComponent } from "./master/transporter/transporter.component";
import { AddEditTransporterComponent } from "./master/transporter/add-edit-transporter/add-edit-transporter.component";
import { AdviceComponent } from "./master/advice/advice.component";
import { AddEditAdviceComponent } from "./master/advice/add-edit-advice/add-edit-advice.component";
import { PointChargeComponent } from "./master/point-charge/point-charge.component";
import { AddEditPointChargeComponent } from "./master/point-charge/add-edit-point-charge/add-edit-point-charge.component";
import { AddEditDispatchNoteComponent } from "./transactions/dispatch-note/add-edit-dispatch-note/add-edit-dispatch-note.component";
import { DispatchNoteComponent } from "./transactions/dispatch-note/dispatch-note.component";
import { PointMasterAccountsComponent } from "./transactions/point-master-accounts/point-master-accounts.component";
import { PointMasterMaterialComponent } from "./transactions/point-master-material/point-master-material.component";
import { FreightMasterMaterialComponent } from "./transactions/freight-master-material/freight-master-material.component";
import { FreightMasterAccountsComponent } from "./transactions/freight-master-accounts/freight-master-accounts.component";
import { ApprovalAccountsComponent } from "./transactions/approval-accounts/approval-accounts.component";
import { ApprovalMaterialComponent } from "./transactions/approval-material/approval-material.component";
import { BiltiComponent } from "./transactions/bilti/bilti.component";
import { AddEditBiltiComponent } from "./transactions/bilti/add-edit-bilti/add-edit-bilti.component";
import { AddEditTransactionTypeComponent } from "./master/transaction-type/add-edit-transaction-type/add-edit-transaction-type.component";
import { BiltiBillProcessViewComponent } from "./transactions/bilti-bill-process-view/bilti-bill-process-view.component";
import { BiltiBillProcessComponent } from "./transactions/bilti-bill-process/bilti-bill-process.component";
import { CheckedMaterialsTeamComponent } from "./transactions/checked-by-materials-team/checked-materials-team.component";
import { ApprovalMaterialHeadComponent } from "./transactions/approval-material-head/approval-material-head.component";
import { ChangeBiltiStatusComponent } from "./transactions/change-bilti-status/change-bilti-status.component";
import { LookupComponent } from "./master/lookup/lookup.component";
import { AddEditLookupComponent } from "./master/lookup/add-edit-lookup/add-edit-lookup.component";
// import {  } from "../core/guards/auth.guard";
import { NotFound404Component } from "./not-found-404/not-found-404.component";
import { MasterComponent } from "./master/master.component";
import { RejectionBiltiDetailReportComponent } from "./reports/rejection-bilti-detail-report/rejection-bilti-detail-report.component";
import { ErrorLoggingReportComponent } from "./reports/error-logging-report/error-logging-report.component";
import { ProvisionReportComponent } from "./reports/provision-report/provision-report.component";
import { DebitNoteReportComponent } from "./reports/debit-note-report/debit-note-report.component";
import { AdhocReportComponent } from "./reports/adhoc-report/adhoc-report.component";
import { OutboundReportComponent } from "./reports/outbound-report/outbound-report.component";
import { ApOutboundComponent } from "./transactions/ap-outbound/ap-outbound.component";
import { GlAccrualPostingComponent } from "./transactions/gl-accrual-posting/gl-accrual-posting.component";
import { ProvisionalReportComponent } from "./reports/processed-report/provisional-report.component";
import { RecycleBinPlantConfigurationComponent } from "./master/recycle-bin-plant-configuration/recycle-bin-plant-configuration.component";
import { LookupTypeComponent } from "./master/lookupType/lookupType.component";
import { AddEditLookupTypeComponent } from "./master/lookupType/add-edit-lookupType/add-edit-lookupType.component";

const routes: Routes = [
    {
        path: "",
        component: ScreensComponent,
        children: [
            { path: "", redirectTo: "master", pathMatch: "full"},
            //{ path: '**', component: NotFound404Component },
            { path: "master", component: MasterComponent },
            { path: "master/lookupType", component: LookupTypeComponent, canActivate: [] },
            { path: "master/addEditlookupType/:lookupTypeId", component: AddEditLookupTypeComponent, canActivate: [] },
            { path: "master/customer", component: CustomerComponent, canActivate: [] },
            { path: "master/addEditCustomer/:customerId", component: AddEditCustomerComponent, canActivate: [] },
            { path: "master/vendor", component: VendorComponent, canActivate: [] },
            { path: "master/addEditVendor/:vendorId", component: AddEditVendorComponent, canActivate: [] },
            { path: "master/vehicle", component: VehicleComponent, canActivate: [] },
            { path: "master/editVehicle/:vehicleId", component: AddEditVehicleComponent, canActivate: [] },
            { path: "master/addVehicle", component: AddEditVehicleComponent, canActivate: [] },
            { path: 'master/bank', component: TransactionTypeComponent, canActivate: [] },
            { path: 'master/addEditBank/:bankId', component: AddEditTransactionTypeComponent },
            { path: "master/freight", component: FreightComponent, canActivate: [] },
            { path: "master/addEditFreight/:freightId", component: AddEditFreightComponent, canActivate: [] },
            { path: "master/transporter", component: TransporterComponent, canActivate: [] },
            { path: "master/addEditTransporter/:transporterCode", component: AddEditTransporterComponent, canActivate: [] },
            { path: "master/advice", component: AdviceComponent, canActivate: [] },
            { path: "master/addEditAdvice/:adviceId", component: AddEditAdviceComponent, canActivate: [] },
            { path: "master/pointCharge", component: PointChargeComponent, canActivate: [] },
            { path: "master/addEditPointCharge", component: AddEditPointChargeComponent, canActivate: [] },
            
            { path: "master/lookup", component: LookupComponent, canActivate: [] },
            { path: "master/addEditLookup/:lookupId", component: AddEditLookupComponent, canActivate: [] },
            { path: "master/editPointCharge/:pointChargeId", component: AddEditPointChargeComponent, canActivate: [] },
            { path: "master/addPointCharge", component: AddEditPointChargeComponent, canActivate: [] },
            { path: "master/recycleBinPlantConfiguration", component: RecycleBinPlantConfigurationComponent, canActivate: [] },
            { path: "transaction/VendorInvoiceTxn", component: DispatchNoteComponent, canActivate: [] },
            // { path: "transaction/addEditVendorInvoice", component: AddEditDispatchNoteComponent, canActivate: [] },
            { path: "transaction/addEditVendorInvoice/:dispatchId", component: AddEditDispatchNoteComponent, canActivate: [] },
            
            { path: "transaction/bilti", component: BiltiComponent, canActivate: [] },
            { path: "transaction/addEditBilti/:biltiId", component: AddEditBiltiComponent, canActivate: [] },
            { path: "transaction/addEditBilti/:locationId/:biltiId", component: AddEditBiltiComponent, canActivate: [] },
            { path: "transaction/paymentManagement", component: PointMasterAccountsComponent, canActivate: [] },
            { path: "transaction/pointMasterMaterial", component: PointMasterMaterialComponent, canActivate: [] },
            { path: "transaction/freightMasterAccounts", component: FreightMasterAccountsComponent, canActivate: [] },
            { path: "transaction/freightMasterMaterial", component: FreightMasterMaterialComponent, canActivate: [] },
            { path: "transaction/approvalAccounts", component: ApprovalAccountsComponent, canActivate: [] },
            { path: "transaction/approvalMaterial", component: ApprovalMaterialComponent, canActivate: [] },
            { path: "transaction/biltiBillProcessView", component: BiltiBillProcessViewComponent, canActivate: [] },
            { path: "transaction/biltiBillProcess", component: BiltiBillProcessComponent, canActivate: [] },
            { path: "transaction/biltiBillProcess", component: BiltiBillProcessComponent, canActivate: [] },
            { path: "transaction/checkedMaterialsTeam", component: CheckedMaterialsTeamComponent, canActivate: [] },
            { path: "transaction/approvalMaterialHead", component: ApprovalMaterialHeadComponent, canActivate: [] },
            { path: "transaction/changeBiltiStatus", component: ChangeBiltiStatusComponent, canActivate: [] },
            { path: "transaction/apOutbound", component: ApOutboundComponent, canActivate: [] },
            { path: "transaction/glAccrual-posting", component: GlAccrualPostingComponent, canActivate: [] },

            { path: "report/provision", component: ProvisionalReportComponent, canActivate: [] },
            { path: "report/rejection-bilti-detail", component: RejectionBiltiDetailReportComponent, canActivate: [] },
            { path: "report/error-logging", component: ErrorLoggingReportComponent, canActivate: [] },
            { path: "report/debit-note", component: DebitNoteReportComponent, canActivate: [] },
            { path: "report/provision", component: ProvisionReportComponent, canActivate: [] },
            { path: "report/adhoc-report", component: AdhocReportComponent, canActivate: [] },
            { path: "report/processed-report", component: OutboundReportComponent, canActivate: [] },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ScreensRoutingModule { }

export const ScreensComponents = [
    MasterComponent,
    ScreensComponent,
    AddEditPlantComponent,
    PlantComponent,
    AddEditVendorComponent,
    PointMasterMaterialComponent,
    AddEditCustomerComponent,
    TransactionTypeComponent,
    AddEditFreightComponent,
    AddEditAdviceComponent,
    NotFound404Component
];

export const ScreensEntryComponents = [];
