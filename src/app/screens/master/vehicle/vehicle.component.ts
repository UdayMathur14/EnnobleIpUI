import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent {

  isFilters: boolean = true;
  searchedVehicle: string = '';
  fullScreen : boolean = false;
  vehicleList: any [] = [];
  headers: any [] = [];
  constructor(private router: Router,
    private xlsxService: XlsxService
  ) { }

  //ROUTING TO CREATE VEHICLE PAGE
  onCreateVehicle() {
    this.router.navigate(['master/addVehicle'])
  }

  searchVehicle(event: any) {
    this.searchedVehicle = event;
  }

  onVehicleChange(plantsList: any[]) {
    this.vehicleList = plantsList;
  }

  onHeadersChange(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Vehicle") {
    // Map the data to include only the necessary fields
    const mappedVehiclesList = this.vehicleList.map(vehicle => ({
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
