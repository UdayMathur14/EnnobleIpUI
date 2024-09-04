import { Component } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../core/constants';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-processed-report',
  templateUrl: './processed-report.component.html',
  styleUrl: './processed-report.component.scss'
})
export class ProcessedReportComponent {
  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = '2000-01-01';
  batchNumber: any;
  biltiNumber: any;
  adviceType: any;
  biltiBillProcess = [];
  filteredBiltibillList: any = [];
  loadSpinner: boolean = false;
  locationIds: any[] = APIConstant.commonLocationsList.map((e:any)=>(e.id));
  toDate: any = moment().format('YYYY-MM-DD');
  currentPage: number = 1;
  count: number = 10;
  totalBiltiBills: number = 0;
  filters: any = [];
  maxCount: number = Number.MAX_VALUE;
  headers: string[] = [];

  constructor(
    private router: Router,
    private biltiBIllProService: BiltiBillProcessService,
    private toastr: ToastrService,
    private xlsxService: XlsxService,
  ) { }

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }

  getAllBiltiProcess(offset: number = 0, count: number = this.count, filters: any = this.searchedData) {
    this.loadSpinner = true;
    const obj = {
      screenCode: 308,
      fromDate: filters?.fromDate || null,
      toDate: filters?.toDate || null,
      adviceType: filters?.adviceType || "",
      batchNumber: filters?.batchNumber || "",
      biltiNumber: filters?.biltiNumber || "",
      locationIds: filters?.locationIds || APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      status: filters?.status
    }
    this.biltiBIllProService.getBiltiBillProcess(obj, offset, count).subscribe((response: any) => {
      this.loadSpinner = false;
      response.biltiBillProcess.forEach((element: any) => {
        element.creationDate = moment.utc(element.creationDate).local().format("YYYY-MM-DD");
        if (element.biltiBillProcessModel) {
          element.biltiBillProcessModel.biltiBillProcessDate = moment.utc(element.biltiBillProcessModel.biltiBillProcessDate).local().format("YYYY-MM-DD");
        }
      });
      this.biltiBillProcess = response.biltiBillProcess;
      this.totalBiltiBills = response.paging.total;
      this.filters = response.filters;
      this.filteredBiltibillList = [...new Set(response.biltiBillProcess.map((item: any) => item?.biltiBillProcessModel?.batchNumber))]
        .map(batchNumber => response.biltiBillProcess.find((t: any) => t.biltiBillProcessModel.batchNumber === batchNumber));
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
    this.getAllBiltiProcess(0, this.count, this.searchedData);
  }

  onCreateBilti() {
    this.router.navigate(['transaction/biltiBillProcess'])
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getAllBiltiProcess(offset, this.count, this.searchedData);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getAllBiltiProcess(0, this.count, this.searchedData);
    }

    onExportHeader(headers: string[]) {
      this.headers = headers;
    }
  
    exportData(fileName: string = 'Processed') {
      const data = {
        fromDate: this.searchedData?.fromDate || null,
        toDate: this.searchedData?.toDate || null,
        batchNumber: this.searchedData?.batchNumber || "",
        biltiNumber: this.searchedData?.biltiNumber || "",
        status: this.searchedData?.status,
        screenCode: 308,
        adviceType: this.searchedData?.adviceType || "",
        locationIds: this.searchedData?.locationIds || APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      };
  
      if (this.totalBiltiBills === 0) {
        this.toastr.error('Can not export with 0 rows!');
      }
  
      this.biltiBIllProService.getBiltiBillProcess(data, 0, this.totalBiltiBills).subscribe(
        (res: any) => {
          
          const processedReportToExport = res.biltiBillProcess;
          const mappedAdviceList = processedReportToExport.map((row: any) => ({
            biltiNumber: row?.biltiNumber,
            creationDate: row?.creationDate,
            biltiBillProcessDate: row?.biltiBillProcessModel?.biltiBillProcessDate,
            frlrNumber: row?.frlrNumber,
            transporterName: row?.transporterModel?.transporterName,
            vehicleNumber: row?.vehicles?.vehicleNumber,
            freightAmount: row?.freights?.freightAmount,
            paidByAmount: row?.biltiBillProcessModel?.paidByAmount,
            debitAmount: row?.biltiBillProcessModel?.debitAmount,
            status: row?.biltiBillProcessModel?.status,
            remarks: row?.biltiBillChangeStatusDetails?.remarks || "-"
          }));
          this.xlsxService.xlsxExport(mappedAdviceList, this.headers, fileName);
        },
        (error) => {}
      );
    }
}
