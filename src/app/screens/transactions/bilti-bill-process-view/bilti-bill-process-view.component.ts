import { Component } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-bilti-bill-process-view',
  templateUrl: './bilti-bill-process-view.component.html',
  styleUrl: './bilti-bill-process-view.component.scss'
})
export class BiltiBillProcessViewComponent {
  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = null;
  batchNumber: any;
  biltiNumber: any;
  adviceType: any;
  biltiBillProcess = [];
  filteredBiltibillList: any = [];
  loadSpinner: boolean = false;
  locationIds: any[] = APIConstant.locationsListDropdown.map((e:any)=>(e.id));
  toDate: any = moment().format('YYYY-MM-DD');
  currentPage: number = 1;
  count: number = 10;
  totalBiltiBills: number = 0;
  filters: any = [];
  maxCount: number = Number.MAX_VALUE;

  constructor(
    private router: Router,
    private biltiBIllProService: BiltiBillProcessService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }

  getAllBiltiProcess(offset: number = 0, count: number = this.count, filters: any = this.searchedData) {
    this.loadSpinner = true;
    const obj = {
      screenCode: 301,
      fromDate: filters?.fromDate || null,
      toDate: filters?.toDate || null,
      adviceType: filters?.adviceType || "",
      batchNumber: filters?.batchNumber || "",
      biltiNumber: filters?.biltiNumber || "",
      batchName: filters?.batchName || "",
      status: filters?.status || "",
      locationIds: filters?.locationIds || APIConstant.locationsListDropdown.map((e:any)=>(e.id))
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
    this.currentPage = 1;
    this.getAllBiltiProcess(0, this.count, this.searchedData);
  }

  onCreateBilti() {
    this.router.navigate(['transaction/biltiBillProcess'])
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
