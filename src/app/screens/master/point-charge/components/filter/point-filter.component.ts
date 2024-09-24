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
  locationIds : any[] = []
  locations : any[] = [];
  pointName : any = undefined;
  status: any = undefined;
  
  constructor(private lookupService: LookupService){}

  ngOnInit(): void {
    this.getCommonLocations();
    this.getLocations();
  }

  getCommonLocations(){
    this.commonLocations = APIConstant.commonLocationsList;
  }

  getLocations() {
    let data = {
      CreationDate: '',
      LastUpdatedBy: '',
      LastUpdateDate: '',
    };
    const type = 'Locations';
    this.lookupService.getLocationsLookup(data, type).subscribe((res: any) => {
      this.locations = res.lookUps.filter(
        (item: any) => item.status === 'Active' && 
        this.commonLocations.some((location: any) => location.id === item.id));
        this.locationIds = this.locations.map((e: any) => (e.id));
        this.locationsData.emit(this.locationIds);
        
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    });
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
