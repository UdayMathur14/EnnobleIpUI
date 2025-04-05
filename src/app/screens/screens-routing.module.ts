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
import { AuthGuard } from "../core/guards/auth.guard";
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

const routes: Routes = [
    {
        path: "",
        component: ScreensComponent,
        children: [
            { path: "", redirectTo: "master", pathMatch: "full"},
            //{ path: '**', component: NotFound404Component },
            { path: "master", component: MasterComponent },
            { path: "master/addEditPlant/:plantId", component: AddEditPlantComponent, canActivate: [AuthGuard] },
            { path: "master/customer", component: CustomerComponent, canActivate: [AuthGuard] },
            { path: "master/addEditCustomer/:customerId", component: AddEditCustomerComponent, canActivate: [AuthGuard] },
            { path: "master/vendor", component: VendorComponent, canActivate: [AuthGuard] },
            { path: "master/addEditVendor/:vendorId", component: AddEditVendorComponent, canActivate: [AuthGuard] },
            { path: "master/vehicle", component: VehicleComponent, canActivate: [AuthGuard] },
            { path: "master/editVehicle/:vehicleId", component: AddEditVehicleComponent, canActivate: [AuthGuard] },
            { path: "master/addVehicle", component: AddEditVehicleComponent, canActivate: [AuthGuard] },
            { path: 'master/transactionTypes', component: TransactionTypeComponent, canActivate: [AuthGuard] },
            { path: 'master/addEditTransactionTypes/:transactionId', component: AddEditTransactionTypeComponent, canActivate: [AuthGuard] },
            { path: "master/freight", component: FreightComponent, canActivate: [AuthGuard] },
            { path: "master/addEditFreight/:freightId", component: AddEditFreightComponent, canActivate: [AuthGuard] },
            { path: "master/transporter", component: TransporterComponent, canActivate: [AuthGuard] },
            { path: "master/addEditTransporter/:transporterCode", component: AddEditTransporterComponent, canActivate: [AuthGuard] },
            { path: "master/advice", component: AdviceComponent, canActivate: [AuthGuard] },
            { path: "master/addEditAdvice/:adviceId", component: AddEditAdviceComponent, canActivate: [AuthGuard] },
            { path: "master/pointCharge", component: PointChargeComponent, canActivate: [AuthGuard] },
            { path: "master/addEditPointCharge", component: AddEditPointChargeComponent, canActivate: [AuthGuard] },
            
            { path: "master/lookup", component: LookupComponent, canActivate: [AuthGuard] },
            { path: "master/addEditLookup/:lookupId", component: AddEditLookupComponent, canActivate: [AuthGuard] },
            { path: "master/editPointCharge/:pointChargeId", component: AddEditPointChargeComponent, canActivate: [AuthGuard] },
            { path: "master/addPointCharge", component: AddEditPointChargeComponent, canActivate: [AuthGuard] },
            { path: "master/recycleBinPlantConfiguration", component: RecycleBinPlantConfigurationComponent, canActivate: [AuthGuard] },
            { path: "transaction/dispatchNote", component: DispatchNoteComponent, canActivate: [AuthGuard] },
            { path: "transaction/addEditDispatchNote", component: AddEditDispatchNoteComponent, canActivate: [AuthGuard] },
            { path: "transaction/addEditDispatchNote/:dispatchId", component: AddEditDispatchNoteComponent, canActivate: [AuthGuard] },
            { path: "transaction/addEditDispatchNote/:locationId/:dispatchId", component: AddEditDispatchNoteComponent, canActivate: [AuthGuard] },
            { path: "transaction/bilti", component: BiltiComponent, canActivate: [AuthGuard] },
            { path: "transaction/addEditBilti/:biltiId", component: AddEditBiltiComponent, canActivate: [AuthGuard] },
            { path: "transaction/addEditBilti/:locationId/:biltiId", component: AddEditBiltiComponent, canActivate: [AuthGuard] },
            { path: "transaction/pointMasterAccounts", component: PointMasterAccountsComponent, canActivate: [AuthGuard] },
            { path: "transaction/pointMasterMaterial", component: PointMasterMaterialComponent, canActivate: [AuthGuard] },
            { path: "transaction/freightMasterAccounts", component: FreightMasterAccountsComponent, canActivate: [AuthGuard] },
            { path: "transaction/freightMasterMaterial", component: FreightMasterMaterialComponent, canActivate: [AuthGuard] },
            { path: "transaction/approvalAccounts", component: ApprovalAccountsComponent, canActivate: [AuthGuard] },
            { path: "transaction/approvalMaterial", component: ApprovalMaterialComponent, canActivate: [AuthGuard] },
            { path: "transaction/biltiBillProcessView", component: BiltiBillProcessViewComponent, canActivate: [AuthGuard] },
            { path: "transaction/biltiBillProcess", component: BiltiBillProcessComponent, canActivate: [AuthGuard] },
            { path: "transaction/biltiBillProcess", component: BiltiBillProcessComponent, canActivate: [AuthGuard] },
            { path: "transaction/checkedMaterialsTeam", component: CheckedMaterialsTeamComponent, canActivate: [AuthGuard] },
            { path: "transaction/approvalMaterialHead", component: ApprovalMaterialHeadComponent, canActivate: [AuthGuard] },
            { path: "transaction/changeBiltiStatus", component: ChangeBiltiStatusComponent, canActivate: [AuthGuard] },
            { path: "transaction/apOutbound", component: ApOutboundComponent, canActivate: [AuthGuard] },
            { path: "transaction/glAccrual-posting", component: GlAccrualPostingComponent, canActivate: [AuthGuard] },

            { path: "report/provision", component: ProvisionalReportComponent, canActivate: [AuthGuard] },
            { path: "report/rejection-bilti-detail", component: RejectionBiltiDetailReportComponent, canActivate: [AuthGuard] },
            { path: "report/error-logging", component: ErrorLoggingReportComponent, canActivate: [AuthGuard] },
            { path: "report/debit-note", component: DebitNoteReportComponent, canActivate: [AuthGuard] },
            { path: "report/provision", component: ProvisionReportComponent, canActivate: [AuthGuard] },
            { path: "report/adhoc-report", component: AdhocReportComponent, canActivate: [AuthGuard] },
            { path: "report/processed-report", component: OutboundReportComponent, canActivate: [AuthGuard] },
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
