import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ValidateComponent } from "./validate/validate.component";

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./screens/screens.module").then((m) => m.ScreensModule),
  },
  { path: "validate", component: ValidateComponent },
  // { path: 'hall-ticket', loadChildren: () => import('./screens/hall-ticket/hall-ticket.module').then(m => m.HallTicketModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  
  exports: [RouterModule],
})
export class AppRoutingModule { }
