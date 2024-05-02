import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-lookup-type',
  templateUrl: './lookup-type.component.html',
  styleUrl: './lookup-type.component.scss'
})
export class LookupTypeComponent {

  isFilters: boolean = false;
  filterKeyword: string = '';

  constructor(private router: Router,
    private exportService: ExportService
  ) { }

  onCreateLookup() {
    this.router.navigate(['master/addEditLookupType', '0'])
  }

  onSearch(e: any) {
    this.filterKeyword = e.target.value;
  }

  exportData(fileName: string = "Lookup Type") {
    this.exportService.csvExport(fileName);
  }
}
