import { Component } from '@angular/core';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonTransactionService } from '../../../core/service/commonTransaction.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-approval-material-head',
  templateUrl: './approval-material-head.component.html',
  styleUrl: './approval-material-head.component.scss',
})
export class ApprovalMaterialHeadComponent {
  isFilters: boolean = true;
  searchedData: any;
  fromDate: any = null;
  batchNumber: any;
  biltiNumber: any;
  locationIds: any[] = [];
  biltiBillProcess: any = [];
  filteredBiltibillList: any = [];
  loadSpinner: boolean = false;
  toDate: any = moment().format('YYYY-MM-DD');
  currentPage: number = 1;
  count: number = 10;
  totalBiltis: number = 0;
  filters: any = [];
  maxCount: number = Number.MAX_VALUE;

  constructor(private biltiProcessService: BiltiBillProcessService,
    private toastr: ToastrService,
    private commonTransaction: CommonTransactionService
  ) {}

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }

  getAllBiltiProcess(offset: number = 0, count: number = this.count, filters: any = this.searchedData) {
    this.loadSpinner = true;
    const data = {
      screenCode: 304,
      fromDate: filters?.fromDate || null,
      toDate: filters?.toDate || null,
      adviceType: '',
      batchNumber: filters?.batchNumber,
      biltiNumber: '',
      locationIds: filters?.locationIds || APIConstant.locationsListDropdown.map((e: any) => e.id)
    };
    this.biltiProcessService
      .getBiltiBillProcess(data, offset, count)
      .subscribe((response: any) => {
        this.loadSpinner = false;
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
        this.totalBiltis = response.paging.total;
        this.filters = response.filters;
        this.filteredBiltibillList = [...new Set(response.biltiBillProcess.map((item: any) => item?.biltiBillProcessModel?.batchNumber))]
          .map(batchNumber => response.biltiBillProcess.find((t: any) => t.biltiBillProcessModel.batchNumber === batchNumber));
      },
        (error) => {
          //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
          this.loadSpinner = false;
        }
      );
  }

  filteredData(data: any) {
    this.searchedData = data;
    this.batchNumber = data.batchNumber;
    this.currentPage = 1;
    this.getAllBiltiProcess(0, this.count, this.searchedData);
  }

  openPopover(popover: NgbPopover) {
    popover.open();
  }

  closePopover(popover: NgbPopover) {
    popover.close();
  }

  updateStatus(status: string, remarks: string, popover: any) {
    this.loadSpinner = true;
    if (status === 'Rejected' && !remarks.trim()) {
      this.toastr.error('Remarks are required for rejection');
      return;
    }
    const data = {
      approvalLevel: 'Material',
      status: status,
      remarks: remarks,
      actionBy: localStorage.getItem("userId"),
      transactionCode: 203,
    };

    this.commonTransaction.updateBiltiApprovalStatus(this.batchNumber, data).subscribe((response: any) => {
      this.toastr.success('Status Updated Successfully');
      this.loadSpinner = false;
      if (popover) {
        popover.close();
      }
      this.getAllBiltiProcess();
    }, error => {
      this.loadSpinner = false;
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    });
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
