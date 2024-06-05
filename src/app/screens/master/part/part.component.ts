import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-part',
  templateUrl: './part.component.html',
  styleUrl: './part.component.scss'
})
export class PartComponent {

  isFilters: boolean = true;
  searchedPart: string = '';
  fullScreen : boolean = false;
  partsList: any [] = [];
  headers: any [] = [];

  constructor(private router: Router,
    private xlsxService: XlsxService
  ) { }

  onCreatePart() {
    this.router.navigate(['master/addEditPart', '0'])
  }

  searchPart(event: any) {
    this.searchedPart = event;
  }

  onPartsListChange(plantsList: any[]) {
    this.partsList = plantsList;
  }

  onHeadersChange(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Part") {
    // Map the data to include only the necessary fields
    const mappedPartsList = this.partsList.map(part => ({
      partNumber: part.partNumber,
      partName: part.partName,
      description: part.description,
      partSize: part.partSize,
      partPrice: part.partPrice,
      remarks: part.remarks,
      status: part.status
    }));
    this.xlsxService.xlsxExport(mappedPartsList, this.headers, fileName);
  }

}
