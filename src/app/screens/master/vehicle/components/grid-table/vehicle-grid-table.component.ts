import { Component, Input, OnInit } from '@angular/core';
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

  constructor(private router: Router,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private baseService : BaseService,) { }

  ngOnInit() :void{
    this.getLookupData();
    this.getAllVehiclesList();
  }


  onEditVehicle() {
    this.router.navigate(['master/addEditVehicle']);
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
    this.vehicleService.getvehicles(this.locationId,data).subscribe((response:any) => {
      console.log(response)
      this.vehiclesList = response.vehicles;
    }, error => {
      this.toastr.error(error.statusText, error.status);
    })
  }

}