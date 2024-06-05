import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlantService } from '../../../core/service';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { ExportService } from '../../../core/service/export.service';
import { XlsxService } from '../../../core/service/xlsx.service';

@Component({
  selector: 'app-point-charge',
  templateUrl: './point-charge.component.html',
  styleUrls: ['./point-charge.component.scss']
})
export class PointChargeComponent implements OnInit {
  isFilters: boolean = false;
  filterKeyword: string = '';
  fullScreen : boolean = false;
  pointChargeList: any [] = [];
  headers: any [] = [];
  
  constructor(private router: Router,
    private xlsxService: XlsxService
  ) { }


  ngOnInit() {

  }

  // NAVIGATING TO CREATE POINT CHARGE PAGE
  onCreatePointCharge() {
    this.router.navigate(['master/addPointCharge'])
  }

  onSearch(e: any) {
    this.filterKeyword = e.target.value;
  }

  onPointChargeChange(pointChargeList: any[]) {
    this.pointChargeList = pointChargeList;
  }

  onHeadersChange(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Point Charge") {
    // Map the data to include only the necessary fields
    const mappedPointChargeList = this.pointChargeList.map(pointcharge => ({
      pointName: pointcharge?.pointName,
      pointCharge: pointcharge?.pointCharge,
      sameLocationCharge: pointcharge?.sameLocationCharge,
      locations: pointcharge?.locations.value,
      materialRemarks: pointcharge?.materialRemarks,
      accountsRemarks: pointcharge?.accountsRemarks, 
      status: pointcharge?.status
    }));
    this.xlsxService.xlsxExport(mappedPointChargeList, this.headers, fileName);
  }
}
