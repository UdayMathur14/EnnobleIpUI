import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { VehicleService } from '../../../../../core/service/vehicle.service';

@Component({
  selector: 'app-vehicle-filters',
  templateUrl: './vehicle-filter.component.html',
  styleUrl: './vehicle-filter.component.scss'
})
export class VehicleFiltersComponent implements OnInit {

  constructor(
    private vehicleService: VehicleService,
    private toastr: ToastrService
  ) { }

  @Output() vehicleFilterData: EventEmitter<any> = new EventEmitter();
  vehiclesList: any;
  vehicleNum!: string;

  ngOnInit(): void {
    this.getAllVehiclesListInit();
  }

  getAllVehiclesListInit() {
    let data = {
      "vehicleNumber": ''
    }
    this.vehicleService.getVehicles(data).subscribe((response: any) => {
      this.vehiclesList = response.vehicles;
    }, error => {
      this.toastr.error(error.statusText, error.status);
    });
  }

  onVehicleSearch() {
    let obj = {
      "vehicleNumber": this.vehicleNum || ""
    }
    this.vehicleFilterData.emit(obj)

  }

}
