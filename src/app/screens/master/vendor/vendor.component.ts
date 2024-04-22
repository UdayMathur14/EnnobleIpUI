import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent {
  exportAsConfig: ExportAsConfig = {
    type: 'csv', // the file type to download
    elementIdOrContent: 'exportableTable', // the id of html/table element
  }
  constructor(private router: Router,
    private exportAsService: ExportAsService
  ) { }

  isFilters: boolean = true;
  searchedVendor: string = '';

  searchVendor(event: any) {
    this.searchedVendor = event;
  }

  exportData(fileName : string){
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
    });
  }
}