import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent {

  isFilters: boolean = true;
  searchedVehicle: string = '';
  fullScreen : boolean = false;
  constructor(private router: Router,
    private exportService: ExportService
  ) { }

  //ROUTING TO CREATE VEHICLE PAGE
  onCreateVehicle() {
    this.router.navigate(['master/addVehicle'])
  }

  searchVehicle(event: any) {
    this.searchedVehicle = event;
  }

  exportData(fileName: string = "Vehicle") {
    this.exportService.csvExport(fileName);
  }
}
