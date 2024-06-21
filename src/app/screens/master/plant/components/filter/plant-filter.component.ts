import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-filter',
  templateUrl: './plant-filter.component.html',
  styleUrls: ['./plant-filter.component.scss']
})
export class PlantFilterComponent {
  @Input() locations: any[] = [];
  @Input() plantsList: any[] = [];
  @Input() cities: any[] = [];
  @Input() states: any[] = [];
  locationIds: any[] = APIConstant.locationsListDropdown.map((e: any) => (e.id));;
  @Output() getData: EventEmitter<any> = new EventEmitter();
  plantCode: any = undefined;
  stateCode: any = undefined;
  cityCode: any = undefined;
  auCode: any;
  siteCode: any;



  onPlantSearch() {
    const filterData = {
      plantCode: this.plantCode,
      city: this.cityCode,
      state: this.stateCode,
      auCode: this.auCode,
      siteCode: this.siteCode,
      locations: this.locationIds
    }
    this.getData.emit(filterData)
  }

  onClearFilter() {
    this.plantCode = undefined;
    this.cityCode = undefined
    this.stateCode = undefined
    this.auCode = undefined
    this.siteCode = undefined;
    this.locationIds = [];

    const filterData = {
      plantCode: undefined,
      city: undefined,
      state: undefined,
      auCode: undefined,
      siteCode: undefined,
      locations: []
    }
    this.getData.emit(filterData)
  }

}
