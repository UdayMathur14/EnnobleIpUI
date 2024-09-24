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
  @Input() filters : any =[];
  freightCode : any = undefined;
  source : any = undefined;
  destination : any = undefined;
  vehicleSize : any = undefined;
  status: any = undefined;
  commonLocations: any = [];
  locationIds : any[] = []
  locations : any[] = [];
  
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
        
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    });
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
