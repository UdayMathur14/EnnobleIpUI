import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { VendorService } from '../../../../../core/service/vendor.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-vendor-filter',
  templateUrl: './vendor-filter.component.html',
  styleUrl: './vendor-filter.component.scss'
})
export class VendorFilterComponent implements OnInit {
  constructor(
    private vendorService: VendorService,
    private toastr: ToastrService
  ) { }

  @Output() vendorCode : EventEmitter<string> = new EventEmitter();
  // @Output() filter: EventEmitter<any> = new EventEmitter();

  vendorCod!: string;
  vendorsList: any;
  vendorNam!: string;


  ngOnInit(): void {
    this.getAllVendorsListInit();
  }

  getAllVendorsListInit() {
    let data = {
      "vendorCode": '',
      "vendorName": ''
    }
    this.vendorService.getVendors(data).subscribe((response: any) => {
      this.vendorsList = response.vendors;
    }, error => {
      this.toastr.error(error.statusText, error.status);
    });
  }

  onVendorSearch(vendorCod: string){
    this.vendorCode.emit(vendorCod)

  }
  // onVendorSearch() {
  //   const filterData = {
  //     "vendorCode": this.vendorCod,
  //     "vendorName": this.vendorNam
  //   };
  //   // this.filter.emit(filterData);
  //   this.vendorCode.emit(filterData);

  // }

}

