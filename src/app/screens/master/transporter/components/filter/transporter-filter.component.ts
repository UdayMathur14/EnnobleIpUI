import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { APIConstant } from '../../../../../core/constants';
import { LookupService } from '../../../../../core/service/lookup.service';

@Component({
  selector: 'app-transporter-filter',
  templateUrl: './transporter-filter.component.html',
  styleUrl: './transporter-filter.component.scss'
})
export class TransporterFiltersComponent implements OnInit {
  @Input() filters : any = [];
  commonLocations: any = [];
  locationIds : any[] = APIConstant.commonLocationsList.map((e:any)=>(e.id));
  locations : any[] = APIConstant.commonLocationsList;
  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Output() locationsData: EventEmitter<any[]> = new EventEmitter();
  transCode: any = undefined;
  transName: any = undefined;
  cityCode : any = undefined;
  stateCode : any = undefined;
  taxationType : any = undefined;
  status: any = undefined;

  constructor(private lookupService: LookupService) { }

  ngOnInit(): void {

  }

  onClearFilter(){
    this.transCode = undefined;
    this.transName = undefined;
    this.cityCode = undefined;
    this.stateCode = undefined;
    this.taxationType = undefined;
    this.status = undefined;
    this.locationIds = this.locationIds;

    const filterData = {
      "transCode" : "",
      "transName" : "",
      "cityCode" : "",
      "stateCode" : "",
      "taxationType" : "",
      "status": "",
      "locations" : this.locationIds
    }
    this.getData.emit(filterData)
  }

  onTransporterSearch(){
    const filterData = {
      "transCode" : this.transCode || "",
      "transName" : this.transName || "",
      "cityCode" : this.cityCode || "",
      "stateCode" : this.stateCode || "",
      "taxationType" : this.taxationType || "",
      "status": this.status || "",
      "locations" : this.locationIds || []
    }
    this.getData.emit(filterData)
  }

}
