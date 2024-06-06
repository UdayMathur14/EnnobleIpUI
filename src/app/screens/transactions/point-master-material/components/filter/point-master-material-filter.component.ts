import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PointChargeService } from '../../../../../core/service/point-charge.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-point-master-material-filter',
  templateUrl: './point-master-material-filter.component.html',
  styleUrl: './point-master-material-filter.component.scss'
})
export class PointMasterMaterialFiltersComponent implements OnInit {
  @Output() pointFilterObj : EventEmitter<object> = new EventEmitter();
  pointName : any = undefined;
  pointChargeList : any = [];
  locations:any[] = APIConstant.locationsListDropdown;
  locationIds:any[]=[];
  
  constructor(private pointChargeService : PointChargeService,
    private toastr : ToastrService){}

  ngOnInit(): void {
    this.getAllPointChargesList();
  }

  //BINDING POINT CHARGE NUMBERS DROPDOWN
  getAllPointChargesList() {
    let data = {
      "screenCode": 102, //Lookup Material Screen Code
      "pointName": '',
      locationIds:[]
    }
    this.pointChargeService.getPointCharges(data).subscribe((response: any) => {
      this.pointChargeList = response.pointCharges;
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
    let obj = {
      pointName : '',
      locationIds:[]
    }
    this.pointFilterObj.emit(obj)
  }

}
