import { Routes, RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { ScreensComponent } from "./screens.component";
import { PlantComponent } from "./master/plant/plant.component";
import { PartComponent } from "./master/part/part.component";
import { AddEditPartComponent } from "./master/part/add-edit-part/add-edit-part.component";
import { AddEditPlantComponent } from "./master/plant/add-edit-plant/add-edit-plant.component";
import { VendorComponent } from "./master/vendor/vendor.component";
import { AddEditVendorComponent } from "./master/vendor/add-edit-vendor/add-edit-vendor.component";
import { VehicleComponent } from "./master/vehicle/vehicle.component";
import { AddEditVehicleComponent } from "./master/vehicle/add-edit-vehicle/add-edit-vehicle.component";

const routes: Routes = [
    {
        path: "",
        component: ScreensComponent,
        children: [
            { path: "", redirectTo: "master", pathMatch: "full" },
            { path: "master", component: PlantComponent },
            { path: "master/plant", component: PlantComponent },
            { path: "master/addEditPlant", component: AddEditPlantComponent },
            { path: "master/part", component: PartComponent },
            { path: "master/addEditPart", component: AddEditPartComponent },
            { path: "master/vendor", component: VendorComponent },
            { path: "master/addEditVendor", component: AddEditVendorComponent },
            { path: "master/vehicle", component: VehicleComponent },
            { path: "master/addEditVehicle", component: AddEditVehicleComponent },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ScreensRoutingModule { }

export const ScreensComponents = [
    ScreensComponent,
    PlantComponent
];

export const ScreensEntryComponents = [];
