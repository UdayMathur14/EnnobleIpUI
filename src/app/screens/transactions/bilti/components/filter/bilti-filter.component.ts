import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { BiltiService } from '../../../../../core/service/bilti.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../../../core/constants';
import { LookupService } from '../../../../../core/service/lookup.service';

@Component({
  selector: 'app-bilti-filter',
  templateUrl: './bilti-filter.component.html',
  styleUrl: './bilti-filter.component.scss'
})
export class BiltiFilterComponent implements OnInit {

  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Input() filters : any = [];
  biltiNum!: any | null;
  biltisList: any = [];
  loadSpinner: boolean = true;
  commonLocations: any = [];
  locationIds : any[] = []
  locations : any[] = [];
  @Output() locationsData: EventEmitter<any[]> = new EventEmitter();

  constructor(private lookupService: LookupService) { }

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
  
  onBiltiSearch() {
    let obj = {
      "biltiNumber": this.biltiNum || "",
      locationIds: this.locationIds
    }
    this.getData.emit(obj)
  }


  onClearFilter() {
    this.biltiNum = null;
    this.locationIds = this.locationIds;
    let obj = {
      biltiNum: null,
      locationIds: this.locationIds
    }
    this.getData.emit(obj)
  }
}
