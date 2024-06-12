import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-approval-accounts',
  templateUrl: './approval-accounts.component.html',
  styleUrl: './approval-accounts.component.scss'
})
<<<<<<< HEAD
export class ApprovalAccountsComponent implements OnInit {


  isFilters: boolean = true;
=======
export class ApprovalAccountsComponent implements OnInit{
  isFilters : boolean = true;
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
  searchedData: any;
  fromDate: any = '2000-01-01';
  batchNumber: any;
  biltiNumber: any;
  locationIds: any[] = [];
  biltiBillProcess = [];
  filteredBiltibillList: any = [];
  toDate: any = moment().format('YYYY-MM-DD');
  loadSpinner: boolean = false;
<<<<<<< HEAD

  constructor(
    private router: Router,
    private biltiProcessService: BiltiBillProcessService,
    private toastr: ToastrService
  ) {

  }
=======
  
  constructor(private router : Router,
              private biltiProcessService: BiltiBillProcessService,
              private toastr: ToastrService
  ){}
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }

  getAllBiltiProcess() {
    this.loadSpinner = true;
    const data = {
      screenCode: 305,
      fromDate: this.fromDate,
      toDate: this.toDate,
      adviceType: "",
      batchNumber: this.batchNumber,
      biltiNumber: this.biltiNumber,
      locationIds: this.locationIds
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
    this.fromDate = data.fromDate;
    this.toDate = data.toDate;
    this.batchNumber = data.batchNumber;
    this.biltiNumber = data.biltiNumber;
    this.locationIds = data.locationIds
    this.getAllBiltiProcess();
  }
}
