import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-vendor-filter',
  templateUrl: './vendor-filter.component.html',
  styleUrl: './vendor-filter.component.scss'
})
export class VendorFilterComponent implements OnInit {
  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Input() filters: any = [];
  vendorCode : any = undefined;
  vendorName : any = undefined;
  vendorType : any = undefined;
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
      "vendorCode": this.vendorCode || "",
      "vendorName": this.vendorName || "",
      "vendorType": this.vendorType || "",
      "status": this.status || ""
    }
    this.getData.emit(filterData)
  }

  onClearFilter() {
    this.vendorCode = undefined;
    this.vendorName = undefined;
    this.vendorType = undefined;
    this.status = undefined;
    const filterData = {
      "vendorCode": undefined,
      "vendorName": undefined,
      "vendorType": undefined,
      "status": undefined
    }
    this.getData.emit(filterData)
  }
}
