import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlantService } from '../../../core/service';
import { ExportService } from '../../../core/service/export.service';
import { XlsxService } from '../../../core/service/xlsx.service';
import { LookupService } from '../../../core/service/lookup.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent implements OnInit {

  isFilters: boolean = true;
  fullScreen: boolean = false;
  plantsList: any[] = [];
  headers: string[] = [];
  cities : any[] = [];
  states : any[] = [];
  loadSpinner : boolean = true;
  constructor(private router: Router,
    private plantService: PlantService,
    private exportService: ExportService,
    private xlsxService: XlsxService,
    private lookupService : LookupService
  ) { }

  ngOnInit() {
    this.getPlantsList();
    this.getCityDropdownData();
    this.getStateDropdownData();
  }

  getPlantsList(){
    let data = {
      "locationIds": [
        0
      ],
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
      "locationIds": [
        0
      ],
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

  onHeadersChange(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Plants") {
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
    console.log(mappedPlantsList, "Mapped Data");
    
    this.xlsxService.xlsxExport(mappedPlantsList, this.headers, fileName);
  }

}
