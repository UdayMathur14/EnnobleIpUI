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

  locationId:number=0;
  lookupId:number=4;
  vehiclesList:any;
  @Input() filterKeyword!: string;
  loadSpinner: boolean = true;

  constructor(private router: Router,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private baseService : BaseService,) { }

  ngOnInit() :void{
    this.getLookupData();
    this.getAllVehiclesList();
  }

  onEditVehicle(vehicleData: any) {
    this.router.navigate(['master/editVehicle', vehicleData.id]);
  }
  getLookupData() {
    this.vehicleService.getLookupData(this.lookupId).subscribe((response: any) => {
      this.locationId = response.id;
    })
  }

  getAllVehiclesList(){
    let data = {
      "vehicleNumber" : '',
      "transporterId": 0
    }
    this.vehicleService.getVehicles(this.locationId,data).subscribe((response:any) => {
      this.vehiclesList = response.vehicles;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.statusText, error.status);
      this.loadSpinner = false;
    })
  }

}