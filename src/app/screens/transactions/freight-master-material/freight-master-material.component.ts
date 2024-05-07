import { Component } from '@angular/core';

@Component({
  selector: 'app-freight-master-material',
  templateUrl: './freight-master-material.component.html',
  styleUrl: './freight-master-material.component.scss'
})
export class FreightMasterMaterialComponent {
  searchedFreight: any;
  isFilters: boolean = true;
  //HOLDING SEARCHED VALUE FROM FILTERS
  searchFreightCode(event: any) {
    this.searchedFreight = event;
  }
}
