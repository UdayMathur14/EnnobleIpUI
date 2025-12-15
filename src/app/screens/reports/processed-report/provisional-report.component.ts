import { Component } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../core/constants';
import { XlsxService } from '../../../core/service/xlsx.service';
import { GlAccrualPostingService } from '../../../core/service/gl-accrual-posting.service';

@Component({
  selector: 'app-provisional-report',
  templateUrl: './provisional-report.component.html',
  styleUrl: './provisional-report.component.scss'
})
export class ProvisionalReportComponent {
  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = '2000-01-01';
  batchNumber: any;
  adviceType: any;
  loadSpinner: boolean = false;
  locationIds: any[] = APIConstant.commonLocationsList.map((e:any)=>(e.id));
  toDate: any = moment().format('YYYY-MM-DD');
  currentPage: number = 1;
  count: number = 10;
  filters: any = [];
  maxCount: number = Number.MAX_VALUE;
  headers: string[] = [];
  locations: any = [];
  glAccrualList = [];
  totalglAccrualLists: number = 0;

  constructor(
    private router: Router,
    private glAccrualPostingService: GlAccrualPostingService,
    private toastr: ToastrService,
    private xlsxService: XlsxService,
  ) { }

  ngOnInit(): void {
    this.getProvisionReport();
  }

  getProvisionReport(offset: number = 0, count: number = this.count, filters: any = this.searchedData) {
    this.loadSpinner = true;
    const obj = {
      batchId: "",
      costCenter: filters?.costCenter || "",
      businessArea: filters?.businessArea || "",
      glAccount: filters?.glAccount || "",
      subCategory: filters?.subCategory || "",
    };
    this.glAccrualPostingService.getGlAccrualPosting(obj, offset, count).subscribe((response: any) => {
      this.loadSpinner = false;
      this.glAccrualList = response.vendorPurchaseReports;
      this.totalglAccrualLists = response.paging.total;
      this.filters = response.filters;
      this.loadSpinner = false;
    },
      (error) => {
        //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    )
  }

  filteredData(data: any) {
    this.searchedData = data;
    this.batchNumber = data.batchNumber;
    this.currentPage = 1;
    this.getProvisionReport(0, this.count, this.searchedData);
  }

  onCreateBilti() {
    this.router.navigate(['transaction/biltiBillProcess'])
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getProvisionReport(offset, this.count, this.searchedData);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getProvisionReport(0, this.count, this.searchedData);
    }

    onExportHeader(headers: any) {
      console.log(headers);
      
      this.headers = headers;
    }
  
    exportData(fileName: string = 'Provisional Report') {
      const obj = {
        batchId: "",
        costCenter: this.searchedData?.costCenter || "",
        businessArea: this.searchedData?.businessArea || "",
        glAccount: this.searchedData?.glAccount || "",
        subCategory: this.searchedData?.subCategory || "",
      };
  
      if (this.totalglAccrualLists === 0) {
        this.toastr.error('Can not export with 0 rows!');
      }
  
      this.glAccrualPostingService.getGlAccrualPosting(obj, 0, this.totalglAccrualLists).subscribe(
        (res: any) => {
          
          const processedReportToExport = res.glOutBound;
          const mappedList = processedReportToExport.map((row: any) => ({
            companyCode: row?.companyCode || "-",
            costCenter: row?.costCenter || "-",
            currencyCode: row?.currencyCode || "-",
            amount: row?.amount || "-",
            businessArea: row?.businessArea || "-",
            closingCategory: row?.closingCategory || "-",
            functionalArea: row?.functionalArea || "-",
            glAccount: row?.glAccount || "-",
            periodName: row?.periodName || "-",
            sequenceKey: row?.sequenceKey || "-",
            subCategoryremarks: row?.subCategory || "-",
            systemId: row?.systemId || "-",
            transferCount: row?.transferCount || "-"
          }));
          this.xlsxService.xlsxExport(mappedList, this.headers, fileName);
        },
        (error) => {}
      );
    }
}
