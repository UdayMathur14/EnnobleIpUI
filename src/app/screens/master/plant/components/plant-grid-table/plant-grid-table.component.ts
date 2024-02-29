import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-plant-grid-table',
  templateUrl: './plant-grid-table.component.html',
  styleUrl: './plant-grid-table.component.scss'
})
export class PlantGridTableComponent {
  constructor(private router: Router) {}

  onGoToEditPlant(){
    this.router.navigate(['master/addEditPlant']);
  }
}