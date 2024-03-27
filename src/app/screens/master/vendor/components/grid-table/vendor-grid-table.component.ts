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
  filterKeyword!: any;
  vendorListOrg: any[] = [];
  vendorList!: any[];

  ngOnInit(): void {
    this.getAllVendorList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filterKeyword'] && changes['filterKeyword'].currentValue) {
      this.applyFilter();
    }
  }

  getAllVendorList() {
    this.vendorService.getVendors({}).subscribe(
      (response: any) => {
        this.vendorList = response.vendors;
        this.vendorListOrg = [...this.vendorList];
        this.applyFilter();
        this.baseService.vendorSpinner.next(false);
      },
      (error) => {
        this.toastr.error(error.statusText, error.status);
        this.baseService.vendorSpinner.next(false);
      }
    );
  }

  applyFilter() {
    if (!this.filterKeyword) {
      this.vendorList = [...this.vendorListOrg];
      return;
    }
    const { vendorCode, vendorName } = this.filterKeyword;
    if (!vendorCode && !vendorName) {
      this.vendorList = [...this.vendorListOrg];
      return;
    }
    this.vendorList = this.vendorListOrg.filter((vendor) => {
      const codeMatch = vendor.vendorCode.toLowerCase().includes(vendorCode.toLowerCase());
      const nameMatch = vendor.vendorName.toLowerCase().includes(vendorName.toLowerCase());
      return codeMatch && nameMatch;
    });
  }

  onGoToEditVendor(vendorData: any) {
    this.router.navigate(['master/addEditVendor', vendorData.id]);
  }
}
