import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle-grid-table',
  templateUrl: './vehicle-grid-table.component.html',
  styleUrl: './vehicle-grid-table.component.scss'
})
export class VehicleGridTableComponent {
  constructor(private router: Router) {}

  onEditVehicle(){
    this.router.navigate(['master/addEditVehicle']);
  }

}