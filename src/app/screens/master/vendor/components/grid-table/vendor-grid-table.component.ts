import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { VendorService } from '../../../../../core/service/vendor.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vendor-grid-table',
  templateUrl: './vendor-grid-table.component.html',
  styleUrl: './vendor-grid-table.component.scss'
})
export class VendorGridTableComponent implements OnInit, OnChanges {
  constructor(
    private router: Router,
    private vendorService: VendorService,
    private toastr: ToastrService
  ) { }

  @Input() searchedVendor: any;
  vendorListOrg: any;
  vendorList!: any;
  loadSpinner: boolean = true;

  ngOnInit(): void {
    this.getAllVendorList();
  }

  //SORTING DATA FROM FILTER CHANGES
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchedVendor'].currentValue) {
      this.getFilteredVendorsList();
    } else if (changes['searchedVendor'].firstChange === false && changes['searchedVendor'].currentValue === '') {
      this.getAllVendorList();
    }

  }
  
  //GETTINGS VENDOR LISTING ON PAGE LOAD
  getAllVendorList() {
    let data = {
      "vendorCode": '',
      "vendorName": ''
    }
    this.vendorService.getVendors(data).subscribe((response: any) => {
      this.vendorList = response.vendors;
      this.vendorListOrg = response.vendors;
      this.loadSpinner = false;
    },
      error => {
        this.toastr.error(error.statusText, error.status);
        this.loadSpinner = false;
      }
    );
  }

  //THIS IS EVENT EMITTED FN. WHICH CALLS WHEN WE SEARCH Vendor FROM FILTERS 
  getFilteredVendorsList() {
    let data = {
      "vendorCode": this.searchedVendor.vendorCode,
      "vendorName": this.searchedVendor.vendorName
    }
    this.vendorService.getVendors(data).subscribe((response: any) => {
      this.vendorList = response.vendors;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

  //NAVIGATING TO VENDOR EDIT/UDATE COMPONENT
  onGoToEditVendor(vendorData: any) {
    this.router.navigate(['master/addEditVendor', vendorData.id]);
  }
}