import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-freight',
  templateUrl: './freight.component.html',
  styleUrl: './freight.component.scss'
})
export class FreightComponent {

  isFilters: boolean = true;
  searchedFreight: any;
  fullScreen : boolean = false;
  freightList: any [] = [];
  headers: any [] = [];
  constructor(private router: Router,
    private xlsxService: XlsxService
  ) { }

  //HOLDING SEARCHED VALUE FROM FILTERS
  searchFreightCode(event: any) {
    this.searchedFreight = event;
  }

  //FUNCTION TO REDIRECT USER ON FREIGHT CREATION SCREEN
  onCreateFreight() {
    this.router.navigate(['master/addEditFreight', '0'])
  }

  onFreightListChange(freightList: any[]) {
    this.freightList = freightList;
  }

  onHeadersChange(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Freight") {
    // Map the data to include only the necessary fields
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
