import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    loadChildren: () => import("./screens/screens.module").then((m) => m.ScreensModule),
  },
  // { path: 'hall-ticket', loadChildren: () => import('./screens/hall-ticket/hall-ticket.module').then(m => m.HallTicketModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
