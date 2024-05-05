import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-freight-master-material',
  templateUrl: './freight-master-material.component.html',
  styleUrl: './freight-master-material.component.scss'
})
export class FreightMasterMaterialComponent {
  constructor(private router : Router){}
  searchedFreight: any;
  isFilters : boolean = true;
  //HOLDING SEARCHED VALUE FROM FILTERS
  searchFreightCode(event: any) {
    this.searchedFreight = event;
  }
}
