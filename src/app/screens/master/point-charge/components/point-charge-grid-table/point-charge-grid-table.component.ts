import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-point-charge-grid-table',
  templateUrl: './point-charge-grid-table.component.html',
  styleUrl: './point-charge-grid-table.component.scss'
})
export class PointChargeGridTableComponent {
  constructor(
    private router: Router
  ) { }

  onEditPointCharge() {
    this.router.navigate(['master/addEditPointCharge']);
  }

}