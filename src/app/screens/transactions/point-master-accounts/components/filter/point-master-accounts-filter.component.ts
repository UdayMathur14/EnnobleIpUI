import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PointChargeService } from '../../../../../core/service/point-charge.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';
import { LookupService } from '../../../../../core/service/lookup.service';
import { DispatchNoteService } from '../../../../../core/service/dispatch-note.service';

@Component({
  selector: 'app-point-master-accounts-filter',
  templateUrl: './point-master-accounts-filter.component.html',
  styleUrl: './point-master-accounts-filter.component.scss'
})
export class PointMasterAccountsFiltersComponent implements OnInit{
  @Output() pointFilterObj : EventEmitter<object> = new EventEmitter();
  pointName : any = undefined;
  filters : any = [];
  commonLocations: any = [];
  locationIds : any[] = APIConstant.commonLocationsList.map((e:any)=>(e.id))
  locations : any[] = APIConstant.commonLocationsList;
  
  
  constructor(private pointChargeService : PointChargeService,
    private toastr : ToastrService,
    private lookupService: LookupService,
     private dispatchNoteService: DispatchNoteService
  ){}

  ngOnInit(): void {
    this.getDispatchData();
  }

  //BINDING POINT CHARGE NUMBERS DROPDOWN
  getDispatchData(
    offset: number = 0,
    count: number = 0,
    filters: any = 0
  ) {
    const data = {
      ApplicationNumber: filters?.ApplicationNumber || '',
      ClientInvoiceNumber: filters?.ClientInvoiceNumber,
      Status: filters?.status || '',
      VendorName: filters?.vendors || '',
    };
    this.dispatchNoteService.getDispatchNote(data, offset, count).subscribe(
      (res: any) => {
        this.filters = res.filters;
      },
      (error) => {
      }
    );
  }

  onPointChargeSearch(){
    let obj = {
      "pointName" : this.pointName || "",
      locationIds: this.locationIds
    }
    this.pointFilterObj.emit(obj)
  }

  onClearFilter(){
    this.pointName = undefined;
    this.locationIds = this.locationIds;
    let obj = {
      pointName : '',
      locationIds: this.locationIds
    }
    this.pointFilterObj.emit(obj)
  }
}
