import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bilti-bill-process',
  templateUrl: './bilti-bill-process.component.html',
  styleUrl: './bilti-bill-process.component.scss'
})
export class BiltiBillProcessComponent implements OnInit {
  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = '2000-01-01';
  batchNumber: any;
  biltiNumber: any;
  adviceType: any;
  biltiBillProcess = [];
  loadSpinner: boolean = true;
  toDate: any = new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + (new Date().getDate() + 1)).slice(-2);
  
  constructor(private router: Router, private biltiBIllProService: BiltiBillProcessService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }



  getAllBiltiProcess() {
    this.loadSpinner = true;
    const obj = {
      screenCode: 302,
      fromDate: this.fromDate,
      toDate: this.toDate,
      adviceType: this.adviceType,
      batchNumber: this.batchNumber,
      biltiNumber: this.biltiNumber,
      locationIds:[]
    }
    this.biltiBIllProService.getBiltiBillProcess(obj).subscribe((response: any) => {
      this.loadSpinner = false;
      response.biltiBillProcess.forEach((element: any) => {
        element.creationDate = moment.utc(element.creationDate).local().format("YYYY-MM-DD");
        if (element.biltiBillProcessModel) {
          element.biltiBillProcessModel.biltiBillProcessDate = moment.utc(element.biltiBillProcessModel.biltiBillProcessDate).local().format("YYYY-MM-DD");
        }
      });
      this.biltiBillProcess = response.biltiBillProcess;
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
    this.fromDate = data.fromDate;
    this.toDate = data.toDate;
    this.batchNumber = data.batchNumber;
    this.biltiNumber = data.biltiNumber;
    this.adviceType = data.adviceType;

    this.getAllBiltiProcess();
  }

}
