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

  @Output() vendorCode: EventEmitter<string> = new EventEmitter();
  vendorsList: any;
  vendorName: string = "";
  vendorCod!: any;


  ngOnInit(): void {
    this.getAllVendorsListInit();
  }

  getAllVendorsListInit() {
    let data = {
      "vendorCode": ''
    }
    this.vendorService.getVendors(data).subscribe((response: any) => {
      this.vendorsList = response.vendors;
    }, error => {
      this.toastr.error(error.statusText, error.status);
    })
  }

  onVendorSearch(vendorCod: string) {
    this.vendorCode.emit(vendorCod)
  }

}

