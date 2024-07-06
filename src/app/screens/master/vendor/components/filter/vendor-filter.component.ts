import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-vendor-filter',
  templateUrl: './vendor-filter.component.html',
  styleUrl: './vendor-filter.component.scss'
})
export class VendorFilterComponent implements OnInit {
  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Input() filters: any = [];
  vendorCod : any = undefined;
  vendorNam : any = undefined;
  city : any = undefined;
  state : any = undefined;
  taxationType : any = undefined;
  paidByDetails : any = undefined;
  status : any = undefined;
  constructor(
  ) { }

  ngOnInit(): void {
  }



  onVendorSearch() {
    let filterData = {
      "city": this.city || "",
      "state": this.state || "",
      "taxationType": this.taxationType || "",
      "paidByDetail": this.paidByDetails || "",
      "vendorCode": this.vendorCod || "",
      "vendorName": this.vendorNam || "",
      "status": this.status || ""
    }
    this.getData.emit(filterData)
  }

  onClearFilter() {
    this.city = undefined;
    this.state = undefined;
    this.taxationType = undefined;
    this.paidByDetails = undefined;
    this.vendorCod = undefined;
    this.vendorNam = undefined;
    this.status = undefined;
    const filterData = {
      "city": undefined,
      "state": undefined,
      "taxationType": undefined,
      "paidByDetail": undefined,
      "vendorCode": undefined,
      "vendorName": undefined,
      "status": undefined
    }
    this.getData.emit(filterData)
  }
}
