import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent {

  isFilters: boolean = true;
  searchedVendor: string = '';
  fullScreen : boolean = false;
  vendorsList: any[] = [];
  headers: string[] = [];
  
  constructor(private xlsxService: XlsxService) { }

  searchVendor(event: any) {
    this.searchedVendor = event;
  }

  onVendorsListChange(vendorsList: any[]) {
    this.vendorsList = vendorsList;
  }

  onHeadersChange(headers: string[]) {
    this.headers = headers;
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