import { Component, OnInit } from '@angular/core';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';

@Component({
  selector: 'app-ap-outbound',
  templateUrl: './ap-outbound.component.html',
  styleUrl: './ap-outbound.component.scss'
})
export class ApOutboundComponent implements OnInit {

  loadSpinner: boolean = false;
  count: number = 10;
  searchedData: any;
  biltiBillProcess = [];
  totalBiltiBills: number = 0;
  filters: any = [];
  currentPage: number = 1;
  isFilters: boolean = true;

  constructor(private biltiBillService: BiltiBillProcessService){}

  ngOnInit(): void {
    this.getAllBiltiProcess()
  }

  getAllBiltiProcess(offset: number = 0, count: number = this.count, filters: any = this.searchedData) {
    this.loadSpinner = true;
    const obj = {
      locationIds: [0],
      status: 'Bilti Bill Process Approved by Accounts Head',
      screenCode: 0,
      fromDate: null,
      toDate: null,
      batchNumber: filters?.batchNumber || '',
      adviceType: '',
      batchName:  '',
      biltiNumber: '',
    };
    this.biltiBillService.getBiltiBillProcess(obj, offset, count).subscribe((response: any) => {
      this.loadSpinner = false;
      this.biltiBillProcess = response.biltiBillProcess;
      this.totalBiltiBills = response.paging.total;
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
    this.currentPage = 1;
    this.getAllBiltiProcess(0, this.count, this.searchedData);
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
}
