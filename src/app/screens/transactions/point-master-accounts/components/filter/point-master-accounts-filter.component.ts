import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PointChargeService } from '../../../../../core/service/point-charge.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-point-master-accounts-filter',
  templateUrl: './point-master-accounts-filter.component.html',
  styleUrl: './point-master-accounts-filter.component.scss'
})
export class PointMasterAccountsFiltersComponent implements OnInit{
  @Output() pointFilterObj : EventEmitter<object> = new EventEmitter();
  pointName : any = undefined;
  pointChargeList : any = [];
  
  constructor(private pointChargeService : PointChargeService,
    private toastr : ToastrService){}

  ngOnInit(): void {
    this.getAllPointChargesList();
  }

  //BINDING POINT CHARGE NUMBERS DROPDOWN
  getAllPointChargesList() {
    let data = {
      "screenCode": 103, //Lookup Account Screen Code
      "pointName": ''
    }
    this.pointChargeService.getPointCharges(data).subscribe((response: any) => {
      this.pointChargeList = response.pointCharges;
    }, error => {
      this.toastr.error(error.error?.details?.[0]?.description);
    })
  }

  onPointChargeSearch(){
    let obj = {
      "pointName" : this.pointName || "",
    }
    this.pointFilterObj.emit(obj)
  }

  onClearFilter(){
    this.pointName = undefined;
    let obj = {
      pointName : '',
    }
    this.pointFilterObj.emit(obj)
  }
}
