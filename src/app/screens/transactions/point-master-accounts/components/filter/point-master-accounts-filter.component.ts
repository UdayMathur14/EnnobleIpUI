import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PointChargeService } from '../../../../../core/service/point-charge.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-point-master-accounts-filter',
  templateUrl: './point-master-accounts-filter.component.html',
  styleUrl: './point-master-accounts-filter.component.scss'
})
export class PointMasterAccountsFiltersComponent implements OnInit{
  @Output() pointFilterObj : EventEmitter<object> = new EventEmitter();
  pointName : any = undefined;
  filters : any = [];
  locations:any[] = APIConstant.locationsListDropdown;
  locationIds:any[]= APIConstant.locationsListDropdown.map((e:any)=>(e.id));
  
  
  constructor(private pointChargeService : PointChargeService,
    private toastr : ToastrService){}

  ngOnInit(): void {
    this.getAllPointChargesList();
  }

  //BINDING POINT CHARGE NUMBERS DROPDOWN
  getAllPointChargesList() {
    let data = {
      "screenCode": 103, //Lookup Account Screen Code
      "pointName": '',
      locationIds:[]
    }
    this.pointChargeService.getPointCharges(data).subscribe((response: any) => {
      this.filters = response.filters;
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    })
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
    this.locationIds = [];
    let obj = {
      pointName : '',
      locationIds:[]
    }
    this.pointFilterObj.emit(obj)
  }
}
