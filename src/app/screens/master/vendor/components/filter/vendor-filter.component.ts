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

  @Output() vendorFilterData: EventEmitter<any> = new EventEmitter();
  vendorCod!: string | undefined;
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

  onVendorSearch() {
    let obj = {
      "vendorCode": this.vendorCod || "",
      "vendorName": this.vendorNam || ""
    }
    this.vendorFilterData.emit(obj)

  }
  onClearFilter(){
    this.vendorCod = undefined;
    this.vendorNam = '';
    let obj = {
      vendorCod : '',
      vendorNam : ''
    }
    this.vendorFilterData.emit(obj)
  }
}