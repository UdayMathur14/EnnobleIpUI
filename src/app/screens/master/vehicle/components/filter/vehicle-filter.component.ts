import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../../../core/service/vehicle.service';
import { APIConstant } from '../../../../../core/constants';
import { LookupService } from '../../../../../core/service/lookup.service';

@Component({
  selector: 'app-vehicle-filters',
  templateUrl: './vehicle-filter.component.html',
  styleUrl: './vehicle-filter.component.scss'
})
export class VehicleFiltersComponent implements OnInit {
  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Output() locationsData: EventEmitter<any[]> = new EventEmitter();
  @Input() filters: any = [];
  commonLocations: any = [];
  locationIds : any[] = []
  locations : any[] = [];
  vehicleNum : any = undefined;
  transporterNam : any = undefined;
  loadSpinner: boolean = true;
  transporterId: number = 0;
  allVehicleNo: any = [];
  filteredVehicleNo: any = [];
  vehicleSize: any;
  status: any;

  constructor(private lookupService: LookupService
  ) { }

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

  onVehicleSearch() {
    let obj = {
      "vehicleNumber": this.vehicleNum || "",
      "transporterId": this.transporterNam || "",
      "locationIds" : this.locationIds || [],
      "vehcileSize": this.vehicleSize || "",
      "status": this.status || ""
    }
    this.getData.emit(obj)
  }

  onClearFilter() {
    this.vehicleNum = undefined;
    this.transporterNam = undefined;
    this.vehicleSize = undefined;
    this.status = undefined;
    this.locationIds = this.locationIds;
    let obj = {
      "vehicleNumber": undefined,
      "transporterNam": undefined,
      "status": undefined,
      "vehicleSize": undefined,
      "locationIds" : this.locationIds
    }
    this.getData.emit(obj)
  }
}
