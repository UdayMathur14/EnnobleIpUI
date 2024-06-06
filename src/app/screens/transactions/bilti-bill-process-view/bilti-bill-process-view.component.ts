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

  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = '2000-01-01';
  batchNumber: any;
  biltiNumber: any;
  adviceType: any;
  biltiBillProcess = [];
  filteredBiltibillList: any = [];
  loadSpinner: boolean = false;
  locationIds: any[] = [];
  toDate: any = moment().format('YYYY-MM-DD');

  constructor(
    private router: Router,
    private biltiBIllProService: BiltiBillProcessService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }

  getAllBiltiProcess() {
    this.loadSpinner = true;
    const obj = {
      screenCode: 301,
      fromDate: this.fromDate,
      toDate: this.toDate,
      adviceType: this.adviceType,
      batchNumber: this.batchNumber,
      biltiNumber: this.biltiNumber,
      locationIds: this.locationIds
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
    this.locationIds = data.locationIds;

    this.getAllBiltiProcess();
  }

  onCreateBilti() {
    this.router.navigate(['transaction/biltiBillProcess'])
  }
}
