import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from 'ngx-toastr';
import { CommonTransactionService } from '../../../../../core/service/commonTransaction.service';
import { PointChargeDataModel } from '../../../../../core/model/masterModels.model';
import { PointChargeService } from '../../../../../core/service/point-charge.service';
import { LookupService } from '../../../../../core/service/lookup.service';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-point-master-accounts-grid-table',
  templateUrl: './point-master-accounts-grid-table.component.html',
  styleUrl: './point-master-accounts-grid-table.component.scss'
})
export class PointMasterAccountsGridTableComponent implements OnInit {
  
  @Input()
  searchedPoint!: any;
  pointChargesList: any;
  loadSpinner: boolean = false;
  pointData!: PointChargeDataModel;
  selectedPointId: number = 0;
  currentPage: number = 1;
  count: number = 10;
  totalPointCharge: number = 0;
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  commonLocations: any = [];
  locationIds : any[] = []
  locations : any[] = [];

  constructor(private pointChargeService: PointChargeService, private toastr: ToastrService, private commonTransactionService: CommonTransactionService, private _Activatedroute: ActivatedRoute,
    private lookupService: LookupService
  ) { }
  
  ngOnInit(): void {
    this.getAllPointChargesList();
  }

  //SORTING DATA FROM FILTER CHANGES
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchedPoint'].currentValue) {
      this.getAllPointChargesList();
    }
  }
  // GET ALL POINT CHARGE
  getAllPointChargesList(offset: number = 0, count: number = this.count, filters: any = this.searchedPoint) {
    this.loadSpinner = true;
    let data = {
      "screenCode": 103,
      "pointName": filters?.pointName || "",
      locationIds: filters?.locationIds || APIConstant.commonLocationsList.map((e:any)=>(e.id))
    }
    this.pointChargeService.getPointCharges(data, offset, count).subscribe((response: any) => {
      this.pointChargesList = response.pointCharges;
      this.totalPointCharge = response.paging.total;
      this.selectPoint(this.selectedPointId);
      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getAllPointChargesList(offset, this.count, this.searchedPoint);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getAllPointChargesList(0, this.count, this.searchedPoint);
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

  openPDF(data: any) {
    this.loadSpinner = true;
    this.pointChargeService.getContractById(data?.locationId, data?.id).subscribe(
        (response: any) => {
            if (!response.fileData) {
                this.toastr.error('No PDF is available to view', 'Error');
                this.loadSpinner = false;
                return;
            }

            const base64Prefix = 'data:application/pdf;base64,';
            const base64Data = response.fileData.startsWith(base64Prefix) 
                ? response.fileData.substring(base64Prefix.length) 
                : response.fileData;
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);

            window.open(url, '_blank');

            setTimeout(() => window.URL.revokeObjectURL(url), 100);

            this.loadSpinner = false;
        },
    );
}

}