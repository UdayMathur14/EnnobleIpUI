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

  @Output() filterKeyword: EventEmitter<any> = new EventEmitter();
  vendorsList: any;
  vendorName: string = "";
  vendorCode: string = "";


  ngOnInit(): void {
    this.getAllVendorsListInit();
  }

  getAllVendorsListInit() {
    this.vendorService.getVendors({}).subscribe((response: any) => {
      this.vendorsList = response.vendors;
    }, error => {
      this.toastr.error(error.statusText, error.status);
    });
  }

  onVendorSearch() {
    if (this.vendorCode || this.vendorName) {
      const filterKeyword = {
        vendorCode: this.vendorCode,
        vendorName: this.vendorName
      };
      this.filterKeyword.emit(filterKeyword);
    }
    else {
      this.filterKeyword.emit(null);
    }
  }

}

