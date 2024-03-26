import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { VendorService } from '../../../../../core/service/vendor.service';
import { BaseService } from '../../../../../core/service/base.service';
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
    private baseService: BaseService,
    private toastr: ToastrService
  ) { }

  @Input()
  filterKeyword!: string;
  vendorListOrg: any;
  vendorList: any;

  ngOnInit(): void {
    this.getAllVendorList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.vendorListOrg && this.vendorListOrg.length && changes['filterKeyword'].currentValue) {
      this.vendorList = this.vendorListOrg.filter((e: any) => e.vendorCode.toLowerCase().indexOf(changes['filterKeyword'].currentValue.toLowerCase()) !== -1)
    }
    else if (this.vendorListOrg && this.vendorListOrg.length && !changes['filterKeyword'].currentValue) {
      this.vendorList = this.vendorListOrg;
    }
  }

  getAllVendorList() {
    let data = {
      "vendorCode": ''
    }
    this.vendorService.getVendors(data).subscribe((response: any) => {
      this.vendorList = response.vendors;
      this.vendorListOrg = response.vendors;
      this.baseService.vendorSpinner.next(false);
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.baseService.vendorSpinner.next(false);
    })
  }

  onGoToEditVendor(vendorData: any) {
    this.router.navigate(['master/addEditVendor', vendorData.id]);
  }
}
