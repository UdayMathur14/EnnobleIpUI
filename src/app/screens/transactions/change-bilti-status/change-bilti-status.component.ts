import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonTransactionService } from '../../../core/service/commonTransaction.service';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';

@Component({
  selector: 'app-change-bilti-status',
  templateUrl: './change-bilti-status.component.html',
  styleUrl: './change-bilti-status.component.scss'
})
export class ChangeBiltiStatusComponent implements OnInit {
  constructor(private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private biltiProcessService: BiltiBillProcessService) { }

  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = '2000-01-01';
  batchNumber: any;
  biltiNumber: any;
  biltiBillProcess: any = [];
  filteredBiltibillList: any = [];
  loadSpinner: boolean = false;
  toDate: any = new Date().getFullYear() + '-' +
    ('0' + (new Date().getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + (new Date().getDate() + 1)).slice(-2);

  ngOnInit(): void {
    this.getAllBiltiProcess()
  }

  getAllBiltiProcess() {
    this.loadSpinner = true;
    const data = {
      screenCode: 306,
      fromDate: this.fromDate,
      toDate: this.toDate,
      adviceType: '',
      batchNumber: this.batchNumber,
      biltiNumber: this.biltiNumber,
      locationIds:[]
    };
    this.biltiProcessService
      .getBiltiBillProcess(data)
      .subscribe((response: any) => {
        this.loadSpinner =false;
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
        this.filteredBiltibillList = [...new Set(response.biltiBillProcess.map((item: any) => item?.biltiBillProcessModel?.batchNumber))]
          .map(batchNumber => response?.biltiBillProcess.find((t: any) => t.biltiBillProcessModel?.batchNumber === batchNumber));
      },
      (error) => {
        this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
        this.loadSpinner = false;
      }
    );
  }

  filteredData(data: any) {
    this.searchedData = data;
    this.fromDate = data.fromDate;
    this.toDate = data.toDate;
    this.batchNumber = data.batchNumber;
    this.biltiNumber = data.biltiNumber;
    this.getAllBiltiProcess();
  }
}
