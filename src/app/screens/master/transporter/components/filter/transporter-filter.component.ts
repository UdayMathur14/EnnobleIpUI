import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
  selector: 'app-transporter-filter',
  templateUrl: './transporter-filter.component.html',
  styleUrl: './transporter-filter.component.scss'
})
export class TransporterFiltersComponent implements OnInit {
  @Input() states : any[] = [];
  @Input() cities : any[] = [];
  @Input() transportersList : any[] = [];
  @Input() locationIds : any = undefined;
  @Input() locations : any[] = [];
  @Output() getData: EventEmitter<any> = new EventEmitter();
  transCode: any = undefined;
  transName: any = undefined;
  cityCode : any = undefined;
  stateCode : any = undefined;
  taxationType : any = undefined;

  constructor() { }

  ngOnInit(): void {
  }

  onClearFilter(){
    this.transCode = undefined;
    this.transName = undefined;
    this.cityCode = undefined;
    this.stateCode = undefined;
    this.taxationType = undefined;
    this.locationIds = [];

    const filterData = {
      "transCode" : "",
      "transName" : "",
      "cityCode" : "",
      "stateCode" : "",
      "taxationType" : "",
      "locations" : []
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
      "locations" : this.locationIds || []
    }
    this.getData.emit(filterData)
  }

}
