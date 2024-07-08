import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../../core/service/vendor.service';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../core/service/lookup.service';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent implements OnInit{

  isFilters: boolean = true;
  searchedVendor: string = '';
  fullScreen : boolean = false;
  loadSpinner : boolean = true;
  vendorsList : any[] = [];
  cities : any[] = [];
  states : any[] = [];
  headers: any [] = [];
  currentPage: number = 1;
  count: number = 10;
  totalVendors: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  constructor(
    private vendorService : VendorService,
    private toastr: ToastrService,
    private lookupService : LookupService,
    private xlsxService : XlsxService
  ) { }

  ngOnInit(): void {
    this.getVendorsList();
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  getVendorsList(offset: number = 0, count: number = this.count, filters: any = this.appliedFilters) {
    let data = {
      "vendorCode": filters?.vendorCode || "",
      "vendorName": filters?.vendorName || "",
      "city": filters?.city || "",
      "state": filters?.state || "",
      "taxationType": filters?.taxationType || "",
      "paidByDetail": filters?.paidByDetail || "",
      "status": filters?.status || ""
    }
    this.vendorService.getVendors(data, offset, count).subscribe((response: any) => {
      this.vendorsList = response.vendors;
      this.totalVendors = response.paging.total;
      this.filters = response.filters
      this.loadSpinner = false;
      // this.allVendorNames = response.vendors.map((vendor: any) => vendor.vendorName);
    }, error => {
      this.loadSpinner = false;
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
    });
  }


  getData(e:any){
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getVendorsList(0, this.count, this.appliedFilters);
  }

  exportData(fileName: string = "Vendor") {
    // Map the data to include only the necessary fields
    const mappedVendorsList = this.vendorsList.map(vendor => ({
      vendorCode: vendor.vendorCode,
      vendorName: vendor.vendorName,
      vendorAddress1: vendor.vendorAddress1,
      contactNumber: vendor.contactNumber,
      email: vendor.email,
      state: vendor.state.value,
      city: vendor.city.value,
      gstnNo: vendor.gstnNo,
      payTermCode: vendor.payTermCode,
      payTermStatus: vendor.payTermStatus,
      status: vendor.status,
  
    }));
    this.xlsxService.xlsxExport(mappedVendorsList, this.headers, fileName);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getVendorsList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getVendorsList(0, this.count, this.appliedFilters);
    }
}