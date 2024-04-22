import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrl: './vehicle.component.scss'
})
export class VehicleComponent {
  exportAsConfig: ExportAsConfig = {
    type: 'csv', // the file type to download
    elementIdOrContent: 'exportableTable', // the id of html/table element
  }
  constructor(private router : Router,
    private exportAsService: ExportAsService
  ){}

  isFilters : boolean = true;
  searchedVehicle: string = '';

  //ROUTING TO CREATE VEHICLE PAGE
  onCreateVehicle(){
    this.router.navigate(['master/addVehicle'])
  }

  searchVehicle(event: any) {
    this.searchedVehicle = event;
  }

  exportData(fileName : string){
    this.exportAsService.save(this.exportAsConfig, fileName).subscribe(() => {
    });
  }
}
