import { Component } from '@angular/core';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import moment from 'moment';

@Component({
  selector: 'app-approval-material-head',
  templateUrl: './approval-material-head.component.html',
  styleUrl: './approval-material-head.component.scss',
})
export class ApprovalMaterialHeadComponent {
  isFilters: boolean = true;
  constructor(private biltiProcessService: BiltiBillProcessService) {}
  searchedData: any;
  fromDate: any = '2000-01-01';
  batchNumber: any;
  biltiNumber: any;
  biltiBillProcess = [];
  toDate: any = new Date().getFullYear() + '-' + 
  ('0' + (new Date().getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + (new Date().getDate() + 1)).slice(-2);

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }

  getAllBiltiProcess() {
    const data = {
      screenCode: 303,
      fromDate: this.fromDate,
      toDate: this.toDate,
      adviceType: '',
      batchNumber: this.batchNumber,
      biltiNumber: this.biltiNumber,
    };
    this.biltiProcessService
      .getBiltiBillProcess(data)
      .subscribe((response: any) => {
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
      });
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
