import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';
import { FreightService } from '../../../core/service/freight.service';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-freight',
  templateUrl: './freight.component.html',
  styleUrl: './freight.component.scss'
})
export class FreightComponent implements OnInit{

  isFilters: boolean = true;
  searchedFreight: any;
  fullScreen: boolean = false;
  loadSpinner: boolean = true;
  vehcileSizes : any[] = [];
  destinations : any[] = [];
  sources : any[] = [];
  freightList: any[] = [];
  headers: string[] = [];
  locations: any[] = APIConstant.locationsListDropdown;
  constructor(
    private router: Router,
    private xlsxService : XlsxService,
    private freightService : FreightService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getFreightList()
    this.getSourceDropdownData();
    this.getDestinationDropdownData();
    this.getVehicleSizeDropdownData();
  }

  getFreightList() {
    console.log(APIConstant.locationsListDropdown);
    let data = {
      "locationIds": APIConstant.locationsListDropdown.map((e:any)=>(e.id)),
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
      "locationIds": e.locationIds,
      "screenCode": 101,
      "freightCode": e.freightCode,
      "source": e.source,
      "destination": e.destination,
      "vehicleSize": e.vehicleSize
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

  onExportHeader(headers: string[]) {
    this.headers = headers;
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
