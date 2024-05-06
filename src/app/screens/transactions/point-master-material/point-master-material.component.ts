import { Component } from '@angular/core';

@Component({
  selector: 'app-point-master-material',
  templateUrl: './point-master-material.component.html',
  styleUrl: './point-master-material.component.scss'
})
export class PointMasterMaterialComponent {

  isFilters : boolean = true;
  searchedPoint: any;
  // HOLDING SEARCHED VALUES FROM FILTER
  searchFreightCode(event: any) {
    this.searchedPoint = event;
  }
}
