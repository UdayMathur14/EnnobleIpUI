import { Component, OnInit } from '@angular/core';
import { VendorService } from '../../../core/service/vendor.service';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../core/service/lookup.service';
import { XlsxService } from '../../../core/service/xlsx.service';
import { Router } from '@angular/router';

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
    private router: Router,
    private lookupService : LookupService,
    private xlsxService : XlsxService
  ) { }

  ngOnInit(): void {
    this.getVendorsList();
  }
  onCreateVendor() {
    this.router.navigate(['master/addEditVendor', '0']);
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  getVendorsList(offset: number = 0, count: number = this.count, filters: any = this.appliedFilters) {
    let data = {
      "vendorName": filters?.vendorName || "",
      "vendorCode": filters?.vendorCode || "",
      "vendorType": filters?.vendorType || "",
      "status": filters?.status || ""
    }
    this.vendorService.getVendors(data, offset, count).subscribe((response: any) => {
      console.log(response);
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
    let data = {
      "vendorCode": this.appliedFilters?.vendorCode || "",
      "vendorName": this.appliedFilters?.vendorName || "",
      "vendorType": this.appliedFilters?.vendorType || "",
      "status": this.appliedFilters?.status || ""
    }
    this.vendorService.getVendors(data, 0, this.totalVendors).subscribe((response: any) => {
      const vendorListToExport = response.vendors;
      // Map the data to include only the necessary fields
      const mappedVendorsList = vendorListToExport.map((vendor: any) => ({
        vendorType: vendor.vendorType || '',
        vendorCode: vendor.vendorCode || '',
        vendorName: vendor.vendorName || '',
        billingAddressLine1: vendor.billingAddressLine1 || '',
        billingAddressLine2: vendor.billingAddressLine2 || '',
        billingCity: vendor.billingCity || '',
        billingState: vendor.billingState || '',
        billingCountry: vendor.billingCountry || '',
        billingPinCode: vendor.billingPinCode || '',
        shippingAddressLine1: vendor.shippingAddressLine1 || '',
        shippingAddressLine2: vendor.shippingAddressLine2 || '',
        shippingCity: vendor.shippingCity || '',
        shippingState: vendor.shippingState || '',
        shippingCountry: vendor.shippingCountry || '',
        shippingPinCode: vendor.shippingPinCode || '',
        pan: vendor.pan || '',
        gst: vendor.gst || '',
        gstTreatment: vendor.gstTreatment || '',
        msmeRegistered: vendor.msmeRegistered ? 'Yes' : 'No',
        msmeType: vendor.msmeType || '',
        msmeNo: vendor.msmeNo || '',
        contactPersonName: vendor.contactPersonName || '',
        designation: vendor.designation || '',
        email1: vendor.email1 || '',
        email2: vendor.email2 || '',
        phoneMobileNo: vendor.phoneMobileNo || '',
        currency: vendor.currency || '',
        paymentTerms: vendor.paymentTerms || '',
        bankName: vendor.bankName || '',
        accountHolderName: vendor.accountHolderName || '',
        accountNumber: vendor.accountNumber || '',
        confirmAccountNumber: vendor.confirmAccountNumber || '',
        ifscCode: vendor.ifscCode || '',
        swiftCode: vendor.swiftCode || '',
        bankAddressLine1: vendor.bankAddressLine1 || '',
        bankAddressLine2: vendor.bankAddressLine2 || '',
        branch: vendor.branch || '',
        bankCity: vendor.bankCity || '',
        bankState: vendor.bankState || '',
        bankPinCode: vendor.bankPinCode || '',
        status: vendor.status || '',
      }));
    this.xlsxService.xlsxExport(mappedVendorsList, this.headers, fileName);
      this.loadSpinner = false;
    }, error => {
      this.loadSpinner = false;
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
    });
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