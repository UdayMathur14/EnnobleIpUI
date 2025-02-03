import { Component, OnInit } from '@angular/core';
import { XlsxService } from '../../../core/service/xlsx.service';
import { APIConstant } from '../../../core/constants';
import { LookupService } from '../../../core/service/lookup.service';
import { Router } from '@angular/router';
import { PlantService } from '../../../core/service';
import { ExportService } from '../../../core/service/export.service';

@Component({
  selector: 'app-plant',
  templateUrl: './plant.component.html',
  styleUrls: ['./plant.component.scss'],
})
export class PlantComponent implements OnInit {
  loadSpinner: boolean = true;
  isFilters: boolean = true;
  fullScreen: boolean = false;
  plantsList: any[] = [];
  headers: string[] = [];
  commonLocations: any[] = [];
  currentPage: number = 1;
  count: number = 10;
  totalPlants: number = 0;
  filters: any = [];
  appliedFilters: any = [];
  maxCount: number = Number.MAX_VALUE;
  locationsDropdownData: any = APIConstant.commonLocationsList;

  constructor(
    private router: Router,
    private plantService: PlantService,
    private exportService: ExportService,
    private lookupService: LookupService,
    private xlsxService: XlsxService
  ) {}

  ngOnInit() {
    this.getPlantsList();
  }

  getPlantsList(offset: number = 0,count: number = this.count,filters: any = this.appliedFilters) {
    this.loadSpinner = true;
    let data = {
      locationIds:
        filters?.locations || [],
      plantCode: filters?.plantCode || '',
      auCode: filters?.auCode || '',
      siteCode: filters?.siteCode || '',
      status: filters?.status || '',
    };
    this.plantService.getPlants(data, offset, count).subscribe(
      (response: any) => {
        this.plantsList = response.plants;
        this.totalPlants = response.paging.total;
        this.filters = response.filters;
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  getData(e: any) {
    this.appliedFilters = e;
    this.currentPage = 1;
    this.getPlantsList(0, this.count, this.appliedFilters);
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = 'Plants') {
    let data = {
      locationIds:
        this.appliedFilters?.locations ||
        [],
      plantCode: this.appliedFilters?.plantCode || '',
      city: this.appliedFilters?.city || '',
      state: this.appliedFilters?.state || '',
      auCode: this.appliedFilters?.auCode || '',
      siteCode: this.appliedFilters?.siteCode || '',
      status: this.appliedFilters?.status || '',
    };
    this.plantService.getPlants(data, 0, this.totalPlants).subscribe(
      (response: any) => {
        const plantListToExport = response.plants;

        // Map the data to include only the necessary fields
        const mappedPlantsList = plantListToExport?.map((plant: any) => ({
          plantCode: plant?.plantCode,
          plantDesc: plant?.plantDesc,
          plantAddress: plant?.plantAddress,
          state: plant?.state,
          city: plant?.city,
          panNo: plant?.panNo,
          gstnNo: plant?.gstInNo,
          siteCode: plant?.siteCode,
          status: plant?.status,
        }));
        this.xlsxService.xlsxExport(mappedPlantsList, this.headers, fileName);
        this.loadSpinner = false;
      },
      (error) => {
        this.loadSpinner = false;
      }
    );
  }

  onPageChange(page: number) {
    this.currentPage = page;
    const offset = (this.currentPage - 1) * this.count;
    this.getPlantsList(offset, this.count, this.appliedFilters);
  }

  onPageSizeChange(data: any) {
    this.count = data;
    this.currentPage = 1;
    this.getPlantsList(0, this.count, this.appliedFilters);
  }
}
