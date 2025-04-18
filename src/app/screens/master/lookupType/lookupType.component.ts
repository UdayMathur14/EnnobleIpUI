import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';
import { LookupTypeService } from '../../../core/service/lookupType.service';

@Component({
  selector: 'app-lookupType',
  templateUrl: './lookupType.component.html',
  styleUrl: './lookupType.component.scss',
})
export class LookupTypeComponent implements OnInit {
  isFilters: boolean = true;
  LookupTypesList: any[] = [];
  fullScreen: boolean = false;
  loadSpinner: boolean = true;
  headers: string[] = [];
  currentPage: number = 1;
  count: number = 10;
  totalLookupTypes: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  constructor(
    private router: Router,
    private LookupTypeService:LookupTypeService,
    private toastr: ToastrService,
    private xlsxService: XlsxService
  ) {}

  ngOnInit(): void {
    this.getAllLookupTypesList();
  }

  getAllLookupTypesList(
    offset: number = 0,
    count: number = this.count,
    filters: any = this.appliedFilters
  ) {
    let data = {
      type: filters?.type || '',
      status: filters?.status || '',
    };
    this.LookupTypeService.getLookupTypes(data).subscribe(
      (response: any) => {
        this.LookupTypesList = response.lookUpTypes;
        console.log(this.LookupTypesList);
        
        this.totalLookupTypes = response.paging.total;
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
    this.getAllLookupTypesList(0, this.count, this.appliedFilters);
  }

  onCreateLookupType() {
    this.router.navigate(['master/addEditlookupType', '0']);
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = 'LookupType') {
    let data = {
      code: this.appliedFilters?.code || '',
      LookupType: this.appliedFilters?.LookupType || '',
      value: '',
      status: this.appliedFilters?.status || '',
    };
    this.LookupTypeService.getLookupTypes(data, 0, this.totalLookupTypes).subscribe(
      (response: any) => {
        const LookupTypesListToExport = response.LookupTypes;
        // Map the data to include only the necessary fields
        const mappedLookupTypesList = LookupTypesListToExport.map((LookupType: any) => ({
          LookupType: LookupType.LookupType?.value,
          code: LookupType.code,
          value: LookupType.value,
          description: LookupType.description,
          status: LookupType.status,
        }));
        this.xlsxService.xlsxExport(mappedLookupTypesList, this.headers, fileName);
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
    this.getAllLookupTypesList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getAllLookupTypesList(0, this.count, this.appliedFilters);
  }
}