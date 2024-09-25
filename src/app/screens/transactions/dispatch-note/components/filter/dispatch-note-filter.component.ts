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
  locationIds : any[] = APIConstant.commonLocationsList.map((e:any)=>(e.id))
  locations : any[] = APIConstant.commonLocationsList;
  @Output() locationsData: EventEmitter<any[]> = new EventEmitter();
  

  constructor(private lookupService: LookupService) { }

ngOnInit(): void {

}
  handleSearch() {
    this.getData.emit({ dispatchNumber: this.dispatchNumber,locationIds:this.locationIds, status: this.status, frlrNo: this.frlrNo })
  }

  onClearFilter() {
    this.dispatchNumber = null;
    this.status = undefined;
    this.frlrNo = undefined;
    this.locationIds = this.locationIds;
    this.getData.emit({ dispatchNumber: null,locationIds:this.locationIds, status: '', frlrNo: ''})
  }
}
