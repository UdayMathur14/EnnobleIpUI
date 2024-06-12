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
  constructor(
    private vendorService : VendorService,
    private toastr: ToastrService,
    private lookupService : LookupService,
    private xlsxService : XlsxService
  ) { }

  ngOnInit(): void {
    this.getVendorsList();
    this.getCityDropdownData();
    this.getStateDropdownData()
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  getVendorsList() {
    let data = {
      "vendorCode": "",
      "vendorName": "",
      "city": "",
      "state": "",
      "taxationType": "",
      "paidByDetail": ""
    }
    this.vendorService.getVendors(data).subscribe((response: any) => {
      this.vendorsList = response.vendors;
      this.loadSpinner = false;
      // this.allVendorNames = response.vendors.map((vendor: any) => vendor.vendorName);
    }, error => {
      this.loadSpinner = false;
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
    });
  }

  getCityDropdownData(){
    const type = 'City';
    this.lookupService.getDropdownData(type).subscribe((res:any)=>{
      this.cities = res.lookUps;
    })
  }

  getStateDropdownData(){
    const type = 'State';
    this.lookupService.getDropdownData(type).subscribe((res:any)=>{
      this.states = res.lookUps;
    })
  }

  getData(e:any){
    this.loadSpinner = true;
    let data = {
      "vendorCode": e.vendorCode || "",
      "vendorName": e.vendorName || "",
      "city": e.city || "",
      "state": e.state || "",
      "taxationType": e.taxationType || "",
      "paidByDetail": e.paidByDetail || ""
    }
    this.vendorService.getVendors(data).subscribe((response: any) => {
      this.vendorsList = response.vendors;
      this.loadSpinner = false;
    }, error => {
      this.loadSpinner = false
    })
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
}