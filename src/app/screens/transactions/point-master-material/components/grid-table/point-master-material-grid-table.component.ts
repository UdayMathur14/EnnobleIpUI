import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
import { CommonTransactionService } from '../../../../../core/service/commonTransaction.service';
import { PointChargeDataModel } from '../../../../../core/model/masterModels.model';
import { PointChargeService } from '../../../../../core/service/point-charge.service';

@Component({
  selector: 'app-point-master-material-grid-table',
  templateUrl: './point-master-material-grid-table.component.html',
  styleUrl: './point-master-material-grid-table.component.scss'
})
export class PointMasterMaterialGridTableComponent {
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
      "screenCode": 102,
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
      "screenCode": 102,
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
      "approvalLevel": "Material",
      "status": status,
      "remarks": remarks,
      "actionBy": localStorage.getItem("userId"),
      "transactionCode": 202 // for Material Point Charge
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