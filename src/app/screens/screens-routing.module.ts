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
import { TransactionTypeComponent } from "./master/transaction-type/transaction-type.component";
import { FreightComponent } from "./master/freight/freight.component";
import { AddEditFreightComponent } from "./master/freight/add-edit-freight/add-edit-freight.component";
import { TransporterComponent } from "./master/transporter/transporter.component";
import { AddEditTransporterComponent } from "./master/transporter/add-edit-transporter/add-edit-transporter.component";
import { AdviceComponent } from "./master/advice/advice.component";
import { AddEditAdviceComponent } from "./master/advice/add-edit-advice/add-edit-advice.component";

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
            { path: 'master/transactionTypes', component: TransactionTypeComponent },
            { path: "master/freight", component: FreightComponent },
            { path: "master/addEditFreight", component: AddEditFreightComponent },
            { path: "master/transporter", component: TransporterComponent },
            { path: "master/addEditTransporter", component: AddEditTransporterComponent },
            { path: "master/advice", component: AdviceComponent },
            { path: "master/addEditAdvice", component: AddEditAdviceComponent },
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
