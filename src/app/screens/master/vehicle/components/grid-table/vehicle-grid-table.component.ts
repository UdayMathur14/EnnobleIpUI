import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../../../../core/service/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from '../../../../../core/service/base.service';

@Component({
  selector: 'app-vehicle-grid-table',
  templateUrl: './vehicle-grid-table.component.html',
  styleUrl: './vehicle-grid-table.component.scss'
})
export class VehicleGridTableComponent implements OnInit {
  vehiclesList:any;
  @Input() filterKeyword!: string;
  loadSpinner: boolean = true;

  constructor(private router: Router,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private baseService : BaseService,) { }

  ngOnInit() :void{
    this.getAllVehiclesList();
  }

  onEditVehicle(vehicleData: any) {
    this.router.navigate(['master/editVehicle', vehicleData.id]);
  }

  getAllVehiclesList(){
    let data = {
      "vehicleNumber" : '',
      "transporterId": 0
    }
    this.vehicleService.getVehicles(data).subscribe((response:any) => {
      this.vehiclesList = response.vehicles;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

}