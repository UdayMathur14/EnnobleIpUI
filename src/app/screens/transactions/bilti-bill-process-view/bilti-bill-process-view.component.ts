import { Component } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bilti-bill-process-view',
  templateUrl: './bilti-bill-process-view.component.html',
  styleUrl: './bilti-bill-process-view.component.scss'
})
export class BiltiBillProcessViewComponent {
  constructor(private router: Router,private biltiBIllProService: BiltiBillProcessService,
    private toastr: ToastrService
  ) { }

  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = '2000-01-01';
  batchNumber: any;
  biltiNumber: any;
  adviceType: any;
  biltiBillProcess = [];
  filteredBiltibillList: any = [];
  loadSpinner: boolean = false;
  toDate: any = new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + (new Date().getDate() + 1)).slice(-2);

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }



  getAllBiltiProcess() {
    this.loadSpinner= true;
    const obj = {
      screenCode: 301,
      fromDate: this.fromDate,
      toDate: this.toDate,
      adviceType: this.adviceType,
      batchNumber: this.batchNumber,
      biltiNumber: this.biltiNumber
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
      this.filteredBiltibillList = [...new Set(response.biltiBillProcess.map((item: any) => item?.biltiBillProcessModel?.batchNumber))]
      .map(batchNumber => response.biltiBillProcess.find((t: any) => t.biltiBillProcessModel.batchNumber === batchNumber));
      this.loadSpinner = false;
    },
    (error) => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
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

  onCreateBilti() {
    this.router.navigate(['transaction/biltiBillProcess'])
  }
}
