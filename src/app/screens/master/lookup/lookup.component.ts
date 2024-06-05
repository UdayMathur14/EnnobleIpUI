import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrl: './lookup.component.scss'
})
export class LookupComponent {

  isFilters: boolean = false;
  filterKeyword: string = '';
  fullScreen : boolean = false;
  lookupsList: any [] = [];
  headers: any [] = [];

  constructor(private router: Router,
    private xlsxService: XlsxService
  ) { }

  onCreateLookup() {
    this.router.navigate(['master/addEditLookup', '0'])
  }

  onSearch(e: any) {
    this.filterKeyword = e.target.value;
  }

  onLookupListChange(lookupsList: any[]) {
    this.lookupsList = lookupsList;
  }

  onHeadersChange(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Lookup") {
    // Map the data to include only the necessary fields
    const mappedLookupsList = this.lookupsList.map(lookup => ({
      lookUpType: lookup.lookUpType?.value,
      code: lookup.code,
      value: lookup.value,
      description: lookup.description,
      attribute1: lookup.attribute1,
      attribute2: lookup.attribute2,
      attribute3: lookup.attribute3,
      attribute4: lookup.attribute4,
      status: lookup.status
    }));
    this.xlsxService.xlsxExport(mappedLookupsList, this.headers, fileName);
  }

}
