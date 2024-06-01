import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlantService } from '../../../core/service';
import { ExportService } from '../../../core/service/export.service';
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
  constructor(private router: Router,
    private plantService: PlantService,
    private exportService: ExportService,
    private xlsxService: XlsxService
  ) { }

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
    console.log('Exporting Plants List:', this.plantsList);
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
    console.log(mappedPlantsList, "Mapped Data");
    
    this.xlsxService.xlsxExport(mappedPlantsList, this.headers, fileName);
  }

}
