import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ExportService } from '../../../core/service/export.service';
import { PointChargeService } from '../../../core/service/point-charge.service';
import { ToastrService } from 'ngx-toastr';
import { XlsxService } from '../../../core/service/xlsx.service';
import { APIConstant } from '../../../core/constants';

@Component({
  selector: 'app-point-charge',
  templateUrl: './point-charge.component.html',
  styleUrls: ['./point-charge.component.scss']
})
export class PointChargeComponent implements OnInit {
  locations: any[] = APIConstant.locationsListDropdown;
  isFilters: boolean = true;
  fullScreen : boolean = false;
  loadSpinner : boolean = true;
  pointChargesList : any[] = [];
  headers: any [] = [];
  constructor(private router: Router,
    private pointChargeService : PointChargeService,
    private toastr : ToastrService,
    private xlsxService : XlsxService
  ) { }


  ngOnInit() {
    this.getPointChargesList();
  }

  getPointChargesList() {
    let data = {
      "locationIds": APIConstant.locationsListDropdown.map((e:any)=>(e.id)),
      "screenCode": 101,
      "pointName": ""
    }
    this.pointChargeService.getPointCharges(data).subscribe((response: any) => {
      this.pointChargesList = response.pointCharges;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  getData(e:any) {
    this.loadSpinner = true;
    let data = {
      "locationIds": e.locationIds,
      "screenCode": 101,
      "pointName": e.pointName || ""
    }
    this.pointChargeService.getPointCharges(data).subscribe((response: any) => {
      this.pointChargesList = response.pointCharges;
      this.loadSpinner = false;
    }, error => {
      this.toastr.error(error.error.details.map((detail: any) => detail.description).join('<br>'));
      this.loadSpinner = false;
    })
  }

  // NAVIGATING TO CREATE POINT CHARGE PAGE
  onCreatePointCharge() {
    this.router.navigate(['master/addPointCharge'])
  }

  onExportHeader(headers: string[]) {
    this.headers = headers;
  }

  exportData(fileName: string = "Point Charge") {
    // Map the data to include only the necessary fields
    const mappedPointChargeList = this.pointChargesList.map(pointcharge => ({
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
