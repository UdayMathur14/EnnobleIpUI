import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FreightService } from '../../../../../core/service/freight.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';
import { LookupService } from '../../../../../core/service/lookup.service';

@Component({
  selector: 'app-freight-filter',
  templateUrl: './freight-filter.component.html',
  styleUrl: './freight-filter.component.scss'
})
export class FreightFilterComponent implements OnInit {
  @Output() getData : EventEmitter<object> = new EventEmitter();
  @Output() locationsData: EventEmitter<any[]> = new EventEmitter();
  @Input() filters : any =[];
  freightCode : any = undefined;
  source : any = undefined;
  destination : any = undefined;
  vehicleSize : any = undefined;
  status: any = undefined;
  commonLocations: any = [];
  locationIds : any[] = APIConstant.commonLocationsList.map((e:any)=>(e.id))
  locations : any[] =APIConstant.commonLocationsList;
  
  constructor(private lookupService: LookupService){}

  ngOnInit(): void {

  }

  onFreightSearch(){
    let obj = {
      "freightCode" : this.freightCode || "",
      "source" : this.source || "",
      "vehicleSize" : this.vehicleSize || "",
      "destination" : this.destination || "",
      "locationIds":this.locationIds || [],
      "status": this.status || ""
      
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.freightCode = undefined;
    this.source = undefined;
    this.vehicleSize = undefined;
    this.destination = undefined;
    this.locationIds = this.locationIds;
    this.status = undefined;
    let obj = {
      "freightCode" : "",
      "source" : "",
      "vehicleSize" : "",
      "destination" : "",
      "locationIds" : this.locationIds,
      "status": ""
    }
    this.getData.emit(obj)
  }
  
}
