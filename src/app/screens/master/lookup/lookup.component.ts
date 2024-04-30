import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrl: './lookup.component.scss'
})
export class LookupComponent {

  isFilters: boolean = false;
  filterKeyword: string = '';

  constructor(private router: Router,
    private exportService: ExportService
  ) { }

  onCreateLookup() {
    this.router.navigate(['master/addEditLookup', '0'])
  }

  onSearch(e: any) {
    this.filterKeyword = e.target.value;
  }

  exportData(fileName: string = "Lookup") {
    this.exportService.csvExport(fileName);
  }

}
