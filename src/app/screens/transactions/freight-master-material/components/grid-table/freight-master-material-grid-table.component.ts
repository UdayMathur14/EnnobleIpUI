import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbPopover } from "@ng-bootstrap/ng-bootstrap";
import { FreightService } from '../../../../../core/service/freight.service';
import { ToastrService } from 'ngx-toastr';
import { CommonTransactionService } from '../../../../../core/service/commonTransaction.service';
import { FreightDataModel } from '../../../../../core/model/masterModels.model';
import { LookupService } from '../../../../../core/service/lookup.service';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-freight-master-material-grid-table',
  templateUrl: './freight-master-material-grid-table.component.html',
  styleUrl: './freight-master-material-grid-table.component.scss'
})
export class FreightMasterMaterialGridTableComponent implements OnInit {
  @Input()
  searchedFreight!: any;
  freightList: any;
  loadSpinner: boolean = false;
  freightData!: FreightDataModel;
  selectedFreightId: number = 0;
  currentPage: number = 1;
  count: number = 10;
  totalFreight: number = 0;
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  commonLocations: any = [];
  locationIds : any[] = []
  locations : any[] = [];

  constructor(private freightService: FreightService, private toastr: ToastrService, private commonTransactionService: CommonTransactionService, private _Activatedroute: ActivatedRoute,
    private lookupService: LookupService
  ) { }

  ngOnInit(): void {
    this.getAllFreightListInit();
  }

  

  //SORTING DATA FROM FILTER CHANGES
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchedFreight'].currentValue) {
      this.getAllFreightListInit();
    }
  }

  //GETTINGS FREIGHTS LISTING ON PAGE LOAD
  getAllFreightListInit(offset: number = 0, count: number = this.count, filters: any = this.searchedFreight) {
    this.loadSpinner= true;
    let data = {
      "screenCode": 102, //Freight Material Screen Code
      "freightCode": filters?.freightCode || '',
      locationIds: filters?.locationIds || APIConstant.commonLocationsList.map((e:any)=>(e.id))
    }
    this.freightService.getFreightsList(data, offset, count).subscribe((response: any) => {
      this.freightList = response.freights;
      this.totalFreight = response.paging.total;
      this.selectFreight(this.selectedFreightId);

      this.loadSpinner = false;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getAllFreightListInit(offset, this.count, this.searchedFreight);
  }

  onPageSizeChange(data: any) {
      this.count = data;
      this.currentPage = 1;
      this.getAllFreightListInit(0, this.count, this.searchedFreight);
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

  approveFreight(remarks: string, approvePopover: NgbPopover, data: any) {
    const payload = this.approvalPayload('Approved', remarks);
    this.updateStatus(payload, approvePopover, data);
  }

  rejectFreight(remarks: string, rejectPopover: NgbPopover, data: any) {
    const payload = this.approvalPayload('Rejected', remarks);
    this.updateStatus(payload, rejectPopover, data);
  }

  approvalPayload(status: string, remarks: string): any {
    return {
      "approvalLevel": "Material",
      "status": status,
      "remarks": remarks,
      "actionBy": localStorage.getItem("userId"),
      "transactionCode": 201 // for Material freight
    };
  }

  updateStatus(payload: any, popover: NgbPopover, data: any) {
    this.loadSpinner = true;
    this.commonTransactionService.updateStatus(data.locationId, this.selectedFreightId, payload).subscribe((response: any) => {
      this.freightData = response;
      this.loadSpinner = false;
      this.toastr.success('Freight Approval Updated Successfully');
      popover.close();
      this.getAllFreightListInit();
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    });
  }

  downloadPDF(data: any) {
    this.freightService.getFreightData(data?.locationId, data?.id).subscribe(
        (response: any) => {
            if (!response.fileData) {
                this.toastr.error('No PDF is available to download', 'Error');
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
            
            const a = document.createElement('a');
            a.href = url;
            a.download = response.fileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);

            this.loadSpinner = false;
        },
    );
}

}