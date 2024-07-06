import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../../../core/service/vehicle.service';
import { APIConstant } from '../../../../../core/constants';

@Component({
  selector: 'app-vehicle-filters',
  templateUrl: './vehicle-filter.component.html',
  styleUrl: './vehicle-filter.component.scss'
})
export class VehicleFiltersComponent implements OnInit {
  @Input() locations : any[] = [];
  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Input() filters: any = [];
  locationIds : any[] = APIConstant.locationsListDropdown.map((e: any) => (e.id));;
  vehicleNum : any = undefined;
  transporterNam : any = undefined;
  loadSpinner: boolean = true;
  transporterId: number = 0;
  allVehicleNo: any = [];
  filteredVehicleNo: any = [];
  vehicleSize: any;
  status: any;

  constructor(
  ) { }

  ngOnInit(): void {
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
    this.locationIds = [];
    let obj = {
      "vehicleNumber": undefined,
      "transporterNam": undefined,
      "status": undefined,
      "vehicleSize": undefined,
      "locationIds" : []
    }
    this.getData.emit(obj)
  }
}
