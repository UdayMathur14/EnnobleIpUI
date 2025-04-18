import { NgModule } from "@angular/core";
import { ScreensComponents, ScreensEntryComponents, ScreensRoutingModule } from "./screens-routing.module";
import { LayoutModule } from "../layout";
import { PlantFilterComponent } from "./master/plant/components/filter/plant-filter.component";
import { PlantGridTableComponent } from "./master/plant/components/plant-grid-table/plant-grid-table.component";
import { CommonModule } from "@angular/common";
import { CustomerFiltersComponent } from "./master/customer/components/filter/customer-filter.component";
import { CustomerGridTableComponent } from "./master/customer/components/grid-table/customer-grid-table.component";
import { CustomerComponent } from "./master/customer/customer.component";
import { AddEditCustomerComponent } from "./master/customer/add-edit-customer/add-edit-customer.component";
import { VendorComponent } from './master/vendor/vendor.component';
import { VendorGridTableComponent } from "./master/vendor/components/grid-table/vendor-grid-table.component";
import { VehicleComponent } from "./master/vehicle/vehicle.component";
import { VehicleFiltersComponent } from "./master/vehicle/components/filter/vehicle-filter.component";
import { VehicleGridTableComponent } from "./master/vehicle/components/grid-table/vehicle-grid-table.component";
import { FreightComponent } from "./master/freight/freight.component";
import { FreightFilterComponent } from "./master/freight/components/filter/freight-filter.component";
import { FreightGridTableComponent } from "./master/freight/components/freight-grid-table/freight-grid-table.component";
import { TransactionTypeComponent } from "./master/transaction-type/transaction-type.component";
import { TransactionGridTableComponent } from "./master/transaction-type/components/transaction-type-grid-table/transaction-grid-table.component";
import { AddEditTransactionTypeComponent } from "./master/transaction-type/add-edit-transaction-type/add-edit-transaction-type.component";
import { TransporterComponent } from "./master/transporter/transporter.component";
import { TransporterGridTableComponent } from "./master/transporter/components/grid-table/transporter-grid-table.component";
import { TransporterFiltersComponent } from "./master/transporter/components/filter/transporter-filter.component";
import { AddEditTransporterComponent } from "./master/transporter/add-edit-transporter/add-edit-transporter.component";
import { AdviceComponent } from "./master/advice/advice.component";
import { AdviceGridTableComponent } from "./master/advice/components/advice-grid-table/advice-grid-table.component";
import { PointChargeComponent } from "./master/point-charge/point-charge.component";
import { AddEditPointChargeComponent } from "./master/point-charge/add-edit-point-charge/add-edit-point-charge.component";
import { PointChargeGridTableComponent } from "./master/point-charge/components/point-charge-grid-table/point-charge-grid-table.component";
import { NgbTooltipModule, NgbPopover, NgbPopoverModule, NgbDatepicker, NgbDatepickerModule, NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { DispatchNoteComponent } from "./transactions/dispatch-note/dispatch-note.component";
import { DispatchNoteFiltersComponent } from "./transactions/dispatch-note/components/filter/dispatch-note-filter.component";
import { DispatchNoteGridTableComponent } from "./transactions/dispatch-note/components/grid-table/dispatch-note-grid-table.component";
import { DeliveryNoteModalComponent } from "./modals/delivery-note/delivery-note.component";
import { PointMasterAccountsComponent } from "./transactions/point-master-accounts/point-master-accounts.component";
import { PointMasterAccountsGridTableComponent } from "./transactions/point-master-accounts/components/grid-table/point-master-accounts-grid-table.component";
import { PointMasterAccountsFiltersComponent } from "./transactions/point-master-accounts/components/filter/point-master-accounts-filter.component";
import { PointMasterMaterialComponent } from "./transactions/point-master-material/point-master-material.component";
import { PointMasterMaterialFiltersComponent } from "./transactions/point-master-material/components/filter/point-master-material-filter.component";
import { PointMasterMaterialGridTableComponent } from "./transactions/point-master-material/components/grid-table/point-master-material-grid-table.component";
import { FreightMasterAccountsComponent } from "./transactions/freight-master-accounts/freight-master-accounts.component";
import { FreightMasterAccountsFiltersComponent } from "./transactions/freight-master-accounts/components/filter/freight-master-accounts-filter.component";
import { FreightMasterAccountsGridTableComponent } from "./transactions/freight-master-accounts/components/grid-table/freight-master-accounts-grid-table.component";
import { FreightMasterMaterialComponent } from "./transactions/freight-master-material/freight-master-material.component";
import { FreightMasterMaterialFiltersComponent } from "./transactions/freight-master-material/components/filter/freight-master-material-filter.component";
import { FreightMasterMaterialGridTableComponent } from "./transactions/freight-master-material/components/grid-table/freight-master-material-grid-table.component";
import { ApprovalAccountsComponent } from "./transactions/approval-accounts/approval-accounts.component";
import { ApprovalAccountsFiltersComponent } from "./transactions/approval-accounts/components/filter/approval-accounts-filter.component";
import { ApprovalAccountsGridTableComponent } from "./transactions/approval-accounts/components/grid-table/approval-accounts-grid-table.component";
import { ApprovalMaterialComponent } from "./transactions/approval-material/approval-material.component";
import { ApprovalMaterialFiltersComponent } from "./transactions/approval-material/components/filter/approval-material-filter.component";
import { ApprovalMaterialGridTableComponent } from "./transactions/approval-material/components/grid-table/approval-material-grid-table.component";
import { BiltiComponent } from "./transactions/bilti/bilti.component";
import { BiltiFilterComponent } from "./transactions/bilti/components/filter/bilti-filter.component";
import { BiltiGridTableComponent } from "./transactions/bilti/components/grid-table/bilti-grid-table.component";
import { BiltiProcessDetailsModalComponent } from "./modals/bilti-bill-process-details/bilti-process-details.component";
import { DebitNoteDetailsModalComponent } from "./modals/debit-note-details/debit-note-details.component";
import { BiltiBillProcessViewFilterComponent } from "./transactions/bilti-bill-process-view/components/filter/bilti-bill-process-view-filter.component";
import { BiltiBillProcessViewGridTableComponent } from "./transactions/bilti-bill-process-view/components/grid-table/bilti-bill-process-view-grid-table.component";
import { BiltiBillProcessViewComponent } from "./transactions/bilti-bill-process-view/bilti-bill-process-view.component";
import { AccountMaterialBiltiProcessDetailsModalComponent } from "./modals/accMat-bilti-bill-process-details/accMat-bilti-process-details.component";
import { BiltiBillProcessComponent } from "./transactions/bilti-bill-process/bilti-bill-process.component";
import { BiltiBillProcessFilterComponent } from "./transactions/bilti-bill-process/components/filter/bilti-bill-process-filter.component";
import { BiltiBillProcessGridTableComponent } from "./transactions/bilti-bill-process/components/grid-table/bilti-bill-process-grid-table.component";
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckedMaterialsTeamComponent } from "./transactions/checked-by-materials-team/checked-materials-team.component";
import { CheckedMaterialsTeamFilterComponent } from "./transactions/checked-by-materials-team/components/filter/checked-materials-team-filter.component";
import { CheckedMaterialsTeamGridTableComponent } from "./transactions/checked-by-materials-team/components/grid-table/checked-materials-team-grid-table.component";
import { ApprovalMaterialHeadComponent } from "./transactions/approval-material-head/approval-material-head.component";
import { ApprovalMaterialHeadFilterComponent } from "./transactions/approval-material-head/components/filter/approval-material-head-filter.component";
import { ApprovalMaterialHeadGridTableComponent } from "./transactions/approval-material-head/components/grid-table/approval-material-head-grid-table.component";
import { ChangeBiltiStatusComponent } from "./transactions/change-bilti-status/change-bilti-status.component";
import { ChangeBiltiStatusGridTableComponent } from "./transactions/change-bilti-status/components/grid-table/change-bilti-status-grid-table.component";
import { ChangeBiltiStatusFilterComponent } from "./transactions/change-bilti-status/components/filter/change-bilti-status-filter.component";
import { VendorFilterComponent } from "./master/vendor/components/filter/vendor-filter.component";
import { LookupComponent } from "./master/lookup/lookup.component";
import { LookupGridTableComponent } from "./master/lookup/components/grid-table/lookup-grid-table.component";
import { AddEditLookupComponent } from "./master/lookup/add-edit-lookup/add-edit-lookup.component";
import { LookupFilterComponent } from "./master/lookup/components/filter/lookup-filter.component";
import { AddEditVehicleComponent } from "./master/vehicle/add-edit-vehicle/add-edit-vehicle.component";
import { ExportAsModule } from 'ngx-export-as';
import { AddEditBiltiComponent } from "./transactions/bilti/add-edit-bilti/add-edit-bilti.component";
import { AddEditDispatchNoteComponent } from "./transactions/dispatch-note/add-edit-dispatch-note/add-edit-dispatch-note.component";
import { BiltiPdfModalComponent } from "./modals/bilti-pdf/bilti-pdf.component";
import { DispatchNoteModelComponent } from "./modals/dispatch-note/dispatch-note.component";
import { ChangeBiltiStatusModalComponent } from "./modals/change-bilti-status/change-bilti-status.component";
import { TransactionTypeFilterComponent } from "./master/transaction-type/components/filter/transactionType-filter.component";
import { PointFilterComponent } from "./master/point-charge/components/filter/point-filter.component";
import { AdviceFilterComponent } from "./master/advice/components/filter/advice-filter.component";
import { RejectionBiltiDetailReportComponent } from "./reports/rejection-bilti-detail-report/rejection-bilti-detail-report.component";
import { RejectionBiltiDetailReportFilterComponent } from "./reports/rejection-bilti-detail-report/components/filter/rejection-bilti-detail-report-filter.component";
import { RejectionBiltiDetailReportGridTableComponent } from "./reports/rejection-bilti-detail-report/components/grid-table/rejection-bilti-detail-report-grid-table.component";
import { ErrorLoggingReportComponent } from "./reports/error-logging-report/error-logging-report.component";
import { ErrorLoggingReportFilterComponent } from "./reports/error-logging-report/components/filter/error-logging-report-filter.component";
import { ErrorLoggingReportGridTableComponent } from "./reports/error-logging-report/components/grid-table/error-logging-report-grid-table.component";
import { DebitNoteReportFilterComponent } from "./reports/debit-note-report/components/filter/debit-note-report-filter.component";
import { DebitNoteReportGridTableComponent } from "./reports/debit-note-report/components/grid-table/debit-note-report-grid-table.component";
import { DebitNoteReportComponent } from "./reports/debit-note-report/debit-note-report.component";
import { ProvisionReportComponent } from "./reports/provision-report/provision-report.component";
import { ProvisionReportFilterComponent } from "./reports/provision-report/components/filter/provision-report-filter.component";
import { ProvisionReportGridTableComponent } from "./reports/provision-report/components/grid-table/provision-report-grid-table.component";
import { AdhocReportComponent } from "./reports/adhoc-report/adhoc-report.component";
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TableColumnsSettingsComponent } from "./reports/debit-note-report/components/table-columns-settings/table-columns-settings.component";
import { BiltiRbTxnDataComponent } from "./modals/bilti-rb-txn-data/bilti-rb-txn-data.component";
import { TemporaryMaxBiltiNoComponent } from "./modals/temporary-max-bilti-no/temporary-max-bilti-no.component";
import { ApprovalPdfComponent } from "./modals/approval-pdf/approval-pdf.component";
import { OutboundReportComponent } from "./reports/outbound-report/outbound-report.component";
import { OutboundReportFilterComponent } from "./reports/outbound-report/components/filter/outbound-report-filter.component";
import { OutboundReportGridTableComponent } from "./reports/outbound-report/components/grid-table/outbound-report-grid-table.component";
import { GlTaxationOutBoundComponent } from "./modals/gl-taxation-out-bound/gl-taxation-out-bound.component";
import { GlTdsOutBoundComponent } from "./modals/gl-tds-out-bound/gl-tds-out-bound.component";
import { InputAlphabetValidator } from "../core/shared/inputAlphabetValidator.directive";
import { InputDecimalValidator } from "../core/shared/inputDecimalValidator.directive";
import { InputIntegerValidator } from "../core/shared/inputIntegerValidator.directive";
import { ApOutboundComponent } from "./transactions/ap-outbound/ap-outbound.component";
import { ApOutboundFilterComponent } from "./transactions/ap-outbound/components/filter/ap-outbound-filter.component";
import { ApOutboundGridTableComponent } from "./transactions/ap-outbound/components/grid-table/ap-outbound-grid-table.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { GlAccrualPostingComponent } from "./transactions/gl-accrual-posting/gl-accrual-posting.component";
import { GlAccrualPostingFiltersComponent } from "./transactions/gl-accrual-posting/components/filters/gl-accrual-posting-filters.component";
import { GlAccrualPostingGridTableComponent } from "./transactions/gl-accrual-posting/components/grid-table/gl-accrual-posting-grid-table.component";
import { ProvisionalReportComponent } from "./reports/processed-report/provisional-report.component";
import { ProvisionalReportFilterComponent } from "./reports/processed-report/components/filter/provisional-report-filter.component";
import { ProvisionalReportGridTableComponent } from "./reports/processed-report/components/grid-table/provisional-report-grid-table.component";
import { StatusConfirmationComponent } from "./modals/status-confirmation/status-confirmation.component";
import { RecycleBinPlantConfigurationComponent } from "./master/recycle-bin-plant-configuration/recycle-bin-plant-configuration.component";
import { LookupTypeComponent } from "./master/lookupType/lookupType.component";
import { AddEditLookupTypeComponent } from "./master/lookupType/add-edit-lookupType/add-edit-lookupType.component";
import { LookupTypeFilterComponent } from "./master/lookupType/components/filter/lookupType-filter.component";
import { LookupTypeGridTableComponent } from "./master/lookupType/components/grid-table/lookupType-grid-table.component";

