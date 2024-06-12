import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { XlsxService } from '../../../core/service/xlsx.service';
import { VehicleService } from '../../../core/service/vehicle.service';
import { ToastrService } from 'ngx-toastr';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent implements OnInit{

  isFilters: boolean = true;
  vehiclesList: any[] = [];
  fullScreen : boolean = false;
  vehicleList: any [] = [];
  transportersList : any[] = [];
  headers: any [] = [];
  loadSpinner : boolean = true;
  locations: any[] = APIConstant.locationsListDropdown;
  constructor(private router: Router,
    private xlsxService: XlsxService,
    private vehicleService : VehicleService,
    private toastr : ToastrService
  ) { }

  ngOnInit(): void {
    this.getVehicleList();
    this.getTransportersList();
  }

  getVehicleList(){
    let data = {
      "locationIds": APIConstant.locationsListDropdown.map((e:any)=>(e.id)),
      "vehicleNumber": "",
      "transporterId": 0
    }
    this.vehicleService.getVehicles(data).subscribe((response:any) => {
      this.vehiclesList = response.vehicles;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getData(e:any){
    this.loadSpinner = true;
    let data = {
      "locationIds": e.locationIds || [],
      "vehicleNumber": e.vehicleNumber ||  "",
      "transporterId": e.transporterId ||  0
    }
    this.vehicleService.getVehicles(data).subscribe((response:any) => {
      this.vehiclesList = response.vehicles;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getTransportersList() {
    let data = {
      "locationIds": [],
      "transporterCode": "",
      "transporterName": "",
      "city": "",
      "state": "",
      "taxationType": "",
      "locations": ""
    }
    this.vehicleService.getTransporters(data).subscribe((response: any) => {
      this.transportersList = response.transporters;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  //ROUTING TO CREATE VEHICLE PAGE
  onCreateVehicle() {
    this.router.navigate(['master/addVehicle'])
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Vehicle") {
    // Map the data to include only the necessary fields
    const mappedVehiclesList = this.vehiclesList.map(vehicle => ({
      vehicleNumber: vehicle.vehicleNumber,
      vehicleSize: vehicle.vehicleSize.value,
      transporterName: vehicle.transporterEntity.transporterName,
      ownerName: vehicle.transporterEntity.ownerName,
      transporterAddress1: vehicle.transporterEntity.transporterAddress1,
      transporterContactNo: vehicle.transporterEntity.transporterContactNo,
      transporterMailId: vehicle.transporterEntity.transporterMailId,
      vehicleCondition: vehicle.vehicleCondition,
      remarks: vehicle.remarks,
      status: vehicle.status
    }));
    this.xlsxService.xlsxExport(mappedVehiclesList, this.headers, fileName);
  }
}
