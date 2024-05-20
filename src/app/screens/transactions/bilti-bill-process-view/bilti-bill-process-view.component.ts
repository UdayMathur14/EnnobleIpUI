import { Component } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';

@Component({
  selector: 'app-bilti-bill-process-view',
  templateUrl: './bilti-bill-process-view.component.html',
  styleUrl: './bilti-bill-process-view.component.scss'
})
export class BiltiBillProcessViewComponent {
  constructor(private router: Router,private biltiBIllProService: BiltiBillProcessService) { }

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
      adviceType: this.adviceType,
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

  onCreateBilti() {
    this.router.navigate(['transaction/biltiBillProcess'])
  }
}
