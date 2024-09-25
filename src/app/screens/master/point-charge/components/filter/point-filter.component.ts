import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';
import { LookupService } from '../../../../../core/service/lookup.service';

@Component({
  selector: 'app-point-filter',
  templateUrl: './point-filter.component.html',
  styleUrl: './point-filter.component.scss'
})
export class PointFilterComponent implements OnInit {
  @Input() filters : any = [];
  @Output() getData : EventEmitter<object> = new EventEmitter();
  @Output() locationsData: EventEmitter<any[]> = new EventEmitter();
  commonLocations: any = [];
  locationIds : any[] = APIConstant.commonLocationsList.map((e:any)=>(e.id))
  locations : any[] = APIConstant.commonLocationsList;
  pointName : any = undefined;
  status: any = undefined;
  
  constructor(private lookupService: LookupService){}

  ngOnInit(): void {
 
  }

  onFreightSearch(){
    let obj = {
      "pointName" : this.pointName || "",
      "locationIds" : this.locationIds || [],
      "status": this.status || ""
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.pointName = undefined;
    this.locationIds = this.locationIds;
    this.status = undefined;
    let obj = {
      "pointName" : undefined,
      "locationIds" : this.locationIds,
      "status": undefined
    }
    this.getData.emit(obj)
  }
  
}
