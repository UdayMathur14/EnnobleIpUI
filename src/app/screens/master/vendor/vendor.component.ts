import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { VendorService } from '../../../core/service/vendor.service';
import { ToastrService } from 'ngx-toastr';
import { LookupService } from '../../../core/service/lookup.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent implements OnInit {

  isFilters: boolean = true;
  searchedVendor: string = '';
  fullScreen : boolean = false;
  loadSpinner : boolean = true;
  vendorsList : any[] = [];
  cities : any[] = [];
  states : any[] = [];
  constructor(private router: Router,
    private exportService: ExportService,
    private vendorService : VendorService,
    private toastr: ToastrService,
    private lookupService : LookupService
  ) { }

  ngOnInit(): void {
    this.getVendorsList();
    this.getCityDropdownData();
    this.getStateDropdownData()
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
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'City'
    this.lookupService.getDropdownData(type).subscribe((res:any)=>{
      this.cities = res.lookUps;
    })
  }

  getStateDropdownData(){
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'State'
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
    this.exportService.csvExport(fileName);
  }
}