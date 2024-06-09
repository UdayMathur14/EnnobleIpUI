import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlantService } from '../../../core/service';
import { ExportService } from '../../../core/service/export.service';
import { XlsxService } from '../../../core/service/xlsx.service';
import { APIConstant } from '../../../core/constants';
import { LookupService } from '../../../core/service/lookup.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent implements OnInit {
  loadSpinner : boolean = true;
  isFilters: boolean = true;
  fullScreen: boolean = false;
  plantsList: any[] = [];
  headers: string[] = [];
  locations: any[] = APIConstant.locationsListDropdown;
  cities : any[] = [];
  states : any[] = [];

  constructor(private router: Router,
    private plantService: PlantService,
    private exportService: ExportService,
    private lookupService : LookupService,
    private xlsxService: XlsxService
  ) { }

  ngOnInit() {
    this.getPlantsList();
    this.getCityDropdownData();
    this.getStateDropdownData();
  }

  getPlantsList(){
    let data = {
      "locationIds": [],
      "plantCode": "",
      "city": "",
      "state": "",
      "auCode": "",
      "siteCode": ""
    }
    this.plantService.getPlants(data).subscribe((response: any) => {
      this.plantsList = response.plants;
      this.loadSpinner = false;
    }, error => {
      this.loadSpinner = false;
    })
  }

  getCityDropdownData(){
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'City'
    this.lookupService.getDropdownData(type).subscribe((res:any)=>{
      this.cities = res.lookUps;
    })
  }

  getStateDropdownData(){
    const data = {
      "CreationDate": "",
      "LastUpdatedBy": "",
      "LastUpdateDate": ""
    }
    const type = 'State'
    this.lookupService.getDropdownData(type).subscribe((res:any)=>{
      this.states = res.lookUps;
    })
  }

  getData(e:any){
    this.loadSpinner = true;
    let data = {
      "locationIds": e.locations || [],
      "plantCode": e.plantCode || "",
      "city": e.city || "",
      "state": e.state || "",
      "auCode": e.auCode || "",
      "siteCode": e.siteCode || ""
    }
    this.plantService.getPlants(data).subscribe((response: any) => {
      this.plantsList = response.plants;
      this.loadSpinner = false;
    }, error => {
      this.loadSpinner = false
    })
  }

  onPlantsListChange(plantsList: any[]) {
    this.plantsList = plantsList;
  }

  onHeadersChange(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Plants") {
    // Map the data to include only the necessary fields
    const mappedPlantsList = this.plantsList.map(plant => ({
      plantCode: plant.plantCode,
      plantDesc: plant.plantDesc,
      plantAddress: plant.plantAddress,
      state: plant.state.value,
      city: plant.city.value,
      panNo: plant.panNo,
      gstnNo: plant.gstnNo,
      siteCode: plant.siteCode,
      locationCode: plant.locations.value,
      dsc: plant.dsc,
      dcp: plant.dcp,
      status: plant.status
    }));
    this.xlsxService.xlsxExport(mappedPlantsList, this.headers, fileName);
  }

}
