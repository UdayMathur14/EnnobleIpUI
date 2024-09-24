import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { APIConstant } from '../../../../../core/constants';
import { LookupService } from '../../../../../core/service/lookup.service';

@Component({
  selector: 'app-advice-filter',
  templateUrl: './advice-filter.component.html',
  styleUrl: './advice-filter.component.scss'
})
export class AdviceFilterComponent implements OnInit {
  @Input() filters : any = [];
  @Output() getData : EventEmitter<object> = new EventEmitter();
  adviceType : any = undefined;
  batchName: any = undefined;
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
        console.log(this.locations);
        
    }, error => {
      //this.toastr.error(error?.error?.details?.map((detail: any) => detail.description).join('<br>'));
    });
  }


  onAdviceSearch(){
    let obj = {
      "locationIds": this.locationIds || [],
      "adviceType" : this.adviceType || "",
      "status": this.status || "",
      "batchName": this.batchName || ""
    }
    this.getData.emit(obj)
  }

  onClearFilter(){
    this.adviceType = undefined;
    this.locationIds = this.locationIds;
    this.status = undefined;
    this.batchName = undefined;
    let obj = {
      "adviceType" : "",
      "locationIds": this.locationIds,
      "status": "",
      "batchName": ""
    }
    this.getData.emit(obj)
  }
  
}
