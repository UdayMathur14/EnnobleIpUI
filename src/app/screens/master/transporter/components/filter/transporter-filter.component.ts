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
<<<<<<< HEAD
  @Input() locationIds : any = undefined;
  @Input() locations : any[] = [];
=======
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
  @Output() getData: EventEmitter<any> = new EventEmitter();
  transCode: any = undefined;
  transName: any = undefined;
  cityCode : any = undefined;
  stateCode : any = undefined;
<<<<<<< HEAD
=======
  locations : any = undefined;
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
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
<<<<<<< HEAD
    this.locationIds = [];

    const filterData = {
      "transCode" : "",
      "transName" : "",
      "cityCode" : "",
      "stateCode" : "",
      "taxationType" : "",
      "locations" : []
=======
    this.locations = undefined;

    const filterData = {
      "transCode" : undefined,
      "transName" : undefined,
      "cityCode" : undefined,
      "stateCode" : undefined,
      "taxationType" : undefined,
      "locations" : undefined
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
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
<<<<<<< HEAD
      "locations" : this.locationIds || []
=======
      "locations" : this.locations || ""
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
    }
    this.getData.emit(filterData)
  }

}
