import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonTransactionService } from '../../../core/service/commonTransaction.service';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-change-bilti-status',
  templateUrl: './change-bilti-status.component.html',
  styleUrl: './change-bilti-status.component.scss'
})
export class ChangeBiltiStatusComponent implements OnInit {
  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = null;
  batchNumber: any;
  biltiNumber: any;
  locationIds: any[] = [];
  biltiBillProcess: any = [];
  filteredBiltibillList: any = [];
  loadSpinner: boolean = false;
  toDate: any = new Date().getFullYear() + '-' +
    ('0' + (new Date().getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + (new Date().getDate() + 1)).slice(-2);
    currentPage: number = 1;
    count: number = 10;
    totalBiltis: number = 0;
    filters: any = [];
    maxCount: number = Number.MAX_VALUE;
    locations: any = [];

    
  constructor(private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private biltiProcessService: BiltiBillProcessService) { }

  ngOnInit(): void {
   
  }

  handleLocations(event: any){
    this.locations = event;
    this.getAllBiltiProcess();
  }

  getAllBiltiProcess(offset: number = 0, count: number = this.count, filters: any = this.searchedData) {
    this.loadSpinner = true;
    const data = {
      screenCode: 306,
      fromDate: filters?.fromDate || null,
      toDate: filters?.toDate || null,
      adviceType: '',
      batchNumber: filters?.batchNumber || '',
      biltiNumber: filters?.biltiNumber || '',
      status: filters?.status,
      locationIds: filters?.locationIds ||  this.locations
    };
    this.biltiProcessService
      .getBiltiBillProcess(data, offset, count)
      .subscribe((response: any) => {
        this.loadSpinner = false;
        response.biltiBillProcess.forEach((element: any) => {
          element.creationDate = moment
            .utc(element.creationDate)
            .local()
            .format('YYYY-MM-DD');
          if (element.biltiBillProcessModel) {
            element.biltiBillProcessModel.biltiBillProcessDate = moment
              .utc(element.biltiBillProcessModel.biltiBillProcessDate)
              .local()
              .format('YYYY-MM-DD');
          }
        });
        this.biltiBillProcess = response.biltiBillProcess;
        this.totalBiltis = response.paging.total;
        this.filters = response.filters;
        this.filteredBiltibillList = [...new Set(response.biltiBillProcess.map((item: any) => item?.biltiBillProcessModel?.batchNumber))]
          .map(batchNumber => response?.biltiBillProcess.find((t: any) => t.biltiBillProcessModel?.batchNumber === batchNumber));
      },
        (error) => {
          //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        }
      );
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
