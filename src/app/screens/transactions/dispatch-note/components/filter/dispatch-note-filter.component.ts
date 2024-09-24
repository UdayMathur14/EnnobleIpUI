import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { APIConstant } from '../../../../../core/constants';
import { LookupService } from '../../../../../core/service/lookup.service';

@Component({
  selector: 'app-dispatch-note-filters',
  templateUrl: './dispatch-note-filter.component.html',
  styleUrl: './dispatch-note-filter.component.scss'
})
export class DispatchNoteFiltersComponent implements OnInit {
  
  @Output() getData: EventEmitter<any> = new EventEmitter();
  dispatchNumber:any = undefined;
  status: any = undefined;
  frlrNo: any = undefined;
  @Input() filters : any = [];
  commonLocations: any = [];
  locationIds : any[] = []
  locations : any[] = [];
  @Output() locationsData: EventEmitter<any[]> = new EventEmitter();
  

  constructor(private lookupService: LookupService) { }

ngOnInit(): void {
  this.getCommonLocations();
    this.getLocations();
}
  handleSearch() {
    this.getData.emit({ dispatchNumber: this.dispatchNumber,locationIds:this.locationIds, status: this.status, frlrNo: this.frlrNo })
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

  onClearFilter() {
    this.dispatchNumber = null;
    this.status = undefined;
    this.frlrNo = undefined;
    this.locationIds = this.locationIds;
    this.getData.emit({ dispatchNumber: null,locationIds:this.locationIds, status: '', frlrNo: ''})
  }
}
