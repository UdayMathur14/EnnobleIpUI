import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { FreightService } from '../../../../../core/service/freight.service';
import { ToastrService } from 'ngx-toastr';
import { CommonTransactionService } from '../../../../../core/service/commonTransaction.service';
import { FreightDataModel } from '../../../../../core/model/masterModels.model';

@Component({
  selector: 'app-freight-master-material-grid-table',
  templateUrl: './freight-master-material-grid-table.component.html',
  styleUrl: './freight-master-material-grid-table.component.scss'
})
export class FreightMasterMaterialGridTableComponent implements OnInit {
  constructor(private freightService: FreightService, private toastr: ToastrService, private commonTransactionService: CommonTransactionService, private _Activatedroute: ActivatedRoute) { }
  @Input()
  searchedFreight!: any;
  freightList: any;
  loadSpinner: boolean = false;
  freightData!: FreightDataModel;
  selectedFreightId: number = 0;

  ngOnInit(): void {
    this.getAllFreightListInit();
  }

  //SORTING DATA FROM FILTER CHANGES
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchedFreight'].currentValue) {
      this.getFilteredFreightsList();
    } else if (changes['searchedFreight'].firstChange === false && changes['searchedFreight'].currentValue === undefined) {
      this.getAllFreightListInit();
    }
  }

  //GETTINGS FREIGHTS LISTING ON PAGE LOAD
  getAllFreightListInit() {
    this.loadSpinner= true;
    let data = {
      "screenCode": 102, //Freight Material Screen Code
      "freightCode": '',
      locationIds: []
    }
    this.freightService.getFreightsList(data).subscribe((response: any) => {
      this.freightList = response.freights;
      this.selectFreight(this.selectedFreightId);

      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //THIS IS EVENT EMITTED FN. WHICH CALLS WHEN WE SEARCH FREIGHT FROM FILTERS 
  getFilteredFreightsList() {
    this.loadSpinner = true;
    let data = {
      "screenCode": 102,
      "freightCode": this.searchedFreight.freightCode || "",
      locationIds: this.searchedFreight.locationIds
    }
    this.freightService.getFreightsList(data).subscribe((response: any) => {
      this.freightList = response.freights;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  selectFreight(freightId: number) {
    this.selectedFreightId = freightId;
  }

  openPopover(popover: NgbPopover) {
    popover.open();
  }

  closePopover(popover: NgbPopover) {
    popover.close();
  }

  approveFreight(remarks: string, approvePopover: NgbPopover) {
    const payload = this.approvalPayload('Approved', remarks);
    this.updateStatus(payload, approvePopover);
  }

  rejectFreight(remarks: string, rejectPopover: NgbPopover) {
    const payload = this.approvalPayload('Rejected', remarks);
    this.updateStatus(payload, rejectPopover);
  }

  approvalPayload(status: string, remarks: string): any {
    return {
      "approvalLevel": "Material",
      "status": status,
      "remarks": remarks,
      "actionBy": 1,
      "transactionCode": 201 // for Material freight
    };
  }

  updateStatus(payload: any, popover: NgbPopover) {
    this.loadSpinner = true;
    this.commonTransactionService.updateStatus(this.selectedFreightId, payload).subscribe((response: any) => {
      this.freightData = response;
      this.loadSpinner = false;
      this.toastr.success('Freight Approval Updated Successfully');
      popover.close();
      this.getAllFreightListInit();
    }, error => {
      this.toastr.error(error?.error?.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    });
  }

}