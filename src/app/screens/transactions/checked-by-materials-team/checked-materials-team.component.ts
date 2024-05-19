import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import moment from 'moment';

@Component({
  selector: 'app-checked-by-materials-team',
  templateUrl: './checked-materials-team.component.html',
  styleUrl: './checked-materials-team.component.scss'
})
export class CheckedMaterialsTeamComponent implements OnInit {
  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = '2000-01-01'; 
  batchNumber: any;
  biltiNumber: any;
  biltiBillProcess = [];
  toDate: any = new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + (new Date().getDate() + 1)).slice(-2);


  constructor(private router : Router,
    private biltiProcessService: BiltiBillProcessService,
){}

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }

  getAllBiltiProcess() {
    const data = {
      screenCode: 303,
      fromDate: this.fromDate,
      toDate: this.toDate,
      adviceType: "",
      batchNumber: this.batchNumber,
      biltiNumber: this.biltiNumber
    }
    this.biltiProcessService.getBiltiBillProcess(data).subscribe((response: any) => {
      response.biltiBillProcess.forEach((element: any) => {
        element.creationDate = moment.utc(element.creationDate).local().format("YYYY-MM-DD");
        if (element.biltiBillProcessModel) {
          element.biltiBillProcessModel.biltiBillProcessDate = moment.utc(element.biltiBillProcessModel.biltiBillProcessDate).local().format("YYYY-MM-DD");
        }
      });
      this.biltiBillProcess = response.biltiBillProcess;

    })
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