@NgModule({
    declarations: [
        ...ScreensComponents,
        ...ScreensEntryComponents,
        PlantFilterComponent, 
        PlantGridTableComponent, 
        CustomerFiltersComponent, 
        CustomerGridTableComponent, 
        CustomerComponent, 
        AddEditCustomerComponent,
        VendorComponent,
        VendorFilterComponent,
        VendorGridTableComponent,
        VehicleComponent,
        VehicleFiltersComponent,
        VehicleGridTableComponent,
        AddEditVehicleComponent,
        TransactionGridTableComponent,
        TransactionTypeComponent,
        AddEditTransactionTypeComponent,
        FreightComponent,
        FreightFilterComponent,
        FreightGridTableComponent,
        TransporterComponent,
        TransporterGridTableComponent,
        TransporterFiltersComponent,
        AddEditTransporterComponent,
        AdviceComponent,
        AdviceGridTableComponent,
        PointChargeComponent,
        AddEditPointChargeComponent,
        PointChargeGridTableComponent,
        DispatchNoteComponent,
        DispatchNoteFiltersComponent,
        DispatchNoteGridTableComponent,
        DeliveryNoteModalComponent,
        BiltiComponent,
        BiltiFilterComponent,
        BiltiGridTableComponent,
        PointMasterAccountsComponent,
        PointMasterAccountsGridTableComponent,
        PointMasterAccountsFiltersComponent,
        PointMasterMaterialComponent,
        PointMasterMaterialFiltersComponent,
        PointMasterMaterialGridTableComponent,
        FreightMasterAccountsComponent,
        FreightMasterAccountsFiltersComponent,
        FreightMasterAccountsGridTableComponent,
        FreightMasterMaterialComponent,
        FreightMasterMaterialFiltersComponent,
        FreightMasterMaterialGridTableComponent,
        ApprovalAccountsComponent,
        ApprovalAccountsFiltersComponent,
        ApprovalAccountsGridTableComponent,
        ApprovalMaterialComponent,
        ApprovalMaterialFiltersComponent,
        ApprovalMaterialGridTableComponent,
        BiltiProcessDetailsModalComponent,
        DebitNoteDetailsModalComponent,
        BiltiBillProcessViewFilterComponent,
        BiltiBillProcessViewGridTableComponent,
        BiltiBillProcessViewComponent,
        AccountMaterialBiltiProcessDetailsModalComponent,
        BiltiBillProcessComponent,
        BiltiBillProcessFilterComponent,
        BiltiBillProcessGridTableComponent,
        ProvisionalReportComponent,
        ProvisionalReportFilterComponent,
        ProvisionalReportGridTableComponent,
        RejectionBiltiDetailReportComponent,
        RejectionBiltiDetailReportFilterComponent,
        RejectionBiltiDetailReportGridTableComponent,
        CheckedMaterialsTeamComponent,
        CheckedMaterialsTeamFilterComponent,
        CheckedMaterialsTeamGridTableComponent,
        ApprovalMaterialHeadComponent,
        ApprovalMaterialHeadFilterComponent,
        ApprovalMaterialHeadGridTableComponent,
        ChangeBiltiStatusComponent,
        ChangeBiltiStatusGridTableComponent,
        ChangeBiltiStatusFilterComponent,
        LookupComponent,
        LookupGridTableComponent,
        AddEditLookupComponent,
        LookupFilterComponent,
        LookupTypeComponent,
        LookupTypeGridTableComponent,
        AddEditLookupTypeComponent,
        LookupTypeFilterComponent,
        AddEditBiltiComponent,
        AddEditDispatchNoteComponent,
        BiltiPdfModalComponent,
        DispatchNoteModelComponent,
        ChangeBiltiStatusModalComponent,
        TransactionTypeFilterComponent,
        PointFilterComponent,
        AdviceFilterComponent,
        ErrorLoggingReportComponent,
        ErrorLoggingReportFilterComponent,
        ErrorLoggingReportGridTableComponent,
        DebitNoteReportComponent,
        DebitNoteReportFilterComponent,
        DebitNoteReportGridTableComponent,
        ProvisionReportComponent,
        ProvisionReportFilterComponent,
        ProvisionReportGridTableComponent,
        AdhocReportComponent,
        TableColumnsSettingsComponent,
        BiltiRbTxnDataComponent,
        TemporaryMaxBiltiNoComponent,
        ApprovalPdfComponent,
        OutboundReportComponent,
        OutboundReportFilterComponent,
        OutboundReportGridTableComponent,
        GlTaxationOutBoundComponent,
        GlTdsOutBoundComponent,
        InputAlphabetValidator,
        InputDecimalValidator,
        InputIntegerValidator,
        ApOutboundComponent,
        ApOutboundFilterComponent,
        ApOutboundGridTableComponent,
        GlAccrualPostingComponent,
        GlAccrualPostingFiltersComponent,
        GlAccrualPostingGridTableComponent,
        StatusConfirmationComponent, 
        RecycleBinPlantConfigurationComponent
    ],
    imports: [
        LayoutModule,
        ScreensRoutingModule,
        CommonModule,
        NgbTooltipModule,
        NgbPopover,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule,
        ExportAsModule,
        NgbPopoverModule,
        NgbDatepicker,
        NgbDatepickerModule,
        DragDropModule,
        NgbPagination,
        NgMultiSelectDropDownModule
    ],
    providers: [],
})
export class ScreensModule { }
