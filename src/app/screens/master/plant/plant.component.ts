import { Component, OnInit } from '@angular/core';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss']
})
export class PlantComponent implements OnInit {

  isFilters: boolean = false;
  filterKeyword: string = '';
  fullScreen: boolean = false;
  plantsList: any[] = [];
  headers: string[] = [];

  constructor(private xlsxService: XlsxService) { }

  ngOnInit() {
  }

  onSearch(e: any) {
    this.filterKeyword = e.target.value;
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
