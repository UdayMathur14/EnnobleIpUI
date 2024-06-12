import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BiltiBillProcessService } from '../../../core/service/biltiBillProcess.service';
import moment from 'moment';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CommonTransactionService } from '../../../core/service/commonTransaction.service';

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
  locationIds:any;
  biltiBillProcess:any = [];
  filteredBiltibillList: any = [];
  loadSpinner: boolean = false;
  toDate: any = new Date().getFullYear() + '-' + ("0" + (new Date().getMonth() + 1)).slice(-2) + '-' + ("0" + (new Date().getDate() + 1)).slice(-2);


  constructor(private router : Router,
    private biltiProcessService: BiltiBillProcessService,
    private toastr: ToastrService,
    private commonTransaction: CommonTransactionService
){}

  ngOnInit(): void {
    this.getAllBiltiProcess();
  }

  getAllBiltiProcess() {
    this.loadSpinner = true;
    const data = {
      screenCode: 303,
      fromDate: this.fromDate,
      toDate: this.toDate,
      adviceType: "",
      batchNumber: this.batchNumber,
      biltiNumber: this.biltiNumber,
      locationIds: this.locationIds
    }
    this.biltiProcessService.getBiltiBillProcess(data).subscribe((response: any) => {
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
    this.locationIds = data.locationIds;
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
        approvalLevel: 'MaterialChecked',
        status: status,
        remarks:  remarks,
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
