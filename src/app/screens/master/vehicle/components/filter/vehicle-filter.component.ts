import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../../../core/service/vehicle.service';

@Component({
  selector: 'app-vehicle-filters',
  templateUrl: './vehicle-filter.component.html',
  styleUrl: './vehicle-filter.component.scss'
})
export class VehicleFiltersComponent implements OnInit {
  @Output() getData: EventEmitter<any> = new EventEmitter();
  @Input() vehiclesList: any[] = [];
  @Input() transportersList : any[] = [];
  vehicleNum : any = undefined;
  transporterNam : any = undefined;
  loadSpinner: boolean = true;
  transporterId: number = 0;
  allVehicleNo: any = [];
  filteredVehicleNo: any = [];

  constructor(
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
  }

  // GET ALL VEHICLES DATA
  getAllVehiclesListInit() {
    let data = {
      "vehicleNumber": '',
      "transporterId": 0
    }
    this.vehicleService.getVehicles(data).subscribe((response: any) => {
      this.vehiclesList = response.vehicles;
      this.allVehicleNo = response.vehicles.map((vehicle: any) => vehicle.vehicleNumber);
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
    });
  }

  onVehicleSearch() {
    let obj = {
      "vehicleNumber": this.vehicleNum || "",
      "transporterId": this.transporterNam
    }
    this.getData.emit(obj)
  }

  onClearFilter() {
    this.vehicleNum = undefined;
    this.transporterNam = undefined
    let obj = {
      "vehicleNumber": undefined,
      "transporterNam": undefined
    }
    this.getData.emit(obj)
  }
}
