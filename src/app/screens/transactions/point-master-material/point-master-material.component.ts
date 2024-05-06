import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-point-master-material',
  templateUrl: './point-master-material.component.html',
  styleUrl: './point-master-material.component.scss'
})
export class PointMasterMaterialComponent {
  constructor(private router : Router){}

  isFilters : boolean = true;
  searchedPoint: any;
  searchFreightCode(e: any) {
    this.searchedPoint = event;
  }
}
