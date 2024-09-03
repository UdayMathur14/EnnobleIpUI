import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-filter',
  templateUrl: './plant-filter.component.html',
  styleUrls: ['./plant-filter.component.scss']
})
export class PlantFilterComponent implements OnInit {
  @Input() locations: any[] = [];
  @Input() filters: any = [];
  locationIds: any[] = APIConstant.commonLocationsList.map((e: any) => (e.id));;
  @Output() getData: EventEmitter<any> = new EventEmitter();
  plantCode: any = undefined;
  stateCode: any = undefined;
  cityCode: any = undefined;
  status: any = undefined;
  auCode: any= undefined;
  siteCode: any= undefined;

ngOnInit(): void {
  console.log(this.locationIds);
  
}
  onPlantSearch() {
    const filterData = {
      plantCode: this.plantCode,
      auCode: this.auCode,
      siteCode: this.siteCode,
      locations: this.locationIds,
      status: this.status
    }
    this.getData.emit(filterData)
  }

  onClearFilter() {
    this.plantCode = undefined;
    this.auCode = undefined
    this.siteCode = undefined;
    this.locationIds = [];
    this.status = undefined;

    const filterData = {
      plantCode: undefined,
      auCode: undefined,
      siteCode: undefined,
      locations: [],
      status: undefined
    }
    this.getData.emit(filterData)
  }
}
