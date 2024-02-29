import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-edit-vehicle',
  templateUrl: './add-edit-vehicle.component.html',
  styleUrl: './add-edit-vehicle.component.scss'
})
export class AddEditVehicleComponent {
  constructor(private router: Router) {}

  onCancelPress(){
    this.router.navigate(['master/vehicle']);
  }
}