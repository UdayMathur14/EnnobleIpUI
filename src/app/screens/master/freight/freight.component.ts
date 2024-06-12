import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
<<<<<<< HEAD
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';
import { FreightService } from '../../../core/service/freight.service';
import { APIConstant } from '../../../core/constants';
=======
import { FreightService } from '../../../core/service/freight.service';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298

@Component({
  selector: 'app-freight',
  templateUrl: './freight.component.html',
  styleUrl: './freight.component.scss'
})
<<<<<<< HEAD
export class FreightComponent implements OnInit{

=======
export class FreightComponent implements OnInit {
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
  isFilters: boolean = true;
  searchedFreight: any;
  fullScreen: boolean = false;
  loadSpinner: boolean = true;
  vehcileSizes : any[] = [];
  destinations : any[] = [];
  sources : any[] = [];
  freightList: any[] = [];
  headers: string[] = [];
<<<<<<< HEAD
  locations: any[] = APIConstant.locationsListDropdown;
  constructor(
    private router: Router,
    private xlsxService : XlsxService,
    private freightService : FreightService,
=======

  constructor(private router: Router,
    private freightService: FreightService,
    private xlsxService : XlsxService,
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getFreightList()
    this.getSourceDropdownData();
    this.getDestinationDropdownData();
    this.getVehicleSizeDropdownData();
  }

<<<<<<< HEAD
  getFreightList() {
    let data = {
      "locationIds": APIConstant.locationsListDropdown.map((e:any)=>(e.id)),
=======
  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  getFreightList() {
    let data = {
      "locationIds": [
        0
      ],
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
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
<<<<<<< HEAD
      "locationIds": e.locationIds,
      "screenCode": 101,
      "freightCode": e.freightCode,
      "source": e.source,
      "destination": e.destination,
      "vehicleSize": e.vehicleSize
=======
      "locationIds": [
        0
      ],
      "screenCode": 101,
      "freightCode": e.freightCode || "",
      "source": e.source || "",
      "destination": e.destination || "",
      "vehicleSize": e.vehicleSize || ""
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
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
    const type = 'Source';
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

<<<<<<< HEAD
  onExportHeader(headers: string[]) {
    this.headers = headers;
=======
  onFreightListChange(freightList: any[]) {
    this.freightList = freightList;
>>>>>>> 2a3842c7cd6896a480eec9cf9af8e4020d87c298
  }

  exportData(fileName: string = "Freight") {
    const mappedPlantsList = this.freightList.map(freight => ({
      freightCode: freight?.freightCode,
      locations: freight?.locations?.value,
      source: freight?.source?.value,
      destination: freight?.destination?.value,
      vehicleSize: freight?.vehicleSize?.value,
      freightAmount: freight?.freightAmount,
      remarks: freight?.remarks,
      materialRemarks: freight?.materialRemarks,
      accountsRemarks: freight?.accountsRemarks,
      status: freight?.status
    }));
    this.xlsxService.xlsxExport(mappedPlantsList, this.headers, fileName);
  }
} 
