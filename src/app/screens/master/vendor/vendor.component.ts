import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrl: './vendor.component.scss'
})
export class VendorComponent {

  isFilters: boolean = true;
  searchedVendor: string = '';
  fullScreen : boolean = false;
  constructor(private router: Router,
    private exportService: ExportService
  ) { }

  searchVendor(event: any) {
    this.searchedVendor = event;
  }

  exportData(fileName: string = "Vendor") {
    this.exportService.csvExport(fileName);
  }
}