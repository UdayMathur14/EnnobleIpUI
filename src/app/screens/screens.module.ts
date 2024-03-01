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
        FreightComponent,
        FreightFilterComponent,
        FreightGridTableComponent
    ],
    imports: [
        LayoutModule,
        ScreensRoutingModule,
        CommonModule
    ],
    providers: [],
})
export class ScreensModule { }
