import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { FreightService } from '../../../core/service/freight.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-freight',
  templateUrl: './freight.component.html',
  styleUrl: './freight.component.scss'
})
export class FreightComponent implements OnInit {

  isFilters: boolean = true;
  searchedFreight: any;
  fullScreen: boolean = false;
  loadSpinner: boolean = true;
  vehcileSizes : any[] = [];
  destinations : any[] = [];
  sources : any[] = [];
  
  freightList: any[] = [];

  constructor(private router: Router,
    private freightService: FreightService,
    private exportService: ExportService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getFreightList()
    this.getSourceDropdownData();
    this.getDestinationDropdownData();
    this.getVehicleSizeDropdownData();
  }

  getFreightList() {
    let data = {
      "locationIds": [
        0
      ],
      "screenCode": 101,
      "freightCode": "",
      "source": "",
      "destination": "",
      "vehicleSize": ""
    }
    this.freightService.getFreightsList(data).subscribe((response: any) => {
      this.freightList = response.freights;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getData(e: any) {
    this.loadSpinner = true;
    let data = {
      "locationIds": [
        0
      ],
      "screenCode": 101,
      "freightCode": e.freightCode || "",
      "source": e.source || "",
      "destination": e.destination || "",
      "vehicleSize": e.vehicleSize || ""
    }
    this.freightService.getFreightsList(data).subscribe((response: any) => {
      this.freightList = response.freights;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getSourceDropdownData(){
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'Source'
    this.freightService.getDropdownData(data, type).subscribe((res:any)=>{
      this.sources = res.lookUps
    })
  }

  getDestinationDropdownData(){
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'Destination'
    this.freightService.getDropdownData(data, type).subscribe((res:any)=>{
      this.destinations = res.lookUps
    })
  }

  getVehicleSizeDropdownData(){
    let data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'VehicleSize'
    this.freightService.getDropdownData(data, type).subscribe((res:any)=>{
      this.vehcileSizes = res.lookUps
    })
  }

  //FUNCTION TO REDIRECT USER ON FREIGHT CREATION SCREEN
  onCreateFreight() {
    this.router.navigate(['master/addEditFreight', '0'])
  }

  exportData(fileName: string = "Freight") {
    this.exportService.csvExport(fileName);
  }
} 
