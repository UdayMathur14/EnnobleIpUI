import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent {
  constructor(private router : Router){}

  isFilters : boolean = true;
  searchedVehicle: string = '';

  onCreateVehicle(){
    this.router.navigate(['master/addVehicle'])
  }

  searchVehicle(event: any) {
    this.searchedVehicle = event;
  }
}
