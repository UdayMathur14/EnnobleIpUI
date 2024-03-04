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
            { path: "master/pointCharge", component: PointChargeComponent },
            { path: "master/addEditPointCharge", component: AddEditPointChargeComponent },
            { path: "transaction/dispatchNote", component: DispatchNoteComponent },
            { path: "transaction/addEditDispatchNote", component: AddEditDispatchNoteComponent },
            { path: "transaction/bilti", component: BiltiComponent },
            { path: "transaction/addEditBilti", component: AddEditBiltiComponent },
            { path: "transaction/pointMasterAccounts", component: PointMasterAccountsComponent},
            { path: "transaction/pointMasterMaterial", component: PointMasterMaterialComponent},
            { path: "transaction/freightMasterAccounts", component: FreightMasterAccountsComponent},
            { path: "transaction/freightMasterMaterial", component: FreightMasterMaterialComponent},
            { path: "transaction/approvalAccounts", component: ApprovalAccountsComponent},
            { path: "transaction/approvalMaterial", component: ApprovalMaterialComponent}
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
