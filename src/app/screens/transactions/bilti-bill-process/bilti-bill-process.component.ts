import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-bilti-bill-process',
  templateUrl: './bilti-bill-process.component.html',
  styleUrl: './bilti-bill-process.component.scss'
})
export class BiltiBillProcessComponent implements OnInit {
  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = null;
  batchNumber: any;
  biltiNumber: any;
  adviceType: any;
  biltiBillProcess = [];
  loadSpinner: boolean = true;
  toDate: any = new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + (new Date().getDate() + 1)).slice(-2);
  currentPage: number = 1;
  count: number = 10;
  totalBiltiBills: number = 0;
  filters: any = [];
  maxCount: number = Number.MAX_VALUE;
  
  constructor(private router: Router, private biltiBIllProService: BiltiBillProcessService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }



  getAllBiltiProcess(offset: number = 0, count: number = this.count, filters: any = this.searchedData) {
    this.loadSpinner = true;
    const obj = {
      screenCode: 302,
      fromDate: filters?.fromDate || null,
      toDate: filters?.toDate || null,
      adviceType: filters?.adviceType || "",
      batchNumber: filters?.batchNumber || "",
      biltiNumber: filters?.biltiNumber || "",
      locationIds: APIConstant.commonLocationsList.map((e:any)=>(e.id)),
      status: "",
      paidByDetails: filters?.paidByDetails
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
      this.loadSpinner = false
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
