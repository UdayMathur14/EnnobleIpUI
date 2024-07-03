import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
import { CommonTransactionService } from '../../../../../core/service/commonTransaction.service';
import { PointChargeDataModel } from '../../../../../core/model/masterModels.model';
import { PointChargeService } from '../../../../../core/service/point-charge.service';

@Component({
  selector: 'app-point-master-accounts-grid-table',
  templateUrl: './point-master-accounts-grid-table.component.html',
  styleUrl: './point-master-accounts-grid-table.component.scss'
})
export class PointMasterAccountsGridTableComponent implements OnInit {
  constructor(private pointChargeService: PointChargeService, private toastr: ToastrService, private commonTransactionService: CommonTransactionService, private _Activatedroute: ActivatedRoute) { }
  
  @Input()
  searchedPoint!: any;
  pointChargesList: any;
  loadSpinner: boolean = false;
  pointData!: PointChargeDataModel;
  selectedPointId: number = 0;
  
  ngOnInit(): void {
    this.getAllPointChargesList();
  }

  //SORTING DATA FROM FILTER CHANGES
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchedPoint'].currentValue) {
      this.getFilteredPointList();
    } else if (changes['searchedPoint'].firstChange === false && changes['searchedPoint'].currentValue === undefined) {
      this.getAllPointChargesList();
    }
  }

  // GET ALL POINT CHARGE
  getAllPointChargesList() {
    this.loadSpinner = true;
    let data = {
      "screenCode": 103,
      "pointName": '',
      locationIds: []
    }
    this.pointChargeService.getPointCharges(data).subscribe((response: any) => {
      this.pointChargesList = response.pointCharges;
      this.selectPoint(this.selectedPointId);
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getFilteredPointList() {
    this.loadSpinner = true;
    let data = {
      "screenCode": 103,
      "pointName": this.searchedPoint.pointName || "",
      locationIds: this.searchedPoint.locationIds
    }
    this.pointChargeService.getPointCharges(data).subscribe((response: any) => {
      this.pointChargesList = response.pointCharges;
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  selectPoint(pointId: number) {
    this.selectedPointId = pointId;
  }

  openPopover(popover: NgbPopover) {
    popover.open();
  }

  closePopover(popover: NgbPopover) {
    popover.close();
  }

  approvePoint(remarks: string, approvePopover: NgbPopover, data: any) {
    const payload = this.approvalPayload('Approved', remarks);
    this.updateStatus(payload, approvePopover, data);
  }

  rejectPoint(remarks: string, rejectPopover: NgbPopover, data: any) {
    const payload = this.approvalPayload('Rejected', remarks);
    this.updateStatus(payload, rejectPopover, data);
  }

  approvalPayload(status: string, remarks: string): any {
    return {
      approvalLevel: "Account",
      status: status,
      remarks: remarks,
      actionBy: localStorage.getItem("userId"),
      transactionCode: 202 // for Account Point Charge
    };
  }

  updateStatus(payload: any, popover: NgbPopover, data: any) {
    this.loadSpinner = true;
    this.commonTransactionService.updateStatus(data.locationId,this.selectedPointId, payload).subscribe((response: any) => {
      this.pointData = response;
      this.loadSpinner = false;
      this.toastr.success('Point Approval Updated Successfully');
      popover.close();
      this.getAllPointChargesList();
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    });
  }

}