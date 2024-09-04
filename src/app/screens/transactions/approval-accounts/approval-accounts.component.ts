import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-approval-accounts',
  templateUrl: './approval-accounts.component.html',
  styleUrl: './approval-accounts.component.scss'
})
export class ApprovalAccountsComponent implements OnInit {


  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = null;
  batchNumber: any;
  biltiNumber: any;
  locationIds: any[] = [];
  biltiBillProcess = [];
  filteredBiltibillList: any = [];
  toDate: any = moment().format('YYYY-MM-DD');
  loadSpinner: boolean = false;
  currentPage: number = 1;
  count: number = 10;
  totalBiltis: number = 0;
  filters: any = [];
  maxCount: number = Number.MAX_VALUE;

  constructor(
    private router: Router,
    private biltiProcessService: BiltiBillProcessService,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }

  getAllBiltiProcess(offset: number = 0, count: number = this.count, filters: any = this.searchedData) {
    this.loadSpinner = true;
    const data = {
      screenCode: 305,
      fromDate: filters?.fromDate || null,
      toDate: filters?.toDate || null,
      adviceType: "",
      batchNumber: filters?.batchNumber || "",
      biltiNumber: filters?.biltiNumber || "",
      locationIds: filters?.locationIds || APIConstant.commonLocationsList.map((e: any) => e.id)
    }
    this.biltiProcessService.getBiltiBillProcess(data).subscribe((response: any) => {
      this.loadSpinner = false;
      response.biltiBillProcess.forEach((element: any) => {
        element.creationDate = moment.utc(element.creationDate).local().format("YYYY-MM-DD");
        if (element.biltiBillProcessModel) {
          element.biltiBillProcessModel.biltiBillProcessDate = moment.utc(element.biltiBillProcessModel.biltiBillProcessDate).local().format("YYYY-MM-DD");
        }
      });
      this.biltiBillProcess = response.biltiBillProcess;
      this.totalBiltis = response.paging.total;
        this.filters = response.filters;
      this.filteredBiltibillList = [...new Set(response.biltiBillProcess.map((item: any) => item?.biltiBillProcessModel?.batchNumber))]
        .map(batchNumber => response.biltiBillProcess.find((t: any) => t.biltiBillProcessModel.batchNumber === batchNumber));
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
