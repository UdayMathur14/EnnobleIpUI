import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { VehicleService } from '../../../../../core/service/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { BaseService } from '../../../../../core/service/base.service';
import { CommonUtility } from '../../../../../core/utilities/common';

@Component({
  selector: 'app-vehicle-grid-table',
  templateUrl: './vehicle-grid-table.component.html',
  styleUrl: './vehicle-grid-table.component.scss'
})
export class VehicleGridTableComponent implements OnInit {
  vehiclesList:any;
  @Input() searchedVehicle: any;
  loadSpinner: boolean = true;
  vehiclesListOrg:any;
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';
  constructor(private router: Router,
    private vehicleService: VehicleService,
    private toastr: ToastrService,
    private baseService : BaseService,) { }

  ngOnInit() :void{
    this.getAllVehiclesList();
  }

  //ROUTING TO EDIT VEHICLE PAGE
  onEditVehicle(vehicleData: any) {
    this.router.navigate(['master/editVehicle', vehicleData.id]);
  }

 // GET ALL VEHICLE DATA 
  getAllVehiclesList(){
    let data = {
      "vehicleNumber" : '',
      "transporterId": 0
    }
    this.vehicleService.getVehicles(data).subscribe((response:any) => {
      this.vehiclesList = response.vehicles;
      this.vehiclesListOrg = response.plants;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error?.details?.[0]?.description);
      this.loadSpinner = false;
    })
  }

  // GET FILTERED VEHICLE DATA
  getFilteredVehiclesList() {
    let data = {
      "vehicleNumber": this.searchedVehicle.vehicleNumber,
      "transporterId": this.searchedVehicle.transporterId
    }
    this.vehicleService.getVehicles(data).subscribe((response: any) => {
      this.vehiclesList = response.vehicles;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error?.details?.[0]?.description);
      this.loadSpinner = false;
    })
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['searchedVehicle'].currentValue) {
      this.getFilteredVehiclesList();
    } else if (changes['searchedVehicle'].firstChange === false && changes['searchedVehicle'].currentValue === '') {
      this.getAllVehiclesList();
    }

  }

  sortData(field: string) {
    this.sortDirection = (this.sortField === field && this.sortDirection === 'asc') ? 'desc' : 'asc';
    this.sortField = field;
    CommonUtility.sortTableData(field, this.sortDirection, this.vehiclesList);
  }

}