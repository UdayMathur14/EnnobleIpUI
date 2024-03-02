import { NgModule } from "@angular/core";
import { ScreensComponents, ScreensEntryComponents, ScreensRoutingModule } from "./screens-routing.module";
import { LayoutModule } from "../layout";
import { PlantFilterComponent } from "./master/plant/components/filter/plant-filter.component";
import { PlantGridTableComponent } from "./master/plant/components/plant-grid-table/plant-grid-table.component";
import { CommonModule } from "@angular/common";
import { PartFiltersComponent } from "./master/part/components/filter/part-filter.component";
import { PartGridTableComponent } from "./master/part/components/grid-table/part-grid-table.component";
import { PartComponent } from "./master/part/part.component";
import { VendorComponent } from './master/vendor/vendor.component';
import { VendorGridTableComponent } from './master/vendor/components/grid-table/vendor-grid-table/vendor-grid-table.component';
import { VehicleComponent } from "./master/vehicle/vehicle.component";
import { VehicleFiltersComponent } from "./master/vehicle/components/filter/vehicle-filter.component";
import { VehicleGridTableComponent } from "./master/vehicle/components/grid-table/vehicle-grid-table.component";
import { FreightComponent } from "./master/freight/freight.component";
import { FreightFilterComponent } from "./master/freight/components/filter/freight-filter.component";
import { FreightGridTableComponent } from "./master/freight/components/freight-grid-table/freight-grid-table.component";
import { AutoCompleteModule } from 'primeng/autocomplete';
import { TransactionGridTableComponent } from "./master/transaction-type/components/transaction-type-grid-table/transaction-grid-table.component";
import { TransactionTypeComponent } from "./master/transaction-type/transaction-type.component";
import { TransporterComponent } from "./master/transporter/transporter.component";
import { TransporterGridTableComponent } from "./master/transporter/components/grid-table/transporter-grid-table.component";
import { TransporterFiltersComponent } from "./master/transporter/components/filter/transporter-filter.component";
import { AddEditTransporterComponent } from "./master/transporter/add-edit-transporter/add-edit-transporter.component";
import { AdviceComponent } from "./master/advice/advice.component";
import { AdviceGridTableComponent } from "./master/advice/components/advice-grid-table/advice-grid-table.component";
import { PointChargeComponent } from "./master/point-charge/point-charge.component";
import { AddEditPointChargeComponent } from "./master/point-charge/add-edit-point-charge/add-edit-point-charge.component";
import { PointChargeGridTableComponent } from "./master/point-charge/components/point-charge-grid-table/point-charge-grid-table.component";
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
    declarations: [
        ...ScreensComponents, 
        ...ScreensEntryComponents, 
        PlantFilterComponent, 
        PlantGridTableComponent, 
        PartFiltersComponent, 
        PartGridTableComponent, 
        PartComponent, 
        VendorComponent, 
        VendorGridTableComponent,
        VehicleComponent,
        VehicleFiltersComponent,
        VehicleGridTableComponent,
        TransactionGridTableComponent,
        TransactionTypeComponent,
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
        PointChargeGridTableComponent
    ],
    imports: [
        LayoutModule,
        ScreensRoutingModule,
        CommonModule,
        AutoCompleteModule,
        NgbTooltipModule
    ],
    providers: [],
})
export class ScreensModule { }
