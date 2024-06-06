import { Component } from '@angular/core';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CommonTransactionService } from '../../../core/service/commonTransaction.service';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-approval-material-head',
  templateUrl: './approval-material-head.component.html',
  styleUrl: './approval-material-head.component.scss',
})
export class ApprovalMaterialHeadComponent {
  isFilters: boolean = true;
  constructor(private biltiProcessService: BiltiBillProcessService,
    private toastr: ToastrService,
    private commonTransaction: CommonTransactionService
  ) { }
  searchedData: any;
  fromDate: any = '2000-01-01';
  batchNumber: any;
  biltiNumber: any;
  locationIds: any[] = [];
  biltiBillProcess: any = [];
  filteredBiltibillList: any = [];
  loadSpinner: boolean = false;
  toDate: any = moment().format('YYYY-MM-DD');

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }

  getAllBiltiProcess() {
    this.loadSpinner = true;
    const data = {
      screenCode: 304,
      fromDate: this.fromDate,
      toDate: this.toDate,
      adviceType: '',
      batchNumber: this.batchNumber,
      biltiNumber: this.biltiNumber,
      locationIds: this.locationIds
    };
    this.biltiProcessService
      .getBiltiBillProcess(data)
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
    this.fromDate = data.fromDate;
    this.toDate = data.toDate;
    this.batchNumber = data.batchNumber;
    this.biltiNumber = data.biltiNumber;
    this.locationIds = data.locationIds
    this.getAllBiltiProcess();
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
      actionBy: 1,
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

}
