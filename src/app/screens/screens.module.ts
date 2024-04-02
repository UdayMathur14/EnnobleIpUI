import { NgModule } from "@angular/core";
import { ScreensComponents, ScreensEntryComponents, ScreensRoutingModule } from "./screens-routing.module";
import { LayoutModule } from "../layout";
import { PlantFilterComponent } from "./master/plant/components/filter/plant-filter.component";
import { PlantGridTableComponent } from "./master/plant/components/plant-grid-table/plant-grid-table.component";
import { CommonModule } from "@angular/common";
import { PartFiltersComponent } from "./master/part/components/filter/part-filter.component";
import { PartGridTableComponent } from "./master/part/components/grid-table/part-grid-table.component";
import { PartComponent } from "./master/part/part.component";
import { AddEditPartComponent } from "./master/part/add-edit-part/add-edit-part.component";
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
import { NgbTooltipModule, NgbPopover } from '@ng-bootstrap/ng-bootstrap';
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
import { LookupTypeComponent } from "./master/lookup-type/lookup-type.component";
import { LookupTypeFilterComponent } from "./master/lookup-type/components/filter/lookup-type-filter.component";
import { LookupTypeGridTableComponent } from "./master/lookup-type/components/grid-table/lookup-type-grid-table.component";
import { AddEditLookupTypeComponent } from "./master/lookup-type/add-edit-lookup-type/add-edit-lookup-type.component";
import { AddEditVehicleComponent } from "./master/vehicle/add-edit-vehicle/add-edit-vehicle.component";


@NgModule({
    declarations: [
        ...ScreensComponents,
        ...ScreensEntryComponents,
        PlantFilterComponent, 
        PlantGridTableComponent, 
        PartFiltersComponent, 
        PartGridTableComponent, 
        PartComponent, 
        AddEditPartComponent,
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
        LookupTypeFilterComponent,
        LookupTypeGridTableComponent,
        AddEditLookupTypeComponent
    ],
    imports: [
        LayoutModule,
        ScreensRoutingModule,
        CommonModule,
        NgbTooltipModule,
        NgbPopover,
        NgSelectModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [],
})
export class ScreensModule { }
