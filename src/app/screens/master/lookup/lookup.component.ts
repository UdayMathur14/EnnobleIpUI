import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LookupService } from '../../../core/service/lookup.service';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrl: './lookup.component.scss',
})
export class LookupComponent implements OnInit {
  isFilters: boolean = true;
  lookupsList: any[] = [];
  fullScreen: boolean = false;
  loadSpinner: boolean = true;
  headers: string[] = [];
  currentPage: number = 1;
  count: number = 10;
  totalLookups: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  constructor(
    private router: Router,
    private lookupService: LookupService,
    private toastr: ToastrService,
    private xlsxService: XlsxService
  ) {}

  ngOnInit(): void {
    this.getAllLookupsList();
  }

  getAllLookupsList(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.appliedFilters
  ) {
    let data = {
      code: filters?.code || '',
      lookUpType: filters?.lookUpType || '',
      value: filters?.value,
      status: filters?.status || '',
    };
    this.lookupService.getLookupsType(data).subscribe(
      (response: any) => {
        this.lookupsList = response.lookUps;
        console.log(this.lookupsList);
        
        this.totalLookups = response.paging.total;
        this.filters = response.filters;
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  getData(e: any) {
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getAllLookupsList(0, this.count, this.appliedFilters);
  }

  onCreateLookup() {
    this.router.navigate(['master/addEditLookup', '0']);
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = 'Lookup') {
    let data = {
      code: this.appliedFilters?.code || '',
      lookUpType: this.appliedFilters?.lookUpType || '',
      value: '',
      status: this.appliedFilters?.status || '',
    };
    this.lookupService.getLookups(data, 0, this.totalLookups).subscribe(
      (response: any) => {
        const lookupsListToExport = response.lookUps;
        // Map the data to include only the necessary fields
        const mappedLookupsList = lookupsListToExport.map((lookup: any) => ({
          lookUpType: lookup.lookUpType?.value,
          code: lookup.code,
          value: lookup.value,
          description: lookup.description,
          attribute1: lookup.attribute1,
          attribute2: lookup.attribute2,
          attribute3: lookup.attribute3,
          attribute4: lookup.attribute4,
          status: lookup.status,
        }));
        this.xlsxService.xlsxExport(mappedLookupsList, this.headers, fileName);
        this.loadSpinner = false;
      },
      (error) => {
        this.toastr.error(
          error.error.details
            .map((detail: any) => detail.description)
            .join('<br>')
        );
        this.loadSpinner = false;
      }
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getAllLookupsList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getAllLookupsList(0, this.count, this.appliedFilters);
  }
}
