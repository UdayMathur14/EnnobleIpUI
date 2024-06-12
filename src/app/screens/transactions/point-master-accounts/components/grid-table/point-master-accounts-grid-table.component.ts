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
<<<<<<< HEAD
export class PointMasterAccountsGridTableComponent implements OnInit {
  constructor(private pointChargeService: PointChargeService, private toastr: ToastrService, private commonTransactionService: CommonTransactionService, private _Activatedroute: ActivatedRoute) { }
=======
export class PointMasterAccountsGridTableComponent implements OnInit{
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
  @Input()
  searchedPoint!: any;
  pointChargesList: any;
  loadSpinner: boolean = false;
  pointData!: PointChargeDataModel;
  selectedPointId: number = 0;
  
  constructor(private pointChargeService: PointChargeService, private toastr: ToastrService, private commonTransactionService: CommonTransactionService, private _Activatedroute: ActivatedRoute) { }

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

  approvePoint(remarks: string, approvePopover: NgbPopover) {
    const payload = this.approvalPayload('Approved', remarks);
    this.updateStatus(payload, approvePopover);
  }

  rejectPoint(remarks: string, rejectPopover: NgbPopover) {
    const payload = this.approvalPayload('Rejected', remarks);
    this.updateStatus(payload, rejectPopover);
  }

  approvalPayload(status: string, remarks: string): any {
    return {
      approvalLevel: "Account",
      status: status,
      remarks: remarks,
      actionBy: 1,
      transactionCode: 202 // for Account Point Charge
    };
  }

  updateStatus(payload: any, popover: NgbPopover) {
    this.loadSpinner = true;
    this.commonTransactionService.updateStatus(this.selectedPointId, payload).subscribe((response: any) => {
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