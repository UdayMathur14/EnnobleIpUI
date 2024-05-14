import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import * as moment from 'moment';

@Component({
  selector: 'app-bilti-bill-process',
  templateUrl: './bilti-bill-process.component.html',
  styleUrl: './bilti-bill-process.component.scss'
})
export class BiltiBillProcessComponent implements OnInit {
  constructor(private router: Router, private biltiBIllProService: BiltiBillProcessService,) { }

  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = '2000-01-01';
  batchNumber: any;
  biltiNumber: any;
  adviceType: any;
  biltiBillProcess = [];
  toDate: any = new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + (new Date().getDate() + 1)).slice(-2);

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }



  getAllBiltiProcess() {
    const obj = {
      screenCode: 302,
      fromDate: this.fromDate,
      toDate: this.toDate,
      // adviceType: this.adviceType,
      batchNumber: this.batchNumber,
      biltiNumber: this.biltiNumber
    }
    this.biltiBIllProService.getBiltiBillProcess(obj).subscribe((response: any) => {
      response.biltiBillProcess.forEach((element: any) => {
        element.creationDate = moment.utc(element.creationDate).local().format("YYYY-MM-DD");
        if (element.biltiBillProcessModel) {
          element.biltiBillProcessModel.biltiBillProcessDate = moment.utc(element.biltiBillProcessModel.biltiBillProcessDate).local().format("YYYY-MM-DD");
        }
      });
      this.biltiBillProcess = response.biltiBillProcess;
      console.log(this.biltiBillProcess);

    })
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
